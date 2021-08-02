/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {getAttributeValue, setAttributeValue} from "./set-attribute-value";
import {getChildValue, nodeInfo, setChildValue} from "./set-child-value";
import {changeFromTo} from "../change-tracking/change-from-to";
import {RefInternal} from "../hooks/ref-hooks";
import {requestRender} from "../render-queue";
import {ApplyResult, union} from "../change-tracking/change-types";
import {logWarn} from "../../util/logging";
import {bindToStateContext} from "../component-state";
import {ModrnHTMLElement} from "../types/component-registry";
import {
    AttributeVariable,
    MappingType,
    SpecialAttributeValueTransformerFn,
    SpecialAttributeVariable,
    ValueTransformerFn,
    VariableMapping,
    VariableMappings
} from "../types/variables";
import {
    ComplexExpression,
    ConstantExpression,
    ExpressionType,
    FunctionReferenceExpression
} from "../types/expression-types";

/**
 * Substitute variables in the children of the provided ModrnHTMLElement.
 *
 * It is important to keep in mind that the variable definition's ".sorted" contains a list of referenced variables sorted by child node
 * in ascending depth order.
 *
 * The process outlined is:
 *      - For each child node in the template which is referencing variables,
 *        - Check if constants must be applied
 *        - For all variables *defined in the varsProvided* parameter, check if this childnode uses that variable at all; if not, skip
 *        - Then iterate all variable references using the current variable from varsProvided
 *        - If it is a complex expression (i.e. potentially referencing more than just one variable from varsProvided), check if it was already calculated
 *        - Set the value to the variable value or expression result
 *      - Repeat
 *
 * Initially the process was to just iterate over varsProvided, but this has proven not as effective since it meant searching a child node
 * multiple times, and potentially updating it also multiple times (instead of one time, then queueing a re-render after being finished)
 *
 * For now this is good enough; maybe i'Ll revert it to the previous algorithm with kind of in-place-node-ordering/caching, but the gain does not outweigh
 * the cost right now. Should this ever be used with large(ish) apps, it shouldn't pose a problem to optimize according to the then-real world scenario.
 *
 * @param self
 * @param root
 * @param varsProvided
 * @param variableDefinitionsProvided
 * @param suppressReRender
 */
export function substituteVariables(self: ModrnHTMLElement, root: Element, varsProvided: Vars, variableDefinitionsProvided?: VariableMappings, suppressReRender = false): void {

    const componentInfoProvided = self.componentInfo;
    const vars = {...varsProvided, ...self.componentInfo?.registeredComponent.filters};
    if (!componentInfoProvided) {
        throw new Error(`Can only substitute variables after component info is initialized for ${nodeInfo(self)} node`);
    }
    const componentInfo = componentInfoProvided;

    const variableDefinitions = variableDefinitionsProvided || componentInfo.content?.variableDefinitions;
    if (!variableDefinitions) {
        return;
    }

    const processedExpressions: { [originalExpression: string]: unknown } = {};

    // Iterate over child nodes which reference variables
    variableDefinitions.sorted.forEach(variableDefinitionForNode => {

        let _node: ChildNode | null;
        function node() {
            return _node || (_node = getNode(root, variableDefinitionForNode.indexes));
        }

        const constants = variableDefinitionForNode.mappings.__constants;
        const slotsBySpecialAttribute: { [specialAttributeId: string]: Record<string, unknown> } = {};
        const specialAttributeProcessFns: (() => boolean)[] = [];

        const applyResult: ApplyResult = {madeChanges: false};

        // Apply constants, if any
        constants.forEach(constant => {
            const value = wrapFunctionWithContextIfRequired((constant.expression as ConstantExpression).value);
            if (value) {
                if ((value as Promise<unknown>).then) {
                    const theNode = node();
                    (value as Promise<unknown>).then(resolved => setValue(theNode, constant, resolved, null, null));
                } else {
                    union(applyResult, setValue(node(), constant, value, slotsBySpecialAttribute, specialAttributeProcessFns));
                }
            }
        });

        // Iterate over provided variables
        Object.keys(vars).forEach(variableName => {

            // And see if there is a mapping for this variable in this node
            const matches = variableDefinitionForNode.mappings[variableName] || [];

            // If yes, apply
            for (const match of matches) {
                let value: unknown;

                if (match.expression.expressionType === ExpressionType.VariableUsage) {
                    // Just variable reference
                    value = vars[variableName];
                } else if (match.expression.expressionType === ExpressionType.ComplexExpression) {
                    // Complex expression
                    try {
                        const complexExpression = match.expression as ComplexExpression;
                        value = (complexExpression.originalExpression in processedExpressions)
                            ? processedExpressions[complexExpression.originalExpression]
                            : (processedExpressions[complexExpression.originalExpression] = complexExpression.compiledExpression(vars));
                    } catch (err) {
                        logWarn(`Couldn't evaluate expression on ${nodeInfo(self)} triggered by ${variableName}`);
                        value = undefined;
                    }
                } else if (match.expression.expressionType === ExpressionType.FunctionReferenceExpression) {
                    // Function reference
                    const functionReferenceExpression = match.expression as FunctionReferenceExpression;
                    value = (functionReferenceExpression.originalExpression in processedExpressions)
                        ? processedExpressions[functionReferenceExpression.originalExpression]
                        : (processedExpressions[functionReferenceExpression.originalExpression] = () => functionReferenceExpression.compiledExpression(vars));
                }
                value = wrapFunctionWithContextIfRequired(value);
                // If promise, set asynchronously, otherwise directly
                if ((value as Promise<unknown>)?.then) {
                    const theNode = node();
                    (value as Promise<unknown>).then(resolved => setValue(theNode, match, resolved, null, null).madeChanges);
                } else {
                    union(applyResult, setValue(node(), match, value, slotsBySpecialAttribute, specialAttributeProcessFns));
                }
            }
        });

        // Special attributes may require post processing
        if (specialAttributeProcessFns?.map(fn => fn()).filter(res => res).length) {
            applyResult.madeChanges = true;
        }
    });

    function setValue(node: ChildNode, match: VariableMapping, valueProvided: unknown,
        slotsBySpecialAttribute: { [specialAttributeId: string]: Record<string, unknown> } | null,
        specialAttributeProcessFns: ((() => boolean)[]) | null) {

        if (!componentInfo) {
            throw new Error(`Can only substitute variables after component info is initialized for ${nodeInfo(self)} node`);
        }

        let applyResult: ApplyResult = {madeChanges: false};

        switch (match.type) {
        case MappingType.attributeRef: {
            if (node instanceof HTMLElement) {
                const value = match.valueTransformer ? (match.valueTransformer as ValueTransformerFn)(node, valueProvided) : valueProvided;
                const ref = value as RefInternal;
                ref.__addRef(node);
            }
            if (node instanceof ModrnHTMLElement && node.componentInfo?.registeredComponent?.transparent && !suppressReRender) {
                requestRender(node as ModrnHTMLElement);
            }
            break;
        }
        case MappingType.specialAttribute: {
            const attributeVariable = match as SpecialAttributeVariable;
            const attributeName = attributeVariable.specialAttributeRegistration.attributeName;
            if (!(node instanceof HTMLElement)) {
                throw new Error(`Special attribute can not be set on regular node (${node}), ${attributeName}`);
            }
            if (match.valueTransformer) {
                if (!slotsBySpecialAttribute || !specialAttributeProcessFns) {
                    throw new Error("Special attributes must not be used with promises");
                }
                let slots = slotsBySpecialAttribute[attributeVariable.specialAttributeRegistration.id];
                if (!slots) {
                    slots = slotsBySpecialAttribute[attributeVariable.specialAttributeRegistration.id] = {};
                    specialAttributeProcessFns.push(() => {
                        const value = (match.valueTransformer as SpecialAttributeValueTransformerFn)(node, slots);
                        return setAsAttribute(node, attributeName, value).madeChanges;
                    });
                }
                slots[attributeVariable.attributeName] = valueProvided;
            } else {
                applyResult = setAsAttribute(node, attributeName, valueProvided);
            }
            break;
        }
        case MappingType.attribute: {
            const attributeVariable = match as AttributeVariable;
            const attributeName = attributeVariable.attributeName;
            if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
                throw new Error(`Attribute can not be set on regular node (${node}), ${attributeName}`);
            }
            const value = match.valueTransformer ? (match.valueTransformer as ValueTransformerFn)(node, valueProvided) : valueProvided;
            applyResult = setAsAttribute(node, attributeName, value);
            break;
        }
        case MappingType.childVariable: {
            applyResult = setAsChildValue(node as HTMLElement, match, valueProvided);
            break;
        }
        default:
            throw new Error("Unsupported");
        }
        return applyResult;
    }

    function setAsAttribute(node: HTMLElement | SVGElement, attributeName: string, value: unknown) {
        const original = getAttributeValue(self, node, attributeName);
        setAttributeValue(self, node, attributeName, value, true);
        return changeFromTo(original, value, self, !suppressReRender && node);
    }

    function setAsChildValue(node: HTMLElement, match: VariableMapping, valueProvided: unknown) {
        const original = getChildValue(self, node);
        const value = setChildValue(self, node, match, valueProvided);
        return changeFromTo(original, value, self, !suppressReRender && node);
    }
}

export type VarOptions = {
    hideByDefault?: boolean;
}

export type Vars = Record<string, unknown> & { "__options"?: VarOptions };

export function varsWithOptions(vars: Record<string, unknown>, options: VarOptions): Vars {
    return {...vars, __options: options};
}

function getNode(rootElement: Element, indexes: number[]): ChildNode {
    let current: ChildNode = rootElement;
    for (const index of indexes) {
        current = current.childNodes.item(index);
    }
    return current as ChildNode;
}

function wrapFunctionWithContextIfRequired(value: unknown) {
    if (typeof value === "function") {
        if (!("bound" in value)) {
            value = bindToStateContext(value as () => unknown);
        }
    }
    return value;
}


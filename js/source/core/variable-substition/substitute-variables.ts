import {
    AttributeVariable,
    bindToStateContext,
    ComplexExpression,
    ConstantExpression,
    ExpressionType,
    FunctionReferenceExpression,
    MappingType,
    ModrnHTMLElement,
    SpecialAttributeValueTransformerFn,
    SpecialAttributeVariable,
    ValueTransformerFn,
    VariableMapping,
    VariableMappings
} from "../component-registry";
import {getAttributeValue, setAttributeValue} from "./set-attribute-value";
import {getChildValue, setChildValue} from "./set-child-value";
import {changeFromTo} from "../change-tracking/change-from-to";
import {RefInternal} from "../ref-hooks";
import {requestReRenderDeep} from "../render-queue";
import {ApplyResult, union} from "../change-tracking/change-types";
import {logWarn} from "../../util/logging";

export type VarOptions = {
    hideByDefault?: boolean;
}

export type Vars = Record<string, unknown> & { "__options"?: VarOptions };

export function varsWithOptions(vars: Record<string, unknown>, options: VarOptions): Vars {
    return {...vars, __options: options};
}

function getNode(rootElement: HTMLElement, indexes: number[]): ChildNode {
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

export function substituteVariables(self: ModrnHTMLElement, root: HTMLElement, varsProvided: Vars, variableDefinitionsProvided?: VariableMappings, suppressReRender = false): void {

    const componentInfoProvided = self.componentInfo;
    const vars = {...varsProvided, ...self.componentInfo?.registeredComponent.filters};
    if (!componentInfoProvided) {
        throw new Error(`Can only substitute variables after component info is initialized for ${self} node`);
    }
    const componentInfo = componentInfoProvided;

    const variableDefinitions = variableDefinitionsProvided || componentInfo.content?.variableDefinitions;
    if (!variableDefinitions) {
        return;
    }

    const processedExpressions: { [originalExpression: string]: unknown } = {};

    variableDefinitions.sorted.forEach(variableDefinition => {

        const node = getNode(root, variableDefinition.indexes);
        const constants = variableDefinition.mappings.__constants;
        const slotsBySpecialAttribute: { [specialAttributeId: string]: Record<string, unknown> } = {};
        const specialAttributeProcessFns: (() => boolean)[] = [];

        const applyResult: ApplyResult = {madeChanges: false};
        constants.forEach(constant => {
            const value = wrapFunctionWithContextIfRequired((constant.expression as ConstantExpression).value);
            if (value) {
                if ((value as Promise<unknown>).then) {
                    (value as Promise<unknown>).then(resolved => setValue(node, constant, resolved, null, null));
                } else {
                    union(applyResult, setValue(node, constant, value, slotsBySpecialAttribute, specialAttributeProcessFns));
                }
            }
        });

        Object.keys(vars).forEach(variableName => {
            const matches = variableDefinition.mappings[variableName] || [];

            for (const match of matches) {
                let value: unknown;
                if (match.expression.expressionType === ExpressionType.VariableUsage) {
                    value = vars[variableName];
                } else if (match.expression.expressionType === ExpressionType.ComplexExpression) {
                    try {
                        const complexExpression = match.expression as ComplexExpression;
                        value = (complexExpression.originalExpression in processedExpressions)
                            ? processedExpressions[complexExpression.originalExpression]
                            : (processedExpressions[complexExpression.originalExpression] = complexExpression.compiledExpression(vars));
                    } catch (err) {
                        logWarn(`Couldn't evaluate expression on ${self} triggered by ${variableName}`);
                        value = undefined;
                    }
                } else if (match.expression.expressionType === ExpressionType.FunctionReferenceExpression) {
                    const functionReferenceExpression = match.expression as FunctionReferenceExpression;
                    value = (functionReferenceExpression.originalExpression in processedExpressions)
                        ? processedExpressions[functionReferenceExpression.originalExpression]
                        : (processedExpressions[functionReferenceExpression.originalExpression] = () => functionReferenceExpression.compiledExpression(vars));
                }
                value = wrapFunctionWithContextIfRequired(value);
                if ((value as Promise<unknown>)?.then) {
                    (value as Promise<unknown>).then(resolved => setValue(node, match, resolved, null, null).madeChanges);
                } else {
                    union(applyResult, setValue(node, match, value, slotsBySpecialAttribute, specialAttributeProcessFns));
                }
            }
        });

        if (specialAttributeProcessFns?.map(fn => fn()).filter(res => res).length) {
            applyResult.madeChanges = true;
        }

        if (applyResult.madeChanges && (node instanceof ModrnHTMLElement && node.componentInfo?.registeredComponent?.transparent && !suppressReRender)) {
            requestReRenderDeep(node as HTMLElement);
        }
    });

    function setValue(node: ChildNode, match: VariableMapping, valueProvided: unknown,
        slotsBySpecialAttribute: { [specialAttributeId: string]: Record<string, unknown> } | null,
        specialAttributeProcessFns: ((() => boolean)[]) | null) {

        if (!componentInfo) {
            throw new Error(`Can only substitute variables after component info is initialized for ${self} node`);
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
                requestReRenderDeep(node as HTMLElement);
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
        const original = getAttributeValue(self, componentInfo, node, attributeName);
        setAttributeValue(self, componentInfo, node, attributeName, value, true);
        return changeFromTo(original, value, self, !suppressReRender && node);
    }

    function setAsChildValue(node: HTMLElement, match: VariableMapping, valueProvided: unknown) {
        const original = getChildValue(self, componentInfo, node);
        const value = setChildValue(self, componentInfo, node, match, valueProvided);
        return changeFromTo(original, value, self, !suppressReRender && node);
    }
}

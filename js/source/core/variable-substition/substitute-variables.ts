import {
    AttributeVariable,
    bindToStateContext,
    ComplexExpression,
    ConstantExpression,
    ExpressionType,
    MappingType,
    ModrnHTMLElement,
    SpecialAttributeVariable,
    VariableMapping,
    VariableMappings
} from "../component-registry";
import {getAttributeValue, setAttributeValue} from "./set-attribute-value";
import {getChildValue, setChildValue} from "./set-child-value";
import {changeFromTo} from "../change-tracking/change-from-to";
import {RefInternal} from "../ref-hooks";
import {requestReRenderDeep} from "../render-queue";
import {ApplyResult} from "../change-tracking/change-types";

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
    // if (current.nodeType !== 1) {
    //     return convertToElement(current, indexes, rootElement);
    // }
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

export function substituteVariables(self: ModrnHTMLElement, root: HTMLElement, vars: Vars, variableDefinitionsProvided?: VariableMappings, suppressReRender = false): void {

    const componentInfoProvided = self.componentInfo;
    if (!componentInfoProvided) {
        throw new Error(`Can only substitute variables after component info is initialized for ${self} node`);
    }
    const componentInfo = componentInfoProvided;

    const variableDefinitions = variableDefinitionsProvided || componentInfo.content?.variableDefinitions;
    if (!variableDefinitions) {
        return;
    }

    variableDefinitions["__constants"].forEach(constant => {
        const value = wrapFunctionWithContextIfRequired((constant.expression as ConstantExpression).value);
        if (value) {
            if ((value as Promise<unknown>).then) {
                (value as Promise<unknown>).then(resolved => setValue(constant, resolved));
            } else {
                setValue(constant, value);
            }
        }
    });

    Object.keys(vars).forEach(variableName => {
        const matches = variableDefinitions[variableName] || [];

        for (const match of matches) {
            let value: unknown;
            if (match.expression.expressionType === ExpressionType.VariableUsage) {
                value = vars[variableName];
            } else if (match.expression.expressionType === ExpressionType.ComplexExpression) {
                value = (match.expression as ComplexExpression).compiledExpression(vars);
            }
            value = wrapFunctionWithContextIfRequired(value);
            if ((value as Promise<unknown>)?.then) {
                (value as Promise<unknown>).then(resolved => setValue(match, resolved));
            } else {
                setValue(match, value);
            }
        }
    });

    function setValue(match: VariableMapping, valueProvided: unknown) {

        if (!componentInfo) {
            throw new Error(`Can only substitute variables after component info is initialized for ${self} node`);
        }

        const node = getNode(root, match.indexes);
        let applyResult: ApplyResult = {madeChanges: false};

        switch (match.type) {
        case MappingType.attributeRef: {
            if (node instanceof HTMLElement) {
                const value = match.valueTransformer ? match.valueTransformer(node, valueProvided) : valueProvided;
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
            const value = match.valueTransformer ? match.valueTransformer(node, valueProvided) : valueProvided;
            applyResult = setAsAttribute(node, attributeName, value);
            break;
        }
        case MappingType.attribute: {
            const attributeVariable = match as AttributeVariable;
            const attributeName = attributeVariable.attributeName;
            if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
                throw new Error(`Attribute can not be set on regular node (${node}), ${attributeName}`);
            }
            const value = match.valueTransformer ? match.valueTransformer(node, valueProvided) : valueProvided;
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

        if (applyResult.madeChanges && (node instanceof ModrnHTMLElement && node.componentInfo?.registeredComponent?.transparent && !suppressReRender)) {
            requestReRenderDeep(node as HTMLElement);
        }
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

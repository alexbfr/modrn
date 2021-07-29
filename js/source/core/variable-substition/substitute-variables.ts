import {
    AttributeVariable,
    bindToStateContext,
    ComplexExpression,
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

    const hideByDefault = !!vars.__options?.hideByDefault;

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
            if ((value as Promise<unknown>).then) {
                (value as Promise<unknown>).then(resolved => setValue(match, resolved));
            } else {
                setValue(match, value);
            }
        }

    });

    function setValue(match: VariableMapping, value: unknown) {

        if (!componentInfo) {
            throw new Error(`Can only substitute variables after component info is initialized for ${self} node`);
        }

        const node = getNode(root, match.indexes);
        if (node instanceof ModrnHTMLElement && node.componentInfo?.registeredComponent?.transparent && !suppressReRender) {
            requestReRenderDeep(node as HTMLElement);
        }
        switch (match.type) {
        case MappingType.attributeRef: {
            if (node instanceof HTMLElement) {
                const ref = value as RefInternal;
                ref.__addRef(node);
            }
            break;
        }
        case MappingType.specialAttribute: {
            const attributeVariable = match as SpecialAttributeVariable;
            if (!(node instanceof HTMLElement)) {
                throw new Error(`Special attribute can not be set on regular node (${node}), ${attributeVariable.specialAttributeRegistration.attributeName}`);
            }
            const original = getAttributeValue(self, componentInfo, node, attributeVariable.specialAttributeRegistration.attributeName);
            setAttributeValue(self, componentInfo, node, attributeVariable.specialAttributeRegistration.attributeName, value, true);
            changeFromTo(original, value, self, !suppressReRender && node);
            break;
        }
        case MappingType.attribute: {
            const attributeVariable = match as AttributeVariable;
            if (!(node instanceof HTMLElement)) {
                throw new Error(`Attribute can not be set on regular node (${node}), ${attributeVariable.attributeName}`);
            }
            const original = getAttributeValue(self, componentInfo, node, attributeVariable.attributeName);
            setAttributeValue(self, componentInfo, node, attributeVariable.attributeName, value, hideByDefault || !!attributeVariable.hidden);
            changeFromTo(original, value, self, !suppressReRender && node);
            break;
        }
        case MappingType.childVariable: {
            const original = getChildValue(self, componentInfo, node);
            setChildValue(self, componentInfo, node, value);
            changeFromTo(original, value, self, !suppressReRender && node);
            break;
        }
        default:
            throw new Error("Unsupported");
        }
    }
}

import {
    AttributeVariable,
    bindToStateContext,
    ModrnHTMLElement, SpecialAttributeVariable,
    Variable,
    Variables,
    VariableType
} from "../component-registry";
import {getAttributeValue, setAttributeValue} from "./set-attribute-value";
import {getChildValue, setChildValue} from "./set-child-value";
import {changeFromTo} from "../change-tracking/change-from-to";
import {RefInternal} from "../ref-hooks";
import {requestRender, requestReRenderDeep} from "../render-queue";

export type VarOptions = {
    hideByDefault?: boolean;
}

export type Vars = Record<string, unknown> & { "__options"?: VarOptions };

export function varsWithOptions(vars: Record<string, unknown>, options: VarOptions): Vars {
    return {...vars, __options: options };
}

function convertToElement(current: ChildNode, indexes: number[], rootElement: HTMLElement) {
    const contentsElement = document.createElement("div");
    contentsElement.style.display = "contents";
    contentsElement.textContent = current.textContent;
    const parent = current.parentElement;
    if (!parent) {
        throw new Error(`Missing parent for child node with indexes ${indexes} on ${rootElement}`);
    }
    parent.insertBefore(contentsElement, current);
    parent.removeChild(current);
    return contentsElement;
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

function wrapFunctionWithContextIfRequired(value: any, originalValue: any) {
    if (typeof value === "function") {
        if (!("bound" in originalValue)) {
            value = bindToStateContext(originalValue as () => unknown);
        }
    }
    return value;
}

export function substituteVariables(self: ModrnHTMLElement, root: HTMLElement, vars: Vars, variableDefinitionsProvided?: Variables, suppressReRender = false): void {

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

    Object.entries(vars).forEach(([variableName, originalValue]) => {
        const matches = variableDefinitions[variableName] || [];

        let value: unknown = originalValue;
        value = wrapFunctionWithContextIfRequired(value, originalValue);
        if ((value as Promise<unknown>).then) {
            (value as Promise<unknown>).then(resolved => setValue(matches, resolved));
        } else {
            setValue(matches, value);
        }
    });

    function setValue(matches: Variable[], value: unknown) {

        if (!componentInfo) {
            throw new Error(`Can only substitute variables after component info is initialized for ${self} node`);
        }

        for (const match of matches) {
            const node = getNode(root, match.indexes);
            if (node instanceof ModrnHTMLElement && node.componentInfo?.registeredComponent?.transparent && !suppressReRender) {
                requestReRenderDeep(node as HTMLElement);
            }
            switch (match.type) {
            case VariableType.attributeRef: {
                if (node instanceof HTMLElement) {
                    const ref = value as RefInternal;
                    ref.__addRef(node);
                }
                break;
            }
            case VariableType.specialAttribute: {
                const attributeVariable = match as SpecialAttributeVariable;
                if (!(node instanceof  HTMLElement)) {
                    throw new Error(`Special attribute can not be set on regular node (${node}), ${attributeVariable.specialAttributeRegistration.attributeName}`);
                }
                const original = getAttributeValue(self, componentInfo, node, attributeVariable.specialAttributeRegistration.attributeName);
                setAttributeValue(self, componentInfo, node, attributeVariable.specialAttributeRegistration.attributeName, value, true);
                changeFromTo(original, value, self);
                break;
            }
            case VariableType.attribute: {
                const attributeVariable = match as AttributeVariable;
                if (!(node instanceof  HTMLElement)) {
                    throw new Error(`Attribute can not be set on regular node (${node}), ${attributeVariable.attributeName}`);
                }
                const original = getAttributeValue(self, componentInfo, node, attributeVariable.attributeName);
                setAttributeValue(self, componentInfo, node, attributeVariable.attributeName, value, hideByDefault || !!attributeVariable.hidden);
                changeFromTo(original, value, self);
                break;
            }
            case VariableType.childVariable: {
                const original = getChildValue(self, componentInfo, node);
                setChildValue(self, componentInfo, node, value);
                changeFromTo(original, value, self);
                break;
            }
            default:
                throw new Error("Unsupported");
            }
        }
    }
}

import {ComponentInfo, ModrnHTMLElement} from "../component-registry";

export function getAttributeValue(self: ModrnHTMLElement, componentInfo: ComponentInfo, node: HTMLElement, attributeName: string): unknown {
    if (node instanceof ModrnHTMLElement) {
        const state = node?.state;
        if (!state) {
            const initialCustomProps = self.initialCustomProps;
            if (initialCustomProps && (attributeName in initialCustomProps)) {
                return initialCustomProps[attributeName];
            }
        } else {
            if (attributeName in state.customProps) {
                return state.customProps[attributeName];
            }
        }
    }
    if (attributeName in node) {
        return (node as unknown as Record<string, unknown>)[attributeName];
    }
    return node.getAttribute(attributeName);
}

export function setAttributeValue(self: ModrnHTMLElement, componentInfo: ComponentInfo, node: HTMLElement, attributeName: string, value: unknown, hidden: boolean): void {
    if (node instanceof ModrnHTMLElement) {
        const state = node?.state;
        if (!state) {
            node.initialCustomProps = {...node.initialCustomProps, [attributeName]: value};
        } else
        {
            state.customProps[attributeName] = value;
        }
        if (!hidden) {
            node.setAttribute(attributeName, "" + value);
        }
    } else {
        if (typeof value === "string" || typeof value === "number") {
            node.setAttribute(attributeName, "" + value);
        } else if (typeof value === "boolean") {
            if (value) {
                node.setAttribute(attributeName, "1");
            } else {
                node.removeAttribute(attributeName);
            }
        } else if (typeof value === "undefined" || value === null) {
            node.setAttribute(attributeName, "");
        } else if (typeof value === "function") {
            if (attributeName in node) {
                (node as unknown as Record<string, unknown>)[attributeName] = value;
            } else {
                throw new Error(`Cannot set attribute ${attributeName} on ${node} of ${self}: event handler does not exist`);
            }
        } else {
            throw new Error(`Cannot set attribute ${attributeName} on ${node} of ${self} to ${value}: cannot map type`);
        }
    }
}

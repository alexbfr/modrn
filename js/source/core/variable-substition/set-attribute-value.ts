import {ComponentInfo, ModrnHTMLElement} from "../component-registry";
import {unTagify} from "../../util/tagify";
import {nodeInfo} from "./set-child-value";

const hasWarned: Record<string, true> = {};

export function getAttributeValue(self: ModrnHTMLElement, componentInfo: ComponentInfo, node: HTMLElement | SVGElement, attributeNameOriginal: string): unknown {
    if (node instanceof ModrnHTMLElement) {
        const attributeName = unTagify(attributeNameOriginal, true);
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
    const attributeName = attributeNameOriginal;
    if (attributeName in node) {
        return (node as unknown as Record<string, unknown>)[attributeName];
    }
    return node.getAttribute(attributeName);
}

export function setAttributeValue(self: ModrnHTMLElement, componentInfo: ComponentInfo, node: HTMLElement | SVGElement, attributeName: string, value: unknown, hidden: boolean): void {
    const untagifiedName = unTagify(attributeName, true);
    if (node instanceof ModrnHTMLElement) {
        const state = node?.state;
        if (!state) {
            node.initialCustomProps = {...node.initialCustomProps, [untagifiedName]: value};
        } else
        {
            state.customProps[untagifiedName] = value;
        }
        if (!hidden) {
            node.setAttribute(attributeName, "" + value);
        }
    } else {
        if (!(node instanceof SVGElement) && attributeName in node) {
            (node as unknown as Record<string, unknown>)[attributeName] = value;
        } else if (attributeName === "checked") {
            (node as HTMLInputElement).checked = !!value;
        } else if (typeof value === "string" || typeof value === "number") {
            node.setAttribute(attributeName, "" + value);
        } else if (typeof value === "boolean") {
            if (value) {
                node.setAttribute(attributeName, "1");
            } else {
                node.removeAttribute(attributeName);
            }
        } else if (typeof value === "undefined" || value === null || value === false) {
            node.removeAttribute(attributeName);
        } else if (typeof value === "function") {
            if (attributeName in node) {
                (node as unknown as Record<string, unknown>)[attributeName] = value;
            } else {
                if (!hasWarned[node.nodeName + "_" + attributeName]) {
                    console.warn(`Cannot set attribute ${attributeName} on ${nodeInfo(node)} of ${nodeInfo(self)}: event handler does not exist`);
                    hasWarned[node.nodeName + "_" + attributeName] = true;
                }
            }
        } else {
            throw new Error(`Cannot set attribute ${attributeName} on ${nodeInfo(node)} of ${nodeInfo(self)} to ${value}: cannot map type`);
        }
    }
}

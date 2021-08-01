import {ComponentInfo, ModrnHTMLElement, ValueTransformerFn, VariableMapping} from "../component-registry";
import {analyzeToFragment} from "../component-static-initialize";
import {requestRender} from "../render-queue";
import {ELEMENT_NODE, TEXT_NODE} from "../variable-analysis/variable-types";
import {ChildCollection} from "../templated-children-hooks";
import {UnsafeHtml} from "./unsafe-html";
import {cloneDeep} from "../../util/cloneDeep";

export function getChildValue(self: ModrnHTMLElement, componentInfo: ComponentInfo, node: Node): unknown {
    if (node instanceof HTMLElement || node instanceof SVGElement) {
        return node;
    }
    if (node.nodeType === TEXT_NODE) {
        return node.textContent;
    }
    throw new Error(`Cannot get child content of ${nodeInfo(node)} of ${nodeInfo(self)}: cannot map type`);
}

export function setChildValue(self: ModrnHTMLElement, componentInfo: ComponentInfo, node: Node, match: VariableMapping, valueProvided: unknown): unknown {

    let value: unknown;
    const valueTransformer = match.valueTransformer as ValueTransformerFn | undefined;
    if (node instanceof SVGElement) {
        debugger;
    }
    if (node instanceof ModrnHTMLElement) {
        const state = node?.state;
        if (!state) {
            throw new Error(`Node is missing state: ${nodeInfo(node)} of ${nodeInfo(self)}`);
        }
        if (typeof valueProvided === "undefined" || valueProvided === null) {
            state.previousChild = null;
        } else if (typeof valueProvided === "object" && valueProvided instanceof HTMLElement) {
            value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
            state.previousChild = analyzeToFragment(value as HTMLElement);
        } else if (typeof valueProvided === "string" || typeof valueProvided === "number" || typeof valueProvided === "boolean") {
            const valueNode = document.createElement("span");
            value = valueTransformer ? valueTransformer(valueNode, valueProvided) : valueProvided;
            valueNode.textContent = "" + value;
            state.previousChild = {childElement: valueNode, variableDefinitions: null};
            return value;
        } else if (typeof valueProvided === "object" && (valueProvided as UnsafeHtml).unsafeHtml) {
            const valueNode = document.createElement("span");
            value = valueTransformer ? valueTransformer(valueNode, valueProvided) : valueProvided;
            valueNode.innerHTML = "" + (value as UnsafeHtml).unsafeHtml;
            state.previousChild = {childElement: valueNode, variableDefinitions: null};
        } else {
            throw new Error(`Cannot set child content on ${nodeInfo(node)} of ${nodeInfo(self)} to ${valueProvided}: cannot map type`);
        }
    } else if (node instanceof HTMLElement || node instanceof SVGElement) {
        if (typeof valueProvided === "undefined" || valueProvided === null) {
            value = valueTransformer ? valueTransformer(node, valueProvided) : "";
            node.innerHTML = value as string;
        } else if (typeof valueProvided === "object" && valueProvided instanceof HTMLElement) {
            value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
            node.innerHTML = "";
            node.appendChild(cloneDeep(value as HTMLElement));
        } else if (typeof valueProvided === "object" && (valueProvided as ChildCollection)?.__childCollection) {
            value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
            const children = (value as ChildCollection).elements;
            let currentElement: Element | null = node.firstElementChild;
            for (const child of children) {
                const replace = child !== currentElement;
                const before = currentElement;
                currentElement = currentElement?.nextElementSibling || null;
                if (replace) {
                    node.insertBefore(child, currentElement);
                    if (before) {
                        node.removeChild(before);
                    }
                }
            }
            while(currentElement != null) {
                const before = currentElement;
                currentElement = currentElement.nextElementSibling;
                node.removeChild(before);
            }
        } else if (typeof valueProvided === "object" && (valueProvided as UnsafeHtml).unsafeHtml) {
            value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
            node.innerHTML = "" + (value as UnsafeHtml).unsafeHtml;
        } else if (typeof valueProvided === "string" || typeof valueProvided === "number" || typeof valueProvided === "boolean") {
            value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
            node.innerHTML = "";
            node.textContent = "" + value;
        } else {
            if (node.nodeName === "PRE") {
                (node as Element).innerHTML = "";
                value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
                node.textContent = JSON.stringify(valueProvided, null, 2);
            } else {
                throw new Error(`Cannot set child content on ${nodeInfo(node)} of ${nodeInfo(self)} to ${valueProvided}: cannot map type`);
            }
        }
    } else if (node.nodeType === TEXT_NODE) {
        if ((valueProvided as ChildCollection)?.__childCollection) {
            const parent = node.parentElement;
            if (!parent) {
                throw new Error(`Parent element missing on ${nodeInfo(node)} of ${nodeInfo(self)}`);
            }
            const newNode = document.createElement("div") as HTMLElement;
            newNode.style.display = "contents";
            value = valueTransformer ? valueTransformer(newNode, valueProvided) : valueProvided;
            const children = (value as ChildCollection).elements;
            children.forEach(newNode.appendChild.bind(newNode));
            parent.insertBefore(newNode, node);
            parent.removeChild(node);
        } else if (typeof valueProvided === "undefined" || valueProvided === null) {
            value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
            node.textContent = "";
        } else if (typeof valueProvided === "object" && valueProvided instanceof HTMLElement) {
            const parent = node.parentElement;
            if (!parent) {
                throw new Error(`Parent element missing on ${nodeInfo(node)} of ${nodeInfo(self)}`);
            }
            value = valueTransformer ? valueTransformer(parent, cloneDeep(valueProvided as HTMLElement)) : cloneDeep(valueProvided as HTMLElement);
            parent.insertBefore(value as HTMLElement, node);
            parent.removeChild(node);
        } else if (typeof valueProvided === "string" || typeof valueProvided === "number" || typeof valueProvided === "boolean") {
            value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
            node.textContent = "" + value;
        } else {
            value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
            node.textContent = JSON.stringify(valueProvided, null, 2);
        }
    }
    if (value instanceof ModrnHTMLElement) {
        requestRender(value);
    }
    return value;
}

export function nodeInfo(node: Node): string {
    if (node.nodeType === ELEMENT_NODE) {
        return node.nodeName.toLowerCase() + "#" + (node as Element).id;
    } else {
        return node.nodeName.toLowerCase();
    }
}

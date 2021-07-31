import {ComponentInfo, ModrnHTMLElement, VariableMapping} from "../component-registry";
import {analyzeToFragment} from "../component-static-initialize";
import {requestRender} from "../render-queue";
import {TEXT_NODE} from "../variable-analysis/variable-types";
import {ChildCollection} from "../templated-children-hooks";
import {UnsafeHtml} from "./unsafe-html";
import {cloneDeep} from "../../util/cloneDeep";

export function getChildValue(self: ModrnHTMLElement, componentInfo: ComponentInfo, node: Node): unknown {
    if (node instanceof HTMLElement) {
        return node;
    }
    if (node.nodeType === TEXT_NODE) {
        return node.textContent;
    }
    throw new Error(`Cannot get child content of ${node} of ${self}: cannot map type`);
}

export function setChildValue(self: ModrnHTMLElement, componentInfo: ComponentInfo, node: Node, match: VariableMapping, valueProvided: unknown): unknown {

    let value: unknown;
    if (node instanceof ModrnHTMLElement) {
        const state = node?.state;
        if (!state) {
            throw new Error(`Node is missing state: ${node} of ${self}`);
        }
        if (typeof valueProvided === "undefined" || valueProvided === null) {
            state.previousChild = null;
        } else if (typeof valueProvided === "object" && valueProvided instanceof HTMLElement) {
            value = match.valueTransformer ? match.valueTransformer(node, valueProvided) : valueProvided;
            state.previousChild = analyzeToFragment(value as HTMLElement);
        } else if (typeof valueProvided === "string" || typeof valueProvided === "number" || typeof valueProvided === "boolean") {
            const valueNode = document.createElement("span");
            value = match.valueTransformer ? match.valueTransformer(valueNode, valueProvided) : valueProvided;
            valueNode.textContent = "" + value;
            state.previousChild = {childElement: valueNode, variableDefinitions: {__constants: []}};
            return value;
        } else if (typeof valueProvided === "object" && (valueProvided as UnsafeHtml).unsafeHtml) {
            const valueNode = document.createElement("span");
            value = match.valueTransformer ? match.valueTransformer(valueNode, valueProvided) : valueProvided;
            valueNode.innerHTML = "" + (value as UnsafeHtml).unsafeHtml;
            state.previousChild = {childElement: valueNode, variableDefinitions: {__constants: []}};
        } else {
            throw new Error(`Cannot set child content on ${node} of ${self} to ${valueProvided}: cannot map type`);
        }
    } else if (node instanceof HTMLElement) {
        if (typeof valueProvided === "undefined" || valueProvided === null) {
            value = match.valueTransformer ? match.valueTransformer(node, valueProvided) : "";
            node.innerHTML = value as string;
        } else if (typeof valueProvided === "object" && valueProvided instanceof HTMLElement) {
            value = match.valueTransformer ? match.valueTransformer(node, valueProvided) : valueProvided;
            node.innerHTML = "";
            node.appendChild(cloneDeep(value as HTMLElement));
        } else if (typeof valueProvided === "object" && (valueProvided as ChildCollection)?.__childCollection) {
            value = match.valueTransformer ? match.valueTransformer(node, valueProvided) : valueProvided;
            const children = (value as ChildCollection).elements;
            node.innerHTML = "";
            children.forEach(node.appendChild.bind(node));
        } else if (typeof valueProvided === "object" && (valueProvided as UnsafeHtml).unsafeHtml) {
            value = match.valueTransformer ? match.valueTransformer(node, valueProvided) : valueProvided;
            node.innerHTML = "" + (value as UnsafeHtml).unsafeHtml;
        } else if (typeof valueProvided === "string" || typeof valueProvided === "number" || typeof valueProvided === "boolean") {
            value = match.valueTransformer ? match.valueTransformer(node, valueProvided) : valueProvided;
            node.innerHTML = "";
            node.textContent = "" + value;
        } else {
            throw new Error(`Cannot set child content on ${node} of ${self} to ${valueProvided}: cannot map type`);
        }
    } else if (node.nodeType === TEXT_NODE) {
        if ((valueProvided as ChildCollection)?.__childCollection) {
            const parent = node.parentElement;
            if (!parent) {
                throw new Error(`Parent element missing on ${node} of ${self}`);
            }
            const newNode = document.createElement("div") as HTMLElement;
            newNode.style.display = "contents";
            value = match.valueTransformer ? match.valueTransformer(newNode, valueProvided) : valueProvided;
            const children = (value as ChildCollection).elements;
            children.forEach(newNode.appendChild.bind(newNode));
            parent.insertBefore(newNode, node);
            parent.removeChild(node);
        } else if (typeof valueProvided === "undefined" || valueProvided === null) {
            value = match.valueTransformer ? match.valueTransformer(node, valueProvided) : valueProvided;
            node.textContent = "";
        } else if (typeof valueProvided === "object" && valueProvided instanceof HTMLElement) {
            const parent = node.parentElement;
            if (!parent) {
                throw new Error(`Parent element missing on ${node} of ${self}`);
            }
            value = match.valueTransformer ? match.valueTransformer(parent, cloneDeep(valueProvided as HTMLElement)) : cloneDeep(valueProvided as HTMLElement);
            parent.insertBefore(value as HTMLElement, node);
            parent.removeChild(node);
        } else if (typeof valueProvided === "string" || typeof valueProvided === "number" || typeof valueProvided === "boolean") {
            value = match.valueTransformer ? match.valueTransformer(node, valueProvided) : valueProvided;
            node.textContent = "" + value;
        } else {
            throw new Error(`Cannot set child content on ${node} of ${self} to ${valueProvided}: cannot map type`);
        }
    }
    if (value instanceof ModrnHTMLElement) {
        requestRender(value);
    }
    return value;
}

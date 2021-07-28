import {ComponentInfo, ModrnHTMLElement} from "../component-registry";
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

export function setChildValue(self: ModrnHTMLElement, componentInfo: ComponentInfo, node: Node, value: unknown): void {

    if (node instanceof ModrnHTMLElement) {
        const state = node?.state;
        if (!state) {
            throw new Error(`Node is missing state: ${node} of ${self}`);
        }
        if (typeof value === "undefined" || value === null) {
            state.previousChild = null;
        } else if (typeof value === "object" && value instanceof HTMLElement) {
            state.previousChild = analyzeToFragment(value).fragment;
        } else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            const valueNode = document.createElement("span");
            valueNode.textContent = "" + value;
            state.previousChild = {childElement: valueNode, variableDefinitions: {}};
        } else if (typeof value === "object" && (value as UnsafeHtml).unsafeHtml) {
            const valueNode = document.createElement("span");
            valueNode.innerHTML = "" + (value as UnsafeHtml).unsafeHtml;
            state.previousChild = {childElement: valueNode, variableDefinitions: {}};
        } else {
            throw new Error(`Cannot set child content on ${node} of ${self} to ${value}: cannot map type`);
        }
        if (value instanceof ModrnHTMLElement) {
            requestRender(value);
        }
    } else if (node instanceof HTMLElement) {
        if (typeof value === "undefined" || value === null) {
            node.innerHTML = "";
        } else if (typeof value === "object" && value instanceof HTMLElement) {
            node.innerHTML = "";
            node.appendChild(cloneDeep(value as HTMLElement));
        } else if (typeof value === "object" && (value as ChildCollection)?.__childCollection) {
            const children = (value as ChildCollection).elements;
            node.innerHTML = "";
            children.forEach(node.appendChild.bind(node));
        } else if (typeof value === "object" && (value as UnsafeHtml).unsafeHtml) {
            node.innerHTML = "" + (value as UnsafeHtml).unsafeHtml;
        } else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            node.innerHTML = "";
            node.textContent = "" + value;
        } else {
            throw new Error(`Cannot set child content on ${node} of ${self} to ${value}: cannot map type`);
        }
        if (value instanceof ModrnHTMLElement) {
            requestRender(value);
        }
    } else if (node.nodeType === TEXT_NODE) {
        if ((value as ChildCollection)?.__childCollection) {
            const parent = node.parentElement;
            if (!parent) {
                throw new Error(`Parent element missing on ${node} of ${self}`);
            }
            const newNode = document.createElement("div") as HTMLElement;
            newNode.style.display = "contents";
            const children = (value as ChildCollection).elements;
            children.forEach(newNode.appendChild.bind(newNode));
            parent.insertBefore(newNode, node);
            parent.removeChild(node);
        } else if (typeof value === "undefined" || value === null) {
            node.textContent = "";
        } else if (typeof value === "object" && value instanceof HTMLElement) {
            const parent = node.parentElement;
            if (!parent) {
                throw new Error(`Parent element missing on ${node} of ${self}`);
            }
            parent.insertBefore(cloneDeep(value as HTMLElement), node);
            parent.removeChild(node);
        } else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            node.textContent = "" + value;
        } else {
            throw new Error(`Cannot set child content on ${node} of ${self} to ${value}: cannot map type`);
        }
        if (value instanceof ModrnHTMLElement) {
            requestRender(value);
        }
    }
}

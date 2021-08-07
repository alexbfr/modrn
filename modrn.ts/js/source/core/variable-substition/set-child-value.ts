/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {ELEMENT_NODE, TEXT_NODE} from "../variable-analysis/variable-types";
import {UnsafeHtml} from "./unsafe-html";
import {ChildCollection} from "../types/prop-types";
import {ValueTransformerFn, VariableMapping} from "../types/variables";
import {ModrnHTMLElement} from "../types/modrn-html-element";
import {analyzeToFragment} from "../variable-analysis/analyze-to-fragment";

/**
 * Gets the child value of the node
 * @param self
 * @param node
 */
export function getChildValue(self: ModrnHTMLElement, node: Node): unknown {
    if (node instanceof HTMLElement || node instanceof SVGElement) {
        return node;
    }
    if (node.nodeType === TEXT_NODE) {
        return node.textContent;
    }
    throw new Error(`Cannot get child content of ${nodeInfo(node)} of ${nodeInfo(self)}: cannot map type`);
}

/**
 * Sets the child value of the provided node. This is a bit lengthy (see the individual functions below),
 * since several cases have to be taken care of. There will be bugs here waiting to be fixed.
 *
 * @param self
 * @param node
 * @param match
 * @param valueProvided
 */
export function setChildValue(self: ModrnHTMLElement, node: Node, match: VariableMapping, valueProvided: unknown): unknown {

    let value: unknown;
    const valueTransformer = match.valueTransformer as ValueTransformerFn | undefined;
    if (node instanceof ModrnHTMLElement) {
        value = setModrnElementChildContent(self, node, valueProvided, valueTransformer);
    } else if (node instanceof HTMLElement || node instanceof SVGElement) {
        value = setChildContentToElementChild(self, node, valueProvided, valueTransformer);
    } else if (node.nodeType === TEXT_NODE) {
        value = setChildContentToTextNode(self, node, valueProvided, valueTransformer);
    }
    return value;
}

function setModrnElementChildContent(self: ModrnHTMLElement, node: ModrnHTMLElement, valueProvided: unknown, valueTransformer: (<T>(node: Node, value: T) => T) | undefined) {
    let value: unknown;
    const state = node?.state;

    if (!state) {
        throw new Error(`Node is missing state: ${nodeInfo(node)} of ${nodeInfo(self)}`);
    }
    if (typeof valueProvided === "undefined" || valueProvided === null || valueProvided === false) {
        // Clear if falsy and not a number or string
        state.previousChild = null;
    } else if (typeof valueProvided === "object" && valueProvided instanceof HTMLElement) {
        value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
        if (state.previousChild?.childElement !== value) {
            // Setting a HTMLELement child requires to first analyze the provided fragment
            state.previousChild = analyzeToFragment(value as HTMLElement);
        }
    } else if (typeof valueProvided === "string" || typeof valueProvided === "number" || typeof valueProvided === "boolean") {
        // TODO: could be optimized to check if there's already just one span, then it'd be enough to just replace the text content
        const valueNode = document.createElement("span");
        value = valueTransformer ? valueTransformer(valueNode, valueProvided) : valueProvided;
        valueNode.textContent = "" + value;
        state.previousChild = {childElement: valueNode, variableDefinitions: null};
    } else if (typeof valueProvided === "object" && (valueProvided as UnsafeHtml).unsafeHtml) {
        // same as above
        const valueNode = document.createElement("span");
        value = valueTransformer ? valueTransformer(valueNode, valueProvided) : valueProvided;
        valueNode.innerHTML = "" + (value as UnsafeHtml).unsafeHtml;
        state.previousChild = {childElement: valueNode, variableDefinitions: null};
    } else {
        throw new Error(`Cannot set child content on ${nodeInfo(node)} of ${nodeInfo(self)} to ${valueProvided}: cannot map type`);
    }
    return value;
}

function clearChildren(node: HTMLElement | SVGElement) {
    let child: Node | null;
    while ((child = node.lastChild)) node.removeChild(child);
}

function setChildContentToElementChild(self: ModrnHTMLElement, node: HTMLElement | SVGElement, valueProvided: unknown, valueTransformer: (<T>(node: Node, value: T) => T) | undefined) {
    let value: unknown;
    if (typeof valueProvided === "undefined" || valueProvided === null) {
        value = valueTransformer ? valueTransformer(node, valueProvided) : "";
        node.innerHTML = value as string;
    } else if (typeof valueProvided === "object" && valueProvided instanceof HTMLElement) {
        // Set a html element child directly. We're not cloning here, since clones can easily provided in an efficient
        // manner using useTemplateChildren()
        value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
        if (node.childNodes.length !== 1 || node.firstElementChild !== value) {
            clearChildren(node);
            node.appendChild(value as HTMLElement);
        }
    } else if (typeof valueProvided === "object" && (valueProvided as ChildCollection)?.__childCollection) {
        // Here we're setting a useTemplateChildren() result as the body of another html element
        value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
        const children = (value as ChildCollection).elements;
        let currentElement: Element | null = node.firstElementChild;
        for (const child of children) { // iterate all desired children
            const replace = child !== currentElement; // compare current desired child with actual child
            const before = currentElement;
            currentElement = currentElement?.nextElementSibling || null;
            if (replace) { // if replacing is required, do that
                node.insertBefore(child, currentElement);
                if (before) {
                    node.removeChild(before);
                }
            } // otherwise we can skip this element
        }
        // all remaining actual children are superfluous and must be removed
        while (currentElement != null) {
            const before = currentElement;
            currentElement = currentElement.nextElementSibling;
            node.removeChild(before);
        }
    } else if (typeof valueProvided === "object" && (valueProvided as UnsafeHtml).unsafeHtml) {
        value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
        node.innerHTML = "" + (value as UnsafeHtml).unsafeHtml;
    } else if (typeof valueProvided === "string" || typeof valueProvided === "number" || typeof valueProvided === "boolean") {
        value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
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
    return value;
}

/**
 * Text nodes need a little special treatment, since depending on the value they need to be upgraded to elements
 * @param self
 * @param node
 * @param valueProvided
 * @param valueTransformer
 */
function setChildContentToTextNode(self: ModrnHTMLElement, node: Node, valueProvided: unknown, valueTransformer: (<T>(node: Node, value: T) => T) | undefined) {
    let value: unknown;

    if ((valueProvided as ChildCollection)?.__childCollection) {
        // We're providing a child collection, upgrade the text node to an element
        const parent = node.parentElement;
        if (!parent) {
            throw new Error(`Parent element missing on ${nodeInfo(node)} of ${nodeInfo(self)}`);
        }
        // Create a div style=contents container
        const newNode = document.createElement("div") as HTMLElement;
        newNode.style.display = "contents";
        value = valueTransformer ? valueTransformer(newNode, valueProvided) : valueProvided;

        // Append the children
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
        value = valueTransformer ? valueTransformer(parent, valueProvided as HTMLElement) : valueProvided as HTMLElement;
        parent.insertBefore(value as HTMLElement, node);
        parent.removeChild(node);
    } else if (typeof valueProvided === "string" || typeof valueProvided === "number" || typeof valueProvided === "boolean") {
        value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
        node.textContent = "" + value;
    } else {
        value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
        node.textContent = JSON.stringify(valueProvided, null, 2);
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

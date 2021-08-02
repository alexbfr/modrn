/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {unTagify} from "../../util/tagify";
import {nodeInfo} from "./set-child-value";
import {ModrnHTMLElement} from "../types/component-registry";

const hasWarned: Record<string, true> = {};

/**
 * Gets the value of an attribute for a specific node (with the rendering context of "self" i.e. the containing ModrnHTMLElement)
 *
 * @param self
 * @param node
 * @param attributeNameOriginal
 */
export function getAttributeValue(self: ModrnHTMLElement, node: Element, attributeNameOriginal: string): unknown {
    // If the node is a ModrnHTMLElement, first look into custom props
    if (node instanceof ModrnHTMLElement) {
        // Convert the attribute name from attribute-case to propCase
        const attributeName = unTagify(attributeNameOriginal, true);
        const state = node?.state;

        // Maybe the element is not yet upgraded, we may have to look into the initial props
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

    // Check if the attribute is a property of the node
    const attributeName = attributeNameOriginal;
    if (attributeName in node) {
        return (node as unknown as Record<string, unknown>)[attributeName];
    }
    // No, then try getAttribute last
    return node.getAttribute(attributeName);
}

/**
 * Sets the value of an attribute/prop
 * @param self - the ModrnHTMLElement providing the context
 * @param node - the node to set the attribute/prop on
 * @param attributeName - the name of the attribute/prop
 * @param value - the value
 * @param hidden - if true, hides a html-visible counterpart for a ModrnHTMLElement node
 */
export function setAttributeValue(self: ModrnHTMLElement, node: Element, attributeName: string, value: unknown, hidden: boolean): void {
    // For a ModrnHTMLElement, simply set the (initial, if not yet upgraded) props
    if (node instanceof ModrnHTMLElement) {
        const untagifiedName = unTagify(attributeName, true);
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
        // For other elements, it gets more complicated

        // First check if the attribute is a member of "node" - SVGElements behave not so well here // TODO: maybe problematic for certain other attributes as well
        if (!(node instanceof SVGElement) && attributeName in node) {
            (node as unknown as Record<string, unknown>)[attributeName] = value;
        } else if (typeof value === "string" || typeof value === "number") { // string or number => just set attribute
            node.setAttribute(attributeName, "" + value);
        } else if (typeof value === "boolean") { // booleans need probably special treatment, for now it works - TODO: revisit
            if (value) {
                node.setAttribute(attributeName, "1");
            } else {
                node.removeAttribute(attributeName);
            }
        } else if (typeof value === "undefined" || value === null) { // for other falsy values, remove the attribute
            node.removeAttribute(attributeName);
        } else if (typeof value === "function") {
            // We're here if the value is a function but there is no property of node of the required name
            // That means we have to warn (once) that the attribute cannot be applied
            if (!hasWarned[node.nodeName + "_" + attributeName]) {
                console.warn(`Cannot set attribute ${attributeName} on ${nodeInfo(node)} of ${nodeInfo(self)}: event handler does not exist`);
                hasWarned[node.nodeName + "_" + attributeName] = true;
            }
        } else {
            throw new Error(`Cannot set attribute ${attributeName} on ${nodeInfo(node)} of ${nodeInfo(self)} to ${value}: cannot map type`);
        }
    }
}

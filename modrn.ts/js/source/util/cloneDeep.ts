/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */


import {ModrnHTMLElement} from "../core/types/modrn-html-element";

function copyDeep(current: Element, currentRoot: Element) {
    let pivotRoot = currentRoot;
    let pivot = current;
    while (pivot && pivotRoot) {
        const current = pivot;
        const currentRoot = pivotRoot;
        pivot = pivot.nextElementSibling as Element;
        pivotRoot = pivotRoot.nextElementSibling as Element;
        if (current instanceof ModrnHTMLElement) {
            (currentRoot as ModrnHTMLElement).copyTo(current);
        } else if (current.firstElementChild && currentRoot.firstElementChild) {
            copyDeep(current.firstElementChild as Element, currentRoot.firstElementChild as Element);
        }
    }
}

export function cloneDeep(root: Element): Element {

    const result = root.cloneNode(true) as Element;
    copyDeep(result, root);
    return result;
}
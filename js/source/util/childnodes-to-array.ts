/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

export function childNodesToArray(element: Element): ChildNode[] {
    const result: ChildNode[] = [];
    const length = element.childNodes.length;
    for (let idx = 0; idx < length; ++idx) {
        result.push(element.childNodes.item(idx));
    }
    return result;
}
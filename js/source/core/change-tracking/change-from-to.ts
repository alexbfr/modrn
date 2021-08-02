/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {ApplyResult, changes, clean} from "./change-types";
import {requestRender} from "../render-queue";
import {isTainted} from "./mark-changed";
import {RefInternal} from "../hooks/ref-hooks";
import {ChildCollection} from "../types/prop-types";
import {ModrnHTMLElement} from "../types/component-registry";
import {hasFunctionChanged} from "../change-detection/has-function-changes";
import {hasArrayChanged} from "../change-detection/has-array-changed";

/**
 * Called after a variable has been applied with the previous and current value.
 * This is not a simple copy of {@see hasChanged} but a specific implementation to deal with the specifics of the
 * underlying DOM data model.
 *
 * @param previous
 * @param now
 * @param forConsumer
 * @param node
 */
export function changeFromTo(previous: unknown, now: unknown, forConsumer: ModrnHTMLElement, node: ChildNode | false): ApplyResult {
    const result = changeFromToRaw(previous, now, forConsumer);
    if (result.madeChanges && node instanceof ModrnHTMLElement) {
        requestRender(node as ModrnHTMLElement);
    }
    return result;
}

export function changeFromToRaw(previous: unknown, now: unknown, forConsumer: ModrnHTMLElement): ApplyResult {
    if (!previous && !now) {
        return {madeChanges: false};
    }
    /** Check if the "now" object has been marked as tainted, if so, we have to re-render {@see markChanged} */
    if (isTainted(now)) {
        return {madeChanges: true};
    }
    updateChangeTracking(previous, now, forConsumer);
    /** Check if the reference is equal, then we cannot have changed (except if tainted, see above) */
    if (previous === now) {
        return {madeChanges: false};
    }
    /** Check if the value is a ref; if so, compare the refs' contents */
    if ((previous as RefInternal)?.__addRef && (now as RefInternal)?.__addRef) {
        return compareRefs(previous, now);
    }
    /** Check if we're rendering dynamic children, if so, compare the child collection */
    if (previous instanceof HTMLElement && (now as ChildCollection).__childCollection) {
        return compareChildCollection(previous, now);
    }
    if (typeof now === "function") {
        return {madeChanges: hasFunctionChanged(previous, now)};
    }
    if (Array.isArray(now) && Array.isArray(previous)) {
        const nowArr = now as unknown[];
        const previousArr = previous as unknown[];
        if (nowArr.length === 0 && previousArr.length === 0) {
            return {madeChanges: false};
        } else if (DEFAULT_RECURSION_DEPTH > 0) {
            return {madeChanges: hasArrayChanged(previousArr, nowArr, DEFAULT_RECURSION_DEPTH - 1)};
        }
    }
    return {madeChanges: true};
}

function compareRefs(previous: unknown, now: unknown) {
    const prevRefs = previous as RefInternal;
    const nowRefs = now as RefInternal;
    if (prevRefs.length !== nowRefs.length) {
        return {madeChanges: true};
    }
    const len = prevRefs.length;
    for (let idx = 0; idx < len; idx++) {
        const p = prevRefs[idx];
        const n = nowRefs[idx];
        if (p !== n) {
            return {madeChanges: true};
        }
    }
    return {madeChanges: false};
}

function compareChildCollection(previous: HTMLElement, now: unknown) {
    const children = (now as ChildCollection).elements;
    if (previous.childNodes.length !== children.length) {
        return {madeChanges: true};
    }
    for (let idx = 0; idx < children.length; ++idx) {
        if (previous.childNodes.item(idx) !== children[idx]) {
            return {madeChanges: true};
        }
    }
    return {madeChanges: false};
}

function updateChangeTracking(previous: unknown, now: unknown, forConsumer: ModrnHTMLElement) {
    if (typeof previous === "object") {
        const found = changes.list.get(previous as object); // eslint-disable-line
        if (found) {
            clean(found, forConsumer);
        }
    }
    if (typeof now === "object") {
        let found = changes.list.get(now as object)?.consumers; // eslint-disable-line
        if (!found) {
            found = [];
            changes.list.set(now as object, {consumers: found}); // eslint-disable-line
        }
        found.push(new WeakRef<ModrnHTMLElement>(forConsumer));
    }
}

const DEFAULT_RECURSION_DEPTH = 1;
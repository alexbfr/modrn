import {ModrnHTMLElement} from "../component-registry";
import {PureStateFunction} from "../../util/state";
import {ApplyResult, changes, clean} from "./change-types";
import {requestRender} from "../render-queue";
import {ChildCollection} from "../templated-children-hooks";
import {isTainted} from "./mark-changed";
import {RefInternal} from "../ref-hooks";

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
    if (isTainted(now)) {
        return {madeChanges: true};
    }
    if (previous === now) {
        return {madeChanges: false};
    }
    if ((previous as RefInternal)?.__addRef && (now as RefInternal)?.__addRef) {
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
    if (previous instanceof HTMLElement && (now as ChildCollection).__childCollection) {
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
    if (typeof now === "function") {
        if ( hasFunctionChanged(previous, now)) {
            return {madeChanges: true};
        }
        return {madeChanges: false};
    }
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
    if (Array.isArray(now) && Array.isArray(previous)) {
        const nowArr = now as unknown[];
        const previousArr = previous as unknown[];
        if (nowArr.length === 0 && previousArr.length === 0) {
            return {madeChanges: false};
        }
    }
    return {madeChanges: true};
}

function getStateId(what: unknown) {
    if (typeof what === "function") {
        return (what as PureStateFunction)?.stateId;
    }
    return undefined;
}

function hasFunctionChanged(previous: unknown, valueToSet: unknown) {
    const previousId = getStateId(previous);
    const currentId = getStateId(valueToSet);
    if (typeof previous === "function" && typeof valueToSet === "function" && previousId && currentId) {
        if (previousId !== currentId) {
            return true;
        }
        const previousContext = (previous as PureStateFunction<unknown>)?.stateContext?.deref();
        const currentContext = (valueToSet as PureStateFunction<unknown>)?.stateContext?.deref();
        return previousContext !== currentContext;
    }
    return false;
}

import {ModrnHTMLElement} from "../component-registry";
import {PureStateFunction} from "../../util/state";
import {ApplyResult, changes, clean} from "./change-types";
import {requestRender} from "../render-queue";

export function changeFromTo(previous: unknown, now: unknown, forConsumer: ModrnHTMLElement, node: ChildNode | false): ApplyResult {
    const result = changeFromToRaw(previous, now, forConsumer);
    if (result.madeChanges && node instanceof ModrnHTMLElement) {
        requestRender(node as ModrnHTMLElement);
    }
    return result;
}

export function changeFromToRaw(previous: unknown, now: unknown, forConsumer: ModrnHTMLElement): ApplyResult {
    if (previous === now) {
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
    return {madeChanges: true};
}

function hasFunctionChanged(previous: unknown, valueToSet: unknown) {
    const previousId = (previous as PureStateFunction<unknown>)?.stateId;
    const currentId = (valueToSet as PureStateFunction<unknown>)?.stateId;
    if (typeof previous === "function" && typeof valueToSet === "function" && previousId && currentId) {
        if (previousId !== currentId) {
            return true;
        }
        const previousContext = (previous as PureStateFunction<unknown>)?.stateContext?.deref();
        const currentContext = (valueToSet as PureStateFunction<unknown>)?.stateContext?.deref();
        return previousContext !== currentContext;
    }
    return previous !== valueToSet;
}

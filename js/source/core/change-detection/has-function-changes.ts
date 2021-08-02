/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {BoundFn} from "../component-state";
import {PureStateFunction} from "../../util/state";

function getStateId(what: unknown) {
    if (typeof what === "function") {
        return (what as PureStateFunction)?.stateId;
    }
    return undefined;
}

/**
 * Checks if a function has changed. If the function is dynamic {@see dynamic}, it is strictly compared for equality,
 * which means it changes during each re-render. If the function is state-bound {@see purify}, it is considered
 * inequal only if the state has changed in between. @TODO this is probably not even necessary, write test
 *
 * @param previous
 * @param valueToSet
 */
export function hasFunctionChanged(previous: unknown, valueToSet: unknown): boolean {
    if ((valueToSet as BoundFn<never, never>).dynamic && previous !== valueToSet) {
        return true;
    }
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

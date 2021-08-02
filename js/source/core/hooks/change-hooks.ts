/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {createState, getOrCreateAttachedState, StateToken} from "../../util/state";
import {useState} from "./state-hooks";
import {hasObjectChanged} from "../change-detection/has-object-changed";
import {hasArrayChanged} from "../change-detection/has-array-changed";

export type ChangeHookState = {
    previous: unknown;
    initial: boolean;
};

export type ChangeHookStateToken = StateToken<ChangeHookState> & {deepness: number};

export type ChangeHandlerFn<T> = (previous: T, now: T) => void;

/**
 * Creates a change hook. deepness specifies the maximum recursion depth to compare the two objects
 * @param deepness - maximum recursion depth
 */
export function createChangeHook(deepness = 0): ChangeHookStateToken {
    return {...createState<ChangeHookState>(), deepness};
}

/**
 * Gets or creates an element-attached change hook-
 * @param prefix - the prefix to disambiguate multiple attached states on the same element
 * @param element - the element to attach the state to
 * @param deepness - maximum recusrion depth
 */
export function getOrCreateAttachedChangeHook(prefix: string, element: Element, deepness = 0): ChangeHookStateToken {
    return {...getOrCreateAttachedState<ChangeHookState>(prefix, element), deepness};
}

/**
 * Tracks changes to the provided value, which must be not null. Change is detected recursively up to the depth when
 * creating the state token.
 * @see createChangeHook
 * @see getOrCreateAttachedChangeHook
 *
 * @param stateToken
 * @param value
 * @param changeHandlerFn
 */
export function useChange<T>(stateToken: ChangeHookStateToken, value: NonNullable<T>, changeHandlerFn?: ChangeHandlerFn<T>): boolean {
    const [state, setState] = useState(stateToken, {previous: value, initial: true});
    const previous = state.previous;
    let changed = false;

    // Do not trigger change on initialization
    if (state.initial) {
        setState({...state, initial: false});
    } else {
        if (Array.isArray(value)) {
            if (!Array.isArray(previous)) {
                throw new Error("Array must not change type");
            }
            const previousArr = previous as unknown[];
            const nowArr = value as unknown[];
            changed = hasArrayChanged(previousArr, nowArr, stateToken.deepness);
            if (changed) {
                setState({previous: [...nowArr], initial: false}, true);
            }
        } else if (typeof value !== "object") {
            if (previous === "object") {
                throw new Error("Value must not change from object to primitive");
            }
            changed = value !== previous;
            if (changed) {
                setState({previous: value, initial: false}, true);
            }
        } else if (typeof value === "object") {
            if (typeof previous !== "object") {
                throw new Error("Value must not change from primitive to object");
            }
            changed = hasObjectChanged(previous as Record<string, unknown>, value as unknown as Record<string, unknown>, stateToken.deepness);
            if (changed) {
                setState({previous: {...value}, initial: false}, true);
            }
        } else if (typeof value !== typeof previous) {
            if (changed) {
                setState({previous: value, initial: false}, true);
            }
        }
    }

    if (changed && changeHandlerFn) {
        changeHandlerFn(previous as T, value);
    }

    return changed;
}



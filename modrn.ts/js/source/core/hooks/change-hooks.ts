/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {
    createState,
    getOrCreateElementAttachedState,
    getOrCreateTokenAttachedState,
    StateToken
} from "../../util/state";
import {useState} from "./state-hooks";
import {hasArrayChanged, hasObjectChanged} from "../change-detection/has-changed";

export type ChangeHookState = {
    previous: unknown;
    initial: boolean;
};

export type ChangeHookStateToken = StateToken<ChangeHookState> & {depth: number};

export type ChangeHandlerFn<T> = (now: T, previous: T) => void;

/**
 * Creates a change hook. depth specifies the maximum recursion depth to compare the two objects
 * @param depth - maximum recursion depth
 */
export function createChangeHook(depth = 0): ChangeHookStateToken {
    return {...createState<ChangeHookState>(), depth};
}

/**
 * Gets or creates an element-attached change hook-
 * @param prefix - the prefix to disambiguate multiple attached states on the same element
 * @param element - the element to attach the state to
 * @param depth - maximum recusrion depth
 */
export function getOrCreateElementAttachedChangeHook(prefix: string, element: Element, depth = 0): ChangeHookStateToken {
    return {...getOrCreateElementAttachedState<ChangeHookState>(prefix, element), depth};
}

/**
 * Gets or creates a change hook attached on another state
 * @param prefix - the prefix to disambiguate multiple attached states on the same element
 * @param otherToken - the other state to attach this change hook to
 * @param depth - maximum recusrion depth
 */
export function getOrCreateTokenAttachedChangeHook<T>(prefix: string, otherToken: StateToken<T>, depth = 0): ChangeHookStateToken {
    return {...getOrCreateTokenAttachedState<ChangeHookState, T>(prefix, otherToken), depth};
}

/**
 * Tracks changes to the provided value, which must be not null. Change is detected recursively up to the depth when
 * creating the state token.
 * @see createChangeHook
 * @see getOrCreateElementAttachedChangeHook
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
        setState({...state, initial: false}, true);
    } else {
        if (Array.isArray(value)) {
            if (!Array.isArray(previous)) {
                throw new Error("Array must not change type");
            }
            const previousArr = previous as unknown[];
            const nowArr = value as unknown[];
            changed = hasArrayChanged(previousArr, nowArr, stateToken.depth);
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
            changed = hasObjectChanged(previous as Record<string, unknown>, value as unknown as Record<string, unknown>, stateToken.depth);
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
        changeHandlerFn(value, previous as T);
    }

    return changed;
}



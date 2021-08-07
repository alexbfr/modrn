/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {ComponentState, ModrnHTMLElement, Stateful} from "./types/modrn-html-element";

let currentStateContext: Stateful | undefined = undefined;

export type BoundFn<T, R> = ((...params: T[]) => R) & {
    bound: true;
    dynamic: boolean;
}

/**
 * Creates the initial state for the provided modrn html element. If the component was instantiated and is now being
 * upgraded, the initial props prior to upgrade (self.initialCustomProps) are copied over to the actual custom props
 * (self.customProps)
 *
 * @param self
 */
function createEmptyState(self: ModrnHTMLElement): ComponentState {

    try {
        return {
            addedChildElements: new WeakSet<ChildNode>(),
            previousChild: null,
            customProps: self.initialCustomProps || {},
            state: {},
            disconnected: [],
            update: self.update.bind(self),
            getOwner: () => self
        };
    } finally {
        delete self.initialCustomProps;
    }
}

/**
 * Returns or creates the empty state for the element
 * @param self
 */
export function getStateOf(self: ModrnHTMLElement): ComponentState {
    return self.state || (self.state = createEmptyState(self));
}

/**
 * Returns the current state context during rendering
 */
export function getCurrentStateContext(): Stateful {
    const state = currentStateContext;
    if (!state) {
        throw new Error("Not initialized - forgotten to use bindToStateContext?");
    }
    return state;
}

/**
 * Wraps the provided function with the state, preserving the state context stack
 * @param state
 * @param fn
 * @param params
 */
export function withState<T, R>(state: Stateful, fn: (...params: T[]) => R, ...params: T[]): R { // eslint-disable-line
    const oldStateContext = currentStateContext;
    try {
        currentStateContext = state;
        return fn(...params);
    } finally {
        currentStateContext = oldStateContext;
    }
}

/**
 * Explicitly declares the provided function as dynamic. This has the effect that the function is newly instantiated
 * during each render and thus sees all props always. This has some performance implications, and it is preferable to
 * use state-bound functions instead (state is always up-to-date) and should be avoided where not necessary.
 *
 * @param fn
 * @param params
 */
export function dynamic<T, R>(fn: (...params: T[]) => R, ...params: T[]): (...params: T[]) => R { // eslint-disable-line
    const result = bindToStateContext(fn) as BoundFn<T, R>;
    result.dynamic = true;
    return result;
}

/**
 * Binds the provided function to the current state context, if not already bound.
 * @see withState
 *
 * @param fn
 * @param params
 */
export function bindToStateContext<T, R>(fn: (...params: T[]) => R, ...params: T[]): (...params: T[]) => R { // eslint-disable-line
    if ("bound" in fn) {
        return fn;
    }
    if (!currentStateContext) {
        throw new Error("Cannot bind to current state context since none exists");
    }
    const boundCurrentStateContext = currentStateContext;
    const result = ((...params: any[]) => withState(boundCurrentStateContext, fn, ...params)) as BoundFn<T, R>; // eslint-disable-line
    result.bound = true;
    result.dynamic = false;
    return result;
}

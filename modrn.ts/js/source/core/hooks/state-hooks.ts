/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {
    getStateInternal,
    MutableState,
    mutableStateInternal,
    PureStateFunction,
    purifyInternal,
    State,
    StateToken,
    useStateInternal,
    WrappedFunction
} from "../../util/state";
import {getCurrentStateContext} from "../component-state";

/**
 * Returns the state associated with the provided stateToken {@see createState}. If the state wasn't initialized yet,
 * it will be initialized first. The initial value may be either an object or a function returning an object of type T.
 *
 * @param token - the state token {@see createState}
 * @param initial - the initial value
 */
export function useState<T, K extends StateToken<T>>(token: K, initial: K["dummy"] | (() => K["dummy"])): State<K["dummy"]> {
    const state = getCurrentStateContext();
    return useStateInternal(token, state, initial);
}

/**
 * Similar to useState, but requires the state to be already initialized
 * @param token - the state token {@see createState}
 */
export function getState<T, K extends StateToken<T>>(token: K): State<K["dummy"]> {
    const state = getCurrentStateContext();
    return getStateInternal(token, state);
}

/**
 * Returns a mutable view of the state of the provided token.
 * @param token - the state token {@see createState}
 */
export function mutableState<T, K extends StateToken<T>>(token: K): MutableState<K["dummy"]> {
    const state = getCurrentStateContext();
    return mutableStateInternal(token, state);
}

/**
 * Produces a state-bound function with up to 4 additional parameters aside from the 1st (which is always the current state).
 *
 * The method may return undefined if it doesn't alter the state, or it may return a Partial<T> of the state. Only keys being part of the
 * partial result will be updated, the rest will stay in place.
 *
 * The return value of purify is the state-bound function.
 *
 * @param token - the state token {@see createState}
 * @param fn - the function to bind the state to
 */
export function purify<T extends Record<string, unknown>, K extends StateToken<T>, K1=never, K2=never, K3=never, K4=never>(token: K, fn: WrappedFunction<K["dummy"], K1, K2, K3, K4>): PureStateFunction<K1, K2, K3, K4> {
    const state = getCurrentStateContext();
    return purifyInternal(state, token, fn);
}


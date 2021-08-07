/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {StateToken} from "../../util/state";
import {ChangeHandlerFn, getOrCreateTokenAttachedChangeHook, useChange} from "./change-hooks";
import {getState} from "./state-hooks";

export function useStateChange<T>(stateToken: StateToken<NonNullable<T>>, changeHandler: ChangeHandlerFn<T>, depth = 0): void {

    const stateChangeToken = getOrCreateTokenAttachedChangeHook("stateChange", stateToken, depth);
    const [currentState] = getState(stateToken);
    useChange(stateChangeToken, currentState, changeHandler);
}
/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {State, StateToken} from "../../util/state";
import {useState} from "./state-hooks";
import {logWarn} from "../../util/logging";
import {useStateChange} from "./state-change-hooks";

export function useLocalStorageState<T, K extends StateToken<NonNullable<T>>>(
    token: K, initial: NonNullable<K["dummy"]> | (() => K["dummy"]), localStorageKey: string, depth = -1): State<K["dummy"]> {

    function readFromLocalStorage() {
        try {
            const item = localStorage.getItem(localStorageKey);
            return item ? (JSON.parse(item) as T) : null;
        } catch(e) {
            logWarn(`Read from local storage for key ${localStorageKey} failed`, e);
            return null;
        }
    }

    function saveToLocalStorage(item: T) {
        try {
            localStorage.setItem(localStorageKey, JSON.stringify(item));
        } catch (e) {
            logWarn(`Write to local storage for key ${localStorageKey} failed`, e, item);
        }
    }

    const result = useState(token, () => {
        const result = readFromLocalStorage();
        if (result) {
            return result as NonNullable<T>;
        }
        if (typeof initial === "function") {
            return (initial as () => T)() as NonNullable<T>;
        } else {
            return initial as NonNullable<T>;
        }
    });

    useStateChange(token, saveToLocalStorage, depth);

    return result;
}


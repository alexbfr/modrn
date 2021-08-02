/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {hasChanged} from "./has-changed";

/**
 * Checks if an array has changed up to a maximum recursion depth
 * @param previousArr
 * @param nowArr
 * @param deepness
 */
export function hasArrayChanged(previousArr: unknown[], nowArr: unknown[], deepness: number): boolean {
    if (previousArr.length !== nowArr.length) {
        return true;
    } else {
        for (let idx = 0; idx < nowArr.length; idx++) {
            const now = nowArr[idx];
            const previous = previousArr[idx];
            if (now !== previous) {
                if (deepness > 0) {
                    if (hasChanged(previous, now, deepness - 1)) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
    }
    return false;
}


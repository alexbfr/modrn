/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {hasArrayChanged} from "./has-array-changed";
import {hasObjectChanged} from "./has-object-changed";
import {hasFunctionChanged} from "./has-function-changes";

/**
 * Checks if an object has changed up to a maximum recursion depth
 * @param previous
 * @param now
 * @param deepness
 */
export function hasChanged(previous: unknown, now: unknown, deepness: number): boolean {
    if (!now || !previous) {
        return true;
    }
    if (Array.isArray(now) && Array.isArray(previous)) {
        if (hasArrayChanged(previous as unknown[], now as unknown[], deepness - 1)) {
            return true;
        }
    } else if (typeof now === "object" && typeof previous === "object") {
        if (hasObjectChanged(previous as Record<string, unknown>, now as Record<string, unknown>, deepness - 1)) {
            return true;
        }
    } else if (typeof now === "function" && typeof previous === "function") {
        return hasFunctionChanged(previous, now);
    }
    return false;
}

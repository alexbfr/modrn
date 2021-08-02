/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {hasChanged} from "./has-changed";

/**
 * Checks if an object has changed up to a maximum recursion depth
 * @param previous
 * @param value
 * @param deepness
 */
export function hasObjectChanged(previous: Record<string, unknown>, value: Record<string, unknown>, deepness: number): boolean {
    const previousEntries = Object.entries(previous);
    const nowEntries = Object.keys(value);
    if (previousEntries.length !== nowEntries.length) {
        return true;
    } else {
        const now = value as unknown as Record<string, unknown>;
        for (const [name, val] of previousEntries) {
            if (!(name in now)) {
                return true;
            }
            if (now[name] !== val) {
                if (deepness > 0) {
                    if (hasChanged(val, now[name], deepness - 1)) {
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

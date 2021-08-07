/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {hasFunctionChanged} from "./has-function-changes";

/**
 * Checks if an object has changed up to a maximum recursion depth
 * @param previous
 * @param now
 * @param depth
 */
export function hasChanged(previous: unknown, now: unknown, depth: number): boolean {
    if (!now || !previous) {
        return true;
    }
    if (Array.isArray(now) && Array.isArray(previous)) {
        if (hasArrayChanged(previous as unknown[], now as unknown[], depth - 1)) {
            return true;
        }
    } else if (typeof now === "object" && typeof previous === "object") {
        if (hasObjectChanged(previous as Record<string, unknown>, now as Record<string, unknown>, depth - 1)) {
            return true;
        }
    } else if (typeof now === "function" && typeof previous === "function") {
        return hasFunctionChanged(previous, now);
    }
    return false;
}

/**
 * Checks if an array has changed up to a maximum recursion depth
 * @param previousArr
 * @param nowArr
 * @param depth
 */
export function hasArrayChanged(previousArr: unknown[], nowArr: unknown[], depth: number): boolean {
    if (previousArr.length !== nowArr.length) {
        return true;
    } else {
        for (let idx = 0; idx < nowArr.length; idx++) {
            const now = nowArr[idx];
            const previous = previousArr[idx];
            if (now !== previous) {
                if (depth !== 0) {
                    if (hasChanged(previous, now, depth - 1)) {
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

/**
 * Checks if an object has changed up to a maximum recursion depth
 * @param previous
 * @param value
 * @param depth
 */
export function hasObjectChanged(previous: Record<string, unknown>, value: Record<string, unknown>, depth: number): boolean {
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
                if (depth !== 0) {
                    if (hasChanged(val, now[name], depth - 1)) {
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


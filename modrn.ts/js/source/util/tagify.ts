/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

function isUpper(c: string) {
    return c >= "A" && c <= "Z";
}

export function tagify(name: string): string {
    let lower = false;
    let result = "";
    for (let idx = 0; idx < name.length; idx++) {
        const c = name.charAt(idx);
        const p = idx > 0 ? name.charAt(idx - 1) : "";
        if (isUpper(c) && (lower && !isUpper(p))) {
            result += "-";
            lower = false;
        } else {
            lower = true;
        }
        result += c.toLowerCase();
    }
    return result;
}

export function unTagify(name: string, startLower: boolean): string {
    let lower = startLower;
    let result = "";
    for (let idx = 0; idx < name.length; idx++) {
        const c = name.charAt(idx);
        if (c === "-") {
            lower = false;
            continue;
        }
        if (!lower) {
            result += c.toUpperCase();
            lower = true;
        } else {
            result += c.toLowerCase();
        }
    }
    return result;
}

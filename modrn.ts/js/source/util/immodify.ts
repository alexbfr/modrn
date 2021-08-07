/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

type Full<T> = { full: true } & { val: T};

export type DeepPartialOrFull<T> = {
    [P in keyof T]?: DeepPartialOrFull<T[P]> | Full<T[P]>;
};

function extract<T, N extends keyof T = keyof T>(from: T, name: N, full: Full<unknown>): T[N] { // workaround for typesafe access
    return full.val as T[N];
}

export function replaceWith<T>(val: T): Full<T> {
    return {full: true, val};
}

export function immodify<T>(on: T, modifier: DeepPartialOrFull<T>): T {
    const result = {...on, ...modifier};
    Object.entries(modifier).forEach(([name, val]) => {
        const tname = name as keyof T;
        if (val !== null && typeof val === "object" && !Array.isArray(val)) {
            if ((val as Full<unknown>)?.full) {
                result[tname] = extract(on, tname, val as Full<unknown>);
            } else if (val) {
                result[tname] = immodify(on[tname], val);
            }
        }
    });
    return result;
}

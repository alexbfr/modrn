/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {changes, clean} from "./change-types";
import {requestRender} from "../types/render-queue";

let tainted = new WeakSet<object>(); // eslint-disable-line

/**
 * Checks if an object is tainted (i.e. marked dirty, despite potentially having the same reference than in the
 * past rendering cycle)
 *
 * @param what
 */
export function isTainted<T>(what: T): boolean {
    if (typeof what === "object") {
        return tainted.has(what as unknown as object); // eslint-disable-line
    }
    return false;
}

/**
 * Reset tainted flags
 */
export function clearTainted(): void {
    tainted = new WeakSet<object>(); // eslint-disable-line
}

/**
 * Mark an object as tainted. This both marks the object as tainted and checks which other
 * components reference this specific object currently, and marks those as requiring a re-render.
 *
 * @param what
 * @param recursive
 */
export function markChanged<T extends object | unknown[]>(what: T, recursive?: boolean) { // eslint-disable-line
    if (typeof what === "object") {
        tainted.add(what);
    }
    const found = changes.list.get(what);
    if (found) {
        clean(found).forEach(consumer => {
            const ref = consumer.deref();
            if (ref) {
                requestRender(ref);
            }
        });
    }
    if (recursive) {
        Object.values(what).filter(what => typeof what === "object" && what !== null).forEach(what => markChanged(what, true));
    }
}


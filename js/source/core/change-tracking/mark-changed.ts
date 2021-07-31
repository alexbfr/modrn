import {requestRender} from "../render-queue";
import {changes, clean} from "./change-types";

let tainted = new WeakSet<object>(); // eslint-disable-line

export function isTainted<T>(what: T): boolean {
    if (typeof what === "object") {
        return tainted.has(what as unknown as object); // eslint-disable-line
    }
    return false;
}

export function clearTainted(): void {
    tainted = new WeakSet<object>(); // eslint-disable-line
}

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


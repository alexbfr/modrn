import {requestRender} from "../render-queue";
import {changes, clean} from "./change-types";

export function markChanged<T extends object | unknown[]>(what: T, recursive?: boolean) { // eslint-disable-line
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


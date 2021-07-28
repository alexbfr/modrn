import {ModrnHTMLElement} from "../component-registry";

export type Consumers = {
    consumers: WeakRef<ModrnHTMLElement>[];
}

export type Changes = {
    list: WeakMap<object, Consumers> // eslint-disable-line
}

export let changes: Changes = {
    list: new WeakMap<object, Consumers>() // eslint-disable-line
};

export type ReRender = {
    [uniqueId: string]: () => void;
}

export interface ApplyResult {
    madeChanges: boolean;
}

export function union(applyResult: ApplyResult, applyResult2: ApplyResult): ApplyResult {
    applyResult.madeChanges ||= applyResult2.madeChanges;
    return applyResult;
}

export function resetChangeTracking(): void {
    changes = {
        list: new WeakMap<object, Consumers>() // eslint-disable-line
    };
}

export function clean(what: Consumers, except?: ModrnHTMLElement): WeakRef<ModrnHTMLElement>[] {
    const filtered = what.consumers.filter(consumer => {
        const ref = consumer.deref();
        return ref !== undefined && ref !== except;
    });
    if (filtered.length !== what.consumers.length) {
        what.consumers = filtered;
    }
    return what.consumers;
}


import { ModrnHTMLElement } from "../types/modrn-html-element";
export declare type Consumers = {
    consumers: WeakRef<ModrnHTMLElement>[];
};
export declare type Changes = {
    list: WeakMap<object, Consumers>;
};
export declare let changes: Changes;
export interface ApplyResult {
    madeChanges: boolean;
}
export declare function union(applyResult: ApplyResult, applyResult2: ApplyResult): ApplyResult;
export declare function resetChangeTracking(): void;
export declare function clean(what: Consumers, except?: ModrnHTMLElement): WeakRef<ModrnHTMLElement>[];

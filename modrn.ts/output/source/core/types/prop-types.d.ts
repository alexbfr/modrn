export declare const sigDate: Date;
export declare const sigElementRefs: ElementRefs;
export declare const sigEventHandler: () => void;
export declare const sigFunction: () => void;
export declare type ElementRefs = {
    refs: HTMLElement[];
};
export declare type ChildCollection = {
    elements: Element[];
    "__childCollection": true;
};
export declare type Container = {
    "__typed"?: true;
};
export declare function mBool(): boolean;
export declare function mString<T extends string>(): T;
export declare function mNumber(): number;
export declare function mChild(): ChildCollection;
export declare function mDate(): Date;
export declare function mRef(): ElementRefs;
export declare function mEventHandler(): (e: Event) => void;
export declare function mFunction<T extends Function>(): T;
export declare function mArray<T>(): T[];
export declare function mObj<T>(): T;
export declare function m<T>(v: T): T & Container;

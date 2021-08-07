export const sigDate = new Date(0) as Date;
export const sigElementRefs = {refs: []} as ElementRefs;
export const sigEventHandler = (): void => void 0;
export const sigFunction = (): void => void 0;

export type ElementRefs = {
    refs: HTMLElement[];
}

export type ChildCollection = {
    elements: Element[];
    "__childCollection": true;
};

export type Container = { "__typed"?: true };

export function mBool(): boolean {
    return false as boolean;
}

export function mString<T extends string>(): T {
    return "" as T;
}

export function mNumber(): number {
    return 0 as number;
}

export function mChild(): ChildCollection {
    return {__childCollection: true, elements: []};
}

export function mDate(): Date {
    return sigDate;
}

export function mRef(): ElementRefs {
    return sigElementRefs;
}

export function mEventHandler(): (e: Event) => void {
    return sigEventHandler;
}

export function mFunction<T extends Function>(): T { // eslint-disable-line
    return sigFunction as unknown as T;
}

export function mArray<T>(): T[] {
    return [];
}

export function mObj<T>(): T {
    return null as unknown as T;
}

export function m<T>(v: T): T & Container {
    return {...v, __typed: true};
}



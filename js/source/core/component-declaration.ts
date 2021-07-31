import "reflect-metadata";
import {registerModule} from "./component-registry";
import {ChildCollection} from "./templated-children-hooks";

export const sigDate = new Date(0) as Date;
export const sigElementRefs = {refs: []} as ElementRefs;
export const sigEventHandler = (): void => void 0;
export const sigFunction = (): void => void 0;

export type ElementRefs = {
    refs: HTMLElement[];
}

export type Container = { "__typed": true };

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

export type UnregisteredComponentBase = {register: () => void};

export type UnregisteredComponentHtml = {
    html: <T extends UnregisteredComponentHtml & UnregisteredComponentBase>(this: T, html: string) => Omit<T, "html">
}

export type UnregisteredComponentTransparent = {
    transparent: <T extends UnregisteredComponentTransparent & UnregisteredComponentBase>(this: T) => Omit<T, "transparent">
}

export type UnregisteredComponentDynamicChildren = {
    dynamicChildren: <T extends UnregisteredComponentDynamicChildren & UnregisteredComponentBase>(this: T) => Omit<T, "dynamicChildren">
}

export type UnregisteredComponent<T, R> = {
    register: () => RegisteredComponent<T, R>;
} & UnregisteredComponentHtml & UnregisteredComponentTransparent & UnregisteredComponentDynamicChildren;

export type AllProps = {allProps: () => Record<string, unknown>};

export type RegisteredComponent<T, R> = {
    transparent: boolean;
    dynamicChildren: boolean;
    customElementConstructor?: CustomElementConstructor;
    propTemplate: T;
    renderFunction: (props: T & AllProps) => R | null;
    htmlTemplate: string;
}

export type Module<M, K extends keyof M> = {
    [tagName in K]: (M[K] & RegisteredComponent<unknown, unknown>)
};

export type ModuleResult<M, K extends keyof M> = Module<M, K>  & {
    dependsOn: (...modules: Module<never, never>[]) => Module<M, K>;
};

export function declare<M, K extends keyof M>(module: Module<M, K>): ModuleResult<M, K> {

    const result = {
        ...module,
        dependsOn
    } as ModuleResult<M, K>;

    function dependsOn(...unused: Module<never, never>[]) { // eslint-disable-line
        return result;
    }

    registerModule(module);
    return result;
}

export const NoProps = m({});

export function makeComponent<T, R>(propsType?: Container & T, renderFn?: (props: T & AllProps) => R | null): UnregisteredComponent<T, R> {

    const result: UnregisteredComponent<T, R> = {html, register, transparent, dynamicChildren};
    let htmlTemplate: string;
    let isTransparent = false;
    let hasDynamicChildren = false;

    function html<T extends UnregisteredComponentHtml & UnregisteredComponentBase>(this: T, htmlText: string): Omit<T, "html"> {
        htmlTemplate = htmlText;
        return result as UnregisteredComponentBase as Omit<T, "html">;
    }

    function transparent<T extends UnregisteredComponentTransparent & UnregisteredComponentBase>(this: T): Omit<T, "transparent"> {
        isTransparent = true;
        return result as UnregisteredComponentBase as Omit<T, "transparent">;
    }

    function dynamicChildren<T extends UnregisteredComponentDynamicChildren & UnregisteredComponentBase>(this: T): Omit<T, "dynamicChildren"> {
        hasDynamicChildren = true;
        return result as UnregisteredComponentBase as Omit<T, "dynamicChildren">;
    }

    function register(): RegisteredComponent<T, R> {
        return {
            transparent: isTransparent,
            dynamicChildren: hasDynamicChildren,
            propTemplate: (propsType || m({})) as never,
            renderFunction: renderFn || (() => null),
            htmlTemplate
        } as RegisteredComponent<T, R>;
    }

    return result;
}

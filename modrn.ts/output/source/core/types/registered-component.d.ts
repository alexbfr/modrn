export declare const NoProps: import("./prop-types").Container;
export declare type AllProps = {
    allProps: () => Record<string, unknown>;
};
export declare type Filters = {
    [filterName: string]: (val: unknown) => unknown;
};
export declare type RegisteredComponent<T, R> = {
    transparent: boolean;
    dynamicChildren: boolean;
    customElementConstructor?: CustomElementConstructor;
    propTemplate: T;
    renderFunction: (props: T & AllProps) => R | null;
    filters: Filters;
    htmlTemplate: string;
};
export declare type Module<M, K extends keyof M> = {
    [tagName in K]: (M[K] & RegisteredComponent<unknown, unknown>);
};
export declare type ModuleResult<M, K extends keyof M> = Module<M, K> & {
    dependsOn: (...modules: Module<never, never>[]) => Module<M, K>;
};

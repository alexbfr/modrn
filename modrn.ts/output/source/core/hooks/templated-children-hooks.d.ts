import { StateToken } from "../../util/state";
import { ChildCollection } from "../types/prop-types";
import { RegisteredComponent } from "../types/registered-component";
import { Fragment } from "../types/modrn-html-element";
/**
 * This is the main function of the children handling. There are other variants following in this file, but this is the
 * central function.
 *
 * The basic process is to store the previously existing children in a state, and to compare each render cycle if props,
 * template or number of children change, and if so, to re-render those accordingly.
 *
 * @param stateToken
 * @param items
 * @param configFn
 * @param templateIfMissing
 */
export declare function useTemplatedChildren<T, P extends Record<string, unknown>>(stateToken: ChildrenStateToken, items: T[], configFn: ChildConfigurationFunction<T, P>, templateIfMissing?: Fragment): ChildCollection;
declare type ChildWithKey = {
    childKey: string;
    child: Element;
    props: unknown;
};
declare type ChildrenByKey = {
    [childKey: string]: ChildWithKey;
};
declare type TemplatedChildrenByKey = {
    source: RegisteredComponent<unknown, unknown> | Element | string;
    template: Fragment;
};
declare type ChildConfiguration<P extends Record<string, unknown>> = {
    props: P;
    key: string;
    template?: Fragment;
    forceUpdate?: boolean;
};
declare type ChildConfigurationFunction<T, P extends Record<string, unknown>> = (data: T, index: number) => ChildConfiguration<P>;
export declare type ChildrenStateToken = StateToken<ChildrenByKey>;
export declare function createChildrenState(): ChildrenStateToken;
export declare type TemplatedChildrenStateToken = StateToken<TemplatedChildrenByKey>;
export declare function createTemplatedChildrenState(): TemplatedChildrenStateToken;
export declare function useTemplate(sourceProvided: HTMLElement | string | RegisteredComponent<unknown, unknown>, childProps?: Record<string, unknown>, childStateToken?: ChildrenStateToken): ChildCollection;
export declare function useChild(childProps: Record<string, unknown> | null, childStateToken?: ChildrenStateToken): ChildCollection;
export declare function useModrnChild<T, R>(childStateToken: ChildrenStateToken, component: RegisteredComponent<T, R>, props: (T & Record<string, unknown>) | null): ChildCollection;
export declare function useModrnChildren<T, R>(childStateToken: ChildrenStateToken, component: RegisteredComponent<T, R>, props: (T & Record<string, unknown>)[]): ChildCollection;
export declare function useChildren<T>(iterateOver: T[], basicChildProps: Record<string, unknown>, itemAs?: string, indexAs?: string, childStateToken?: ChildrenStateToken): ChildCollection;
export {};

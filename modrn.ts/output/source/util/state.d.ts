import { DeepPartialOrFull } from "./immodify";
import { Stateful } from "../core/types/modrn-html-element";
export declare type ParamType<K1 = never, K2 = never, K3 = never, K4 = never> = [
    K1
] extends [never] ? [] : [
    K2
] extends [never] ? [K1] : [
    K3
] extends [never] ? [K1, K2] : [
    K4
] extends [never] ? [K1, K2, K3] : [
    K1,
    K2,
    K3,
    K4
];
export declare type State<T> = [
    T,
    (newState: T, silent?: boolean) => T
];
export declare type MutableState<T> = [
    T,
    () => void
];
export declare type StateToken<T> = {
    id: string;
    dummy: T;
};
export declare function createState<T>(prefix?: string): StateToken<T>;
export declare function getOrCreateElementAttachedState<T>(prefix: string, element: Element): StateToken<T>;
export declare function getOrCreateTokenAttachedState<T, K>(prefix: string, otherTokenProvided: StateToken<K>): StateToken<T>;
export declare function useStateInternal<T, K extends StateToken<T>>(token: K, context: Stateful, initial: T | (() => T)): State<T>;
export declare function getStateInternal<T, K extends StateToken<T>>(token: K, context: Stateful): State<T>;
export declare function mutableStateInternal<T, K extends StateToken<T>>(token: K, context: Stateful): MutableState<T>;
export declare type RawStateFunction = {
    stateContext: WeakRef<Stateful>;
    stateId: string;
};
export declare type PureStateFunction<K1 = never, K2 = never, K3 = never, K4 = never> = ((...rest: ParamType<K1, K2, K3, K4>) => void) & RawStateFunction;
export declare type WrappedFunction<T, K1 = never, K2 = never, K3 = never, K4 = never> = (state: T, ...args: ParamType<K1, K2, K3, K4>) => DeepPartialOrFull<T> | undefined | void;
export declare function purifyInternal<T extends Record<string, unknown>, K extends StateToken<T>, K1 = never, K2 = never, K3 = never, K4 = never>(context: Stateful, token: K, fn: WrappedFunction<K["dummy"], K1, K2, K3, K4>): PureStateFunction<K1, K2, K3, K4>;

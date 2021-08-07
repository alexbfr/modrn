import { MutableState, PureStateFunction, State, StateToken, WrappedFunction } from "../../util/state";
export declare function useState<T, K extends StateToken<T>>(token: K, initial: K["dummy"] | (() => K["dummy"])): State<K["dummy"]>;
export declare function getState<T, K extends StateToken<T>>(token: K): State<K["dummy"]>;
export declare function mutableState<T, K extends StateToken<T>>(token: K): MutableState<K["dummy"]>;
export declare function purify<T extends Record<string, unknown>, K extends StateToken<T>, K1 = never, K2 = never, K3 = never, K4 = never>(token: K, fn: WrappedFunction<K["dummy"], K1, K2, K3, K4>): PureStateFunction<K1, K2, K3, K4>;

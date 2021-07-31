import {
    getStateInternal,
    MutableState,
    mutableStateInternal,
    PureStateFunction,
    purifyInternal,
    State,
    StateToken,
    useStateInternal,
    WrappedFunction
} from "../util/state";
import {getCurrentStateContext} from "./component-registry";

export function useState<T, K extends StateToken<T>>(token: K, initial: K["dummy"] | (() => K["dummy"])): State<K["dummy"]> {
    const state = getCurrentStateContext();
    return useStateInternal(token, state, initial);
}

export function getState<T, K extends StateToken<T>>(token: K): State<K["dummy"]> {
    const state = getCurrentStateContext();
    return getStateInternal(token, state);
}

export function mutableState<T, K extends StateToken<T>>(token: K): MutableState<K["dummy"]> {
    const state = getCurrentStateContext();
    return mutableStateInternal(token, state);
}

export function purify<T extends Record<string, unknown>, K extends StateToken<T>, K1=never, K2=never, K3=never, K4=never>(token: K, fn: WrappedFunction<K["dummy"], K1, K2, K3, K4>): PureStateFunction<K1, K2, K3, K4> {
    const state = getCurrentStateContext();
    return purifyInternal(state, token, fn);
}


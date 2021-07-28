import {DeepPartialOrFull, immodify} from "./immodify";
import {markChanged} from "../core/change-tracking/mark-changed";
import {nextId} from "./next-id";
import {ModrnHTMLElement} from "../core/component-registry";

export type ParamType<K1 = never, K2 = never, K3 = never, K4 = never> =
    [K1] extends [never] ? [] :
    [K2] extends [never] ? [K1] :
    [K3] extends [never] ? [K1, K2] :
    [K4] extends [never] ? [K1, K2, K3] :
        [K1, K2, K3, K4];

export type State<T> = [
    T, (newState: T, silent?: boolean) => T
]

export interface Stateful {
    getOwner: () => ModrnHTMLElement;
    state: {[name: string]: unknown};
    update: () => void;
}

// <T> is required to make tokens typesafe
export type StateToken<T> = {
    id: string;
    dummy: T;
};

export function createState<T>(prefix?: string): StateToken<T> {
    return {id: (prefix || "") + nextId(), dummy: null as unknown as T};
}

function clone<T>(initial: T): T {
    if (typeof initial === "object") {
        return {...initial};
    }
    return initial;
}

export function useStateInternal<T, K extends StateToken<T>>(token: K, context: Stateful, initial: T): State<T> {

    const currentState = context.state[token.id] as T;

    function update(newState: T, silent?: boolean) {
        context.state[token.id] = newState;
        if (!silent) {
            Object.values(newState).forEach(value => (typeof value === "object") && markChanged(value));
            context.update();
        }
        return newState;
    }

    if (!currentState) {
        const result = context.state[token.id] = clone(initial);
        return [clone(result), update];
    }

    return [clone(currentState), update];
}

export type PureStateFunction<K1=never, K2=never, K3=never, K4=never> = ((...rest: ParamType<K1, K2, K3, K4>) => void) & {stateContext: WeakRef<Stateful>, stateId: string};

export type WrappedFunction<T, K1=never, K2=never, K3=never, K4=never> = // eslint-disable-line
    (state: T, ...args: ParamType<K1, K2, K3, K4>) => DeepPartialOrFull<T> | undefined | void;

export function purifyInternal<T extends Record<string, unknown>, K extends StateToken<T>, K1=never, K2=never, K3=never, K4=never>(context: Stateful, token: K, fn: WrappedFunction<K["dummy"], K1, K2, K3, K4>): PureStateFunction<K1, K2, K3, K4> {
    function update(newState: T, silent?: boolean) {
        context.state[token.id] = newState;
        if (!silent) {
            Object.values(newState).forEach(value => (typeof value === "object" && value !== null) && markChanged(value));
            context.update();
        }
    }

    function pureWrapper(...rest: ParamType<K1, K2, K3, K4>): void {
        const currentState = context.state[token.id] as T;
        const [state, setState] = [{...currentState}, update];
        const result = fn(state, ...rest);
        result && setState(immodify(state, result));
    }

    const wrapped = pureWrapper as PureStateFunction<K1, K2, K3, K4>;
    wrapped.stateContext = new WeakRef<Stateful>(context);
    wrapped.stateId = token.id;
    return wrapped;
}


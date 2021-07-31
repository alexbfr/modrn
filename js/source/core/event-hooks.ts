import {createState, StateToken} from "../util/state";
import {useState} from "./state-hooks";
import {bindToStateContext, getCurrentStateContext} from "./component-registry";

type EventListener<T, W> = {
    addEventListener(type: T, listener: (this: W, ev: never) => any, options?: boolean | AddEventListenerOptions): void // eslint-disable-line @typescript-eslint/no-explicit-any
    removeEventListener<T>(type: T, listener: (this: W, ev: never) => any, options?: boolean | AddEventListenerOptions): void // eslint-disable-line @typescript-eslint/no-explicit-any
}

type EventListenerState = {
    listener: (this: never, ev: never) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

type EventListenerStateToken = StateToken<EventListenerState>;

export function createEventListener(): EventListenerStateToken {
    return createState<EventListenerState>();
}



export function useEventListener<T, W>(token: EventListenerStateToken, on: EventListener<T, W>, type: T, listener: (this: W, ev: never) => any): void { // eslint-disable-line @typescript-eslint/no-explicit-any
    const [state] = useState(token, () => {
        const listener1 = bindToStateContext(listener.bind(on));
        on.addEventListener(type, listener1);
        return {
            listener: listener1
        };
    });
    useDisconnect(() => {
        on.removeEventListener(type, state.listener);
    });
}

export function useDisconnect(fn: () => void): void {
    getCurrentStateContext().disconnected.push(bindToStateContext(fn));
}


import { StateToken } from "../../util/state";
declare type EventListener<T, W> = {
    addEventListener(type: T, listener: (this: W, ev: never) => any, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<T>(type: T, listener: (this: W, ev: never) => any, options?: boolean | AddEventListenerOptions): void;
};
declare type EventListenerState = {
    listener: (this: never, ev: never) => any;
};
declare type EventListenerStateToken = StateToken<EventListenerState>;
export declare function createEventListener(): EventListenerStateToken;
export declare function useEventListener<T, W>(token: EventListenerStateToken, on: EventListener<T, W>, type: T, listener: (this: W, ev: never) => any): void;
export {};

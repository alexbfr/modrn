import { StateToken } from "../../util/state";
export declare type ChangeHookState = {
    previous: unknown;
    initial: boolean;
};
export declare type ChangeHookStateToken = StateToken<ChangeHookState> & {
    depth: number;
};
export declare type ChangeHandlerFn<T> = (now: T, previous: T) => void;
/**
 * Creates a change hook. depth specifies the maximum recursion depth to compare the two objects
 * @param depth - maximum recursion depth
 */
export declare function createChangeHook(depth?: number): ChangeHookStateToken;
/**
 * Gets or creates an element-attached change hook-
 * @param prefix - the prefix to disambiguate multiple attached states on the same element
 * @param element - the element to attach the state to
 * @param depth - maximum recusrion depth
 */
export declare function getOrCreateElementAttachedChangeHook(prefix: string, element: Element, depth?: number): ChangeHookStateToken;
/**
 * Gets or creates a change hook attached on another state
 * @param prefix - the prefix to disambiguate multiple attached states on the same element
 * @param otherToken - the other state to attach this change hook to
 * @param depth - maximum recusrion depth
 */
export declare function getOrCreateTokenAttachedChangeHook<T>(prefix: string, otherToken: StateToken<T>, depth?: number): ChangeHookStateToken;
/**
 * Tracks changes to the provided value, which must be not null. Change is detected recursively up to the depth when
 * creating the state token.
 * @see createChangeHook
 * @see getOrCreateElementAttachedChangeHook
 *
 * @param stateToken
 * @param value
 * @param changeHandlerFn
 */
export declare function useChange<T>(stateToken: ChangeHookStateToken, value: NonNullable<T>, changeHandlerFn?: ChangeHandlerFn<T>): boolean;

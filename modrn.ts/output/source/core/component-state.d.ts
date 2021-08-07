import { ComponentState, ModrnHTMLElement, Stateful } from "./types/modrn-html-element";
export declare type BoundFn<T, R> = ((...params: T[]) => R) & {
    bound: true;
    dynamic: boolean;
};
/**
 * Returns or creates the empty state for the element
 * @param self
 */
export declare function getStateOf(self: ModrnHTMLElement): ComponentState;
/**
 * Returns the current state context during rendering
 */
export declare function getCurrentStateContext(): Stateful;
/**
 * Wraps the provided function with the state, preserving the state context stack
 * @param state
 * @param fn
 * @param params
 */
export declare function withState<T, R>(state: Stateful, fn: (...params: T[]) => R, ...params: T[]): R;
/**
 * Explicitly declares the provided function as dynamic. This has the effect that the function is newly instantiated
 * during each render and thus sees all props always. This has some performance implications, and it is preferable to
 * use state-bound functions instead (state is always up-to-date) and should be avoided where not necessary.
 *
 * @param fn
 * @param params
 */
export declare function dynamic<T, R>(fn: (...params: T[]) => R, ...params: T[]): (...params: T[]) => R;
/**
 * Binds the provided function to the current state context, if not already bound.
 * @see withState
 *
 * @param fn
 * @param params
 */
export declare function bindToStateContext<T, R>(fn: (...params: T[]) => R, ...params: T[]): (...params: T[]) => R;

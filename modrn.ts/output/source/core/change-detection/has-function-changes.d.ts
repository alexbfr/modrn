/**
 * Checks if a function has changed. If the function is dynamic {@see dynamic}, it is strictly compared for equality,
 * which means it changes during each re-render. If the function is state-bound {@see purify}, it is considered
 * inequal only if the state has changed in between. @TODO this is probably not even necessary, write test
 *
 * @param previous
 * @param valueToSet
 */
export declare function hasFunctionChanged(previous: unknown, valueToSet: unknown): boolean;

/**
 * Checks if an object has changed up to a maximum recursion depth
 * @param previous
 * @param now
 * @param depth
 */
export declare function hasChanged(previous: unknown, now: unknown, depth: number): boolean;
/**
 * Checks if an array has changed up to a maximum recursion depth
 * @param previousArr
 * @param nowArr
 * @param depth
 */
export declare function hasArrayChanged(previousArr: unknown[], nowArr: unknown[], depth: number): boolean;
/**
 * Checks if an object has changed up to a maximum recursion depth
 * @param previous
 * @param value
 * @param depth
 */
export declare function hasObjectChanged(previous: Record<string, unknown>, value: Record<string, unknown>, depth: number): boolean;

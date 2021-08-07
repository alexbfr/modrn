/**
 * Checks if an object is tainted (i.e. marked dirty, despite potentially having the same reference than in the
 * past rendering cycle)
 *
 * @param what
 */
export declare function isTainted<T>(what: T): boolean;
/**
 * Reset tainted flags
 */
export declare function clearTainted(): void;
/**
 * Mark an object as tainted. This both marks the object as tainted and checks which other
 * components reference this specific object currently, and marks those as requiring a re-render.
 *
 * @param what
 * @param recursive
 */
export declare function markChanged<T extends object | unknown[]>(what: T, recursive?: boolean): void;

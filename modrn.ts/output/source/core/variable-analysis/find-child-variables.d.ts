import { ChildVariable } from "../types/variables";
/**
 * Searches for child variables
 * @example
 * <span>{{aChild}}</span>
 *
 * @param rootElement
 * @param indexes
 */
export declare function findChildVariables(rootElement: Element, indexes: number[]): ChildVariable[];

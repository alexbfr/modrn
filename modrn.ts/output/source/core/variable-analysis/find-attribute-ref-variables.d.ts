import { AttributeRefVariable } from "../types/variables";
/**
 * Searches for ref attributes
 * @example
 * <span ref="{{myRef}}">...</span>
 *
 * @param rootElement
 * @param indexes
 */
export declare function findAttributeRefVariables(rootElement: Element, indexes: number[]): AttributeRefVariable[];

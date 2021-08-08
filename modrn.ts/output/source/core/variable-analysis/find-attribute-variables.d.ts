import { AttributeVariable } from "../types/variables";
/**
 * Searches for attribute variables
 * @example
 * <span title="{{dynamicTitle}}">...</span>
 *
 * @param rootElement
 * @param indexes
 */
export declare function findAttributeVariables(rootElement: Element, indexes: number[]): AttributeVariable[];

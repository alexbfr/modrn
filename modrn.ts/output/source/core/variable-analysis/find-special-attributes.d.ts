import { SpecialAttributeVariable } from "../types/variables";
/**
 * Looks for special attributes, that is, attributes which have been registered as such
 * @see registerSpecialAttribute
 *
 * @param rootElement
 * @param indexes
 */
export declare function findSpecialAttributes(rootElement: Element, indexes: number[]): SpecialAttributeVariable[];
export declare function hasSpecialAttributes(rootElement: HTMLElement): boolean;

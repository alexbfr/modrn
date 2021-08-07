import { FoundVariables } from "../types/variables";
/**
 * Finds variable references in the provided element.
 * This function inspects all children recursively. If a ModrnHTMLElement is encountered,
 * recursion stops there (a ModrnHTMLElement will have done the same process for its own content already).
 *
 * Also, there is specific handling for special attributes which wrap their element (like m-if or m-for).
 *
 * @param rootElement
 */
export declare function findVariables(rootElement: Element): FoundVariables;

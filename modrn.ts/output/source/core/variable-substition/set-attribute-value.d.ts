import { ModrnHTMLElement } from "../types/modrn-html-element";
/**
 * Gets the value of an attribute for a specific node (with the rendering context of "self" i.e. the containing ModrnHTMLElement)
 *
 * @param self
 * @param node
 * @param attributeNameOriginal
 */
export declare function getAttributeValue(self: ModrnHTMLElement, node: Element, attributeNameOriginal: string): unknown;
/**
 * Sets the value of an attribute/prop
 * @param self - the ModrnHTMLElement providing the context
 * @param node - the node to set the attribute/prop on
 * @param attributeName - the name of the attribute/prop
 * @param value - the value
 * @param hidden - if true, hides a html-visible counterpart for a ModrnHTMLElement node
 */
export declare function setAttributeValue(self: ModrnHTMLElement, node: Element, attributeName: string, value: unknown, hidden: boolean): void;

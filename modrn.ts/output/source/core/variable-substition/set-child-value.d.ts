import { VariableMapping } from "../types/variables";
import { ModrnHTMLElement } from "../types/modrn-html-element";
/**
 * Gets the child value of the node
 * @param self
 * @param node
 */
export declare function getChildValue(self: ModrnHTMLElement, node: Node): unknown;
/**
 * Sets the child value of the provided node. This is a bit lengthy (see the individual functions below),
 * since several cases have to be taken care of. There will be bugs here waiting to be fixed.
 *
 * @param self
 * @param node
 * @param match
 * @param valueProvided
 */
export declare function setChildValue(self: ModrnHTMLElement, node: Node, match: VariableMapping, valueProvided: unknown): unknown;
export declare function nodeInfo(node: Node): string;

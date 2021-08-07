import { ModrnHTMLElement } from "./types/modrn-html-element";
/**
 * Renders the component. The root node to render may be specified explicitly during the initial rendering (the fully rendered
 * content is then appended at once).
 *
 * @param self
 * @param nodeToRender
 * @param suppressForDirectChildren
 */
export declare function renderComponent(self: ModrnHTMLElement, nodeToRender?: Element, suppressForDirectChildren?: boolean): void;

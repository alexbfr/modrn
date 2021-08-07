/**
 * Splits the text content of the provided element around variable references like {{x}}
 * It does this by cutting off text before and/or after a variable reference and puts the variable reference
 * in its own text node.
 *
 * The text node is later upgraded to a element, if required {@see substituteVariables}
 *
 * @param rootElement
 */
export declare function splitTextContentAtVariables(rootElement: Element): void;

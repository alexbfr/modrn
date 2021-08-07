import { VariableMappings } from "../types/variables";
import { ModrnHTMLElement } from "../types/modrn-html-element";
/**
 * Substitute variables in the children of the provided ModrnHTMLElement.
 *
 * It is important to keep in mind that the variable definition's ".sorted" contains a list of referenced variables sorted by child node
 * in ascending depth order.
 *
 * The process outlined is:
 *      - For each child node in the template which is referencing variables,
 *        - Check if constants must be applied
 *        - For all variables *defined in the varsProvided* parameter, check if this childnode uses that variable at all; if not, skip
 *        - Then iterate all variable references using the current variable from varsProvided
 *        - If it is a complex expression (i.e. potentially referencing more than just one variable from varsProvided), check if it was already calculated
 *        - Set the value to the variable value or expression result
 *      - Repeat
 *
 * Initially the process was to just iterate over varsProvided, but this has proven not as effective since it meant searching a child node
 * multiple times, and potentially updating it also multiple times (instead of one time, then queueing a re-render after being finished)
 *
 * For now this is good enough; maybe i'Ll revert it to the previous algorithm with kind of in-place-node-ordering/caching, but the gain does not outweigh
 * the cost right now. Should this ever be used with large(ish) apps, it shouldn't pose a problem to optimize according to the then-real world scenario.
 *
 * @param self
 * @param root
 * @param varsProvided
 * @param variableDefinitionsProvided
 * @param suppressReRender
 */
export declare function substituteVariables(self: ModrnHTMLElement, root: Element, varsProvided: Vars, variableDefinitionsProvided?: VariableMappings, suppressReRender?: boolean): void;
export declare type VarOptions = {
    hideByDefault?: boolean;
};
export declare type Vars = Record<string, unknown> & {
    "__options"?: VarOptions;
};
export declare function varsWithOptions(vars: Record<string, unknown>, options: VarOptions): Vars;

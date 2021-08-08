import { BaseExpression } from "../types/expression-types";
/**
 * Extract an expression from the provided text content
 * @param textContent
 */
export declare function extractExpression(textContent: string): BaseExpression;
export declare function extractVariableName(textContent: string): string;

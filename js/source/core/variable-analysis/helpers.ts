import {variablePattern} from "./variable-types";

export function extractVariableName(textContent: string): string {
    return textContent.substring(2, textContent.length - 2);
}

export function isRefAttributeName(name: string): boolean {
    return name === "ref";
}

export function isWildcardAttributeName(name: string): boolean {
    return variablePattern.test(name);
}


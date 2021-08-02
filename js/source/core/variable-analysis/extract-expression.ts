/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {variableNamePattern} from "./variable-types";
import {compile} from "../../util/expression-eval";
import jsep, {Jsep} from "../../jsep/jsep";
import {
    BaseExpression,
    ComplexExpression,
    ConstantExpression,
    ExpressionType,
    FunctionReferenceExpression,
    VariableUsageExpression
} from "../types/expression-types";
import ArrayExpression = jsep.ArrayExpression;
import BinaryExpression = jsep.BinaryExpression;
import CallExpression = jsep.CallExpression;
import Compound = jsep.Compound;
import Identifier = jsep.Identifier;
import MemberExpression = jsep.MemberExpression;
import UnaryExpression = jsep.UnaryExpression;
import LogicalExpression = jsep.LogicalExpression;
import ConditionalExpression = jsep.ConditionalExpression;

/**
 * Extract an expression from the provided text content
 * @param textContent
 */
export function extractExpression(textContent: string): BaseExpression {
    // Is it an expression after all?
    if (!textContent.startsWith("{{")) {
        return {
            expressionType: ExpressionType.ConstantExpression,
            value: textContent
        } as ConstantExpression;
    }
    const text = textContent.substring(2, textContent.length - 2).trim();

    // Function references start with & (abbreviation for () => ...)
    if (text.startsWith("&")) {
        return extractFunctionReferenceExpression(text);
    } else if (variableNamePattern.test(textContent)) {
        return extractVariableReferenceExpression(text);
    } else {
        return extractComplexExpression(text);
    }
}

function extractVariableReferenceExpression(text: string) {
    return {expressionType: ExpressionType.VariableUsage, variableName: text} as VariableUsageExpression;
}

function extractComplexExpression(text: string) {
    const variableNames: string[] = [];
    const expression = Jsep.parse(text);
    collectVariableNames(expression, variableNames);
    const compiled = compile(expression);
    if (variableNames.length === 0) {
        return {
            expressionType: ExpressionType.ConstantExpression,
            value: compiled({})
        } as ConstantExpression;
    }
    return {
        expressionType: ExpressionType.ComplexExpression,
        usedVariableNames: variableNames,
        expression,
        compiledExpression: compiled,
        originalExpression: text
    } as ComplexExpression;
}

function extractFunctionReferenceExpression(text: string) {
    const expression = Jsep.parse(text.substring(1));
    if (expression.type !== "CallExpression") {
        throw new Error(`Cannot parse ${text} as a function reference`);
    }
    const variableNames: string[] = [];

    collectVariableNames(expression, variableNames);

    const compiled = compile(expression);
    return {
        expressionType: ExpressionType.FunctionReferenceExpression,
        usedVariableNames: variableNames,
        expression,
        compiledExpression: compiled,
        originalExpression: "&" + text
    } as FunctionReferenceExpression;
}

export function extractVariableName(textContent: string): string {
    return textContent.substring(2, textContent.length - 2);
}

export function isRefAttributeName(name: string): boolean {
    return name === "ref";
}

export function isWildcardAttributeName(name: string): boolean {
    return variableNamePattern.test(name);
}


function collectVariableNames(parsed: jsep.Expression, variableNameList: string[]) {
    switch (parsed.type) {
    case "ArrayExpression":
        (parsed as ArrayExpression).elements.forEach(element => collectVariableNames(element, variableNameList));
        break;
    case "BinaryExpression":
        [(parsed as BinaryExpression).left, (parsed as BinaryExpression).right].forEach(element => collectVariableNames(element, variableNameList));
        break;
    case "CallExpression":
        [(parsed as CallExpression).callee, ...(parsed as CallExpression).arguments].forEach(element => collectVariableNames(element, variableNameList));
        break;
    case "Compound":
        (parsed as Compound).body.forEach(element => collectVariableNames(element, variableNameList));
        break;
    case "Identifier": {
        const identifier = (parsed as Identifier).name;
        if (!(identifier in jsKeyword) && identifier !== "Date") {
            variableNameList.push(identifier);
        }
        break;
    }
    case "MemberExpression":
        collectVariableNames((parsed as MemberExpression).object, variableNameList);
        break;
    case "Literal":
    case "ThisExpression":
        break;
    case "UnaryExpression":
        collectVariableNames((parsed as UnaryExpression).argument, variableNameList);
        break;
    case "LogicalExpression":
        [(parsed as LogicalExpression).left, (parsed as LogicalExpression).right].forEach(element => collectVariableNames(element, variableNameList));
        break;
    case "ConditionalExpression":
        [(parsed as ConditionalExpression).test, (parsed as ConditionalExpression).consequent, (parsed as ConditionalExpression).alternate].forEach(element => collectVariableNames(element, variableNameList));
        break;
    default:
        throw new Error(`Unknown expression type ${parsed.type}`);
    }
}

const jsKeyword = {
    "abstract": true,
    "arguments": true,
    "await": true,
    "boolean": true,
    "break": true,
    "byte": true,
    "case": true,
    "catch": true,
    "char": true,
    "class": true,
    "const": true,
    "continue": true,
    "debugger": true,
    "default": true,
    "delete": true,
    "do": true,
    "double": true,
    "else": true,
    "enum": true,
    "eval": true,
    "export": true,
    "extends": true,
    "false": true,
    "final": true,
    "finally": true,
    "float": true,
    "for": true,
    "function": true,
    "goto": true,
    "if": true,
    "implements": true,
    "import": true,
    "in": true,
    "instanceof": true,
    "int": true,
    "interface": true,
    "let": true,
    "long": true,
    "native": true,
    "new": true,
    "null": true,
    "package": true,
    "private": true,
    "protected": true,
    "public": true,
    "return": true,
    "short": true,
    "static": true,
    "super": true,
    "switch": true,
    "synchronized": true,
    "this": true,
    "throw": true,
    "throws": true,
    "transient": true,
    "true": true,
    "try": true,
    "typeof": true,
    "var": true,
    "void": true,
    "volatile": true,
    "while": true,
    "with": true,
    "yield": true,
};

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import jsep from "../../jsep/jsep";

export enum ExpressionType {
    VariableUsage,
    ComplexExpression,
    ConstantExpression,
    FunctionReferenceExpression
}

export type BaseExpression = {
    expressionType: ExpressionType;
};

export type VariableUsageExpression = {
    expressionType: ExpressionType.VariableUsage;
    variableName: string;
} & BaseExpression;

export type ComplexExpression = {
    expressionType: ExpressionType.ComplexExpression;
    usedVariableNames: string[];
    expression: jsep.Expression;
    originalExpression: string;
    compiledExpression: (what: unknown) => unknown;
} & BaseExpression;

export type FunctionReferenceExpression = {
    expressionType: ExpressionType.FunctionReferenceExpression;
    usedVariableNames: string[];
    expression: jsep.Expression;
    originalExpression: string;
    compiledExpression: (what: unknown) => unknown;
} & BaseExpression;

export type ConstantExpression = {
    expressionType: ExpressionType.ConstantExpression;
    value: unknown;
} & BaseExpression;


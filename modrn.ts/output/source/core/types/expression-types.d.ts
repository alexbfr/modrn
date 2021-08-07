import jsep from "../../jsep/jsep";
export declare enum ExpressionType {
    VariableUsage = 0,
    ComplexExpression = 1,
    ConstantExpression = 2,
    FunctionReferenceExpression = 3
}
export declare type BaseExpression = {
    expressionType: ExpressionType;
};
export declare type VariableUsageExpression = {
    expressionType: ExpressionType.VariableUsage;
    variableName: string;
} & BaseExpression;
export declare type ComplexExpression = {
    expressionType: ExpressionType.ComplexExpression;
    usedVariableNames: string[];
    expression: jsep.Expression;
    originalExpression: string;
    compiledExpression: (what: unknown) => unknown;
} & BaseExpression;
export declare type FunctionReferenceExpression = {
    expressionType: ExpressionType.FunctionReferenceExpression;
    usedVariableNames: string[];
    expression: jsep.Expression;
    originalExpression: string;
    compiledExpression: (what: unknown) => unknown;
} & BaseExpression;
export declare type ConstantExpression = {
    expressionType: ExpressionType.ConstantExpression;
    value: unknown;
} & BaseExpression;

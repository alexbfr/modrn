import jsep from "../jsep/jsep";
declare type operand = number | string;
declare type unaryCallback = (a: operand) => operand;
declare type binaryCallback = (a: operand, b: operand, nodeA: jsep.Expression, nodeB: jsep.Expression, context: any) => operand;
export declare type lazy = {
    lazy?: true;
};
declare function evaluate(_node: jsep.Expression, context: object): any;
declare function evalAsync(_node: jsep.Expression, context: object): Promise<any>;
declare function compile(expression: jsep.Expression): (context: object) => any;
declare function compileAsync(expression: string | jsep.Expression): (context: object) => Promise<any>;
declare function addUnaryOp(operator: string, _function: unaryCallback): void;
declare function addBinaryOp(operator: string, precedence_or_fn: number | binaryCallback, _function: binaryCallback): void;
export { jsep as parse, evaluate as eval, evalAsync, compile, compileAsync, addUnaryOp, addBinaryOp };

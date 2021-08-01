// @ts-no-check
/* eslint-disable */

import jsep, {Jsep} from "../jsep/jsep";
import Compound = jsep.Compound;
import Expression = jsep.Expression;

/**
 * Evaluation code from JSEP project, under MIT License.
 * Copyright (c) 2013 Stephen Oney, http://jsep.from.so/
 */

// Default operator precedence from https://github.com/EricSmekens/jsep/blob/master/src/jsep.js#L55
const DEFAULT_PRECEDENCE: Record<string, number> = {
    "||": 1,
    "&&": 2,
    "|": 3,
    "^": 4,
    "&": 5,
    "==": 6,
    "!=": 6,
    "===": 6,
    "!==": 6,
    "<": 7,
    ">": 7,
    "<=": 7,
    ">=": 7,
    "<<": 8,
    ">>": 8,
    ">>>": 8,
    "+": 9,
    "-": 9,
    "*": 10,
    "/": 10,
    "%": 10
};

const binops: Record<string, ((a: any, b: any, nodeLeft: jsep.Expression, nodeRight: jsep.Expression, ctx: any) => any)> = {
    "||": function (a: any, b: any) { return a || b; },
    "&&": function (a: any, b: any) { return a && b; },
    "|": function (a: any, b: any) { return a | b; },
    "^": function (a: any, b: any) { return a ^ b; },
    "&": function (a: any, b: any) { return a & b; },
    "==": function (a: any, b: any) { return a == b; }, // jshint ignore:line
    "!=": function (a: any, b: any) { return a != b; }, // jshint ignore:line
    "===": function (a: any, b: any) { return a === b; },
    "!==": function (a: any, b: any) { return a !== b; },
    "<": function (a: any, b: any) { return a < b; },
    ">": function (a: any, b: any) { return a > b; },
    "<=": function (a: any, b: any) { return a <= b; },
    ">=": function (a: any, b: any) { return a >= b; },
    "<<": function (a: any, b: any) { return a << b; },
    ">>": function (a: any, b: any) { return a >> b; },
    ">>>": function (a: any, b: any) { return a >>> b; },
    "+": function (a: any, b: any) { return a + b; },
    "-": function (a: any, b: any) { return a - b; },
    "*": function (a: any, b: any) { return a * b; },
    "/": function (a: any, b: any) { return a / b; },
    "%": function (a: any, b: any) { return a % b; }
};

const unops: Record<string, ((a: any) => any)> = {
    "-": function (a: any) { return -a; },
    "+": function (a: any) { return +a; },
    "~": function (a: any) { return ~a; },
    "!": function (a: any) { return !a; },
};

declare type operand = number | string;
declare type unaryCallback = (a: operand) => operand;
declare type binaryCallback = (a: operand, b: operand, nodeA: jsep.Expression, nodeB: jsep.Expression, context: any) => operand;
export declare type lazy = {
    lazy?: true;
}

type AnyExpression = jsep.ArrayExpression
    | jsep.BinaryExpression
    | jsep.MemberExpression
    | jsep.CallExpression
    | jsep.ConditionalExpression
    | jsep.Identifier
    | jsep.Literal
    | jsep.LogicalExpression
    | jsep.ThisExpression
    | jsep.UnaryExpression;

function evaluateArray(list: any, context: any) {
    return list.map(function (v: any) { return evaluate(v, context); });
}

async function evaluateArrayAsync(list: any, context: any) {
    const res = await Promise.all(list.map((v: any) => evalAsync(v, context)));
    return res;
}

function evaluateMember(node: jsep.MemberExpression, context: object) {
    const object: any = evaluate(node.object, context);
    let key: string;
    if (node.computed) {
        key = evaluate(node.property, context);
    } else {
        key = (node.property as jsep.Identifier).name;
    }
    if (/^__proto__|prototype|constructor$/.test(key)) {
        throw Error(`Access to member "${key}" disallowed.`);
    }
    return [object, object[key]];
}

async function evaluateMemberAsync(node: jsep.MemberExpression, context: object) {
    const object: any = await evalAsync(node.object, context);
    let key: string;
    if (node.computed) {
        key = await evalAsync(node.property, context);
    } else {
        key = (node.property as jsep.Identifier).name;
    }
    if (/^__proto__|prototype|constructor$/.test(key)) {
        throw Error(`Access to member "${key}" disallowed.`);
    }
    return [object, object[key]];
}

function evaluate(_node: jsep.Expression, context: object): any {

    const node = _node as AnyExpression | Compound;

    switch (node.type) {

    case "ArrayExpression":
        return evaluateArray(node.elements, context);

    case "BinaryExpression": {
        const binop = binops[node.operator as keyof typeof binops];
        if ((binop as lazy).lazy) {
            return binop(null, null, node.left, node.right, context);
        }
        return binop(evaluate(node.left, context), evaluate(node.right, context), node.left, node.right, context);
    }
    case "CallExpression":
        let caller, fn, assign;
        if (node.callee.type === "MemberExpression") {
            assign = evaluateMember(node.callee as jsep.MemberExpression, context);
            caller = assign[0];
            fn = assign[1];
        } else {
            fn = evaluate(node.callee, context);
        }
        if (typeof fn !== "function") { return undefined; }
        return fn.apply(caller, evaluateArray(node.arguments, context));

    case "ConditionalExpression":
        return evaluate(node.test, context)
            ? evaluate(node.consequent, context)
            : evaluate(node.alternate, context);

    case "Identifier":
        return context[node.name as keyof typeof context];

    case "Literal":
        return node.value;

    case "LogicalExpression":
        if (node.operator === "||") {
            return evaluate(node.left, context) || evaluate(node.right, context);
        } else if (node.operator === "&&") {
            return evaluate(node.left, context) && evaluate(node.right, context);
        }
        return binops[node.operator as keyof typeof binops](evaluate(node.left, context), evaluate(node.right, context), node.left, node.right, context);

    case "MemberExpression":
        return evaluateMember(node, context)[1];

    case "ThisExpression":
        return context;

    case "UnaryExpression":
        return unops[node.operator as keyof typeof unops](evaluate(node.argument, context));

    case "Compound": {
        const compound = (node as Compound);
        return compound.body.map(value => evaluate(value, context));
    }

    default:
        return undefined;
    }

}

async function evalAsync(_node: jsep.Expression, context: object): Promise<any> {

    const node = _node as AnyExpression;

    // Brackets used for some case blocks here, to avoid edge cases related to variable hoisting.
    // See: https://stackoverflow.com/questions/57759348/const-and-let-variable-shadowing-in-a-switch-statement
    switch (node.type) {

    case "ArrayExpression":
        return await evaluateArrayAsync(node.elements, context);

    case "BinaryExpression": {
        const [left, right] = await Promise.all([
            evalAsync(node.left, context),
            evalAsync(node.right, context)
        ]);
        return binops[node.operator as keyof typeof binops](left, right, node.left, node.right, context);
    }

    case "CallExpression": {
        let caller, fn, assign;
        if (node.callee.type === "MemberExpression") {
            assign = await evaluateMemberAsync(node.callee as jsep.MemberExpression, context);
            caller = assign[0];
            fn = assign[1];
        } else {
            fn = await evalAsync(node.callee, context);
        }
        if (typeof fn !== "function") {
            return undefined;
        }
        return await fn.apply(
            caller,
            await evaluateArrayAsync(node.arguments, context)
        );
    }

    case "ConditionalExpression":
        return (await evalAsync(node.test, context))
            ? await evalAsync(node.consequent, context)
            : await evalAsync(node.alternate, context);

    case "Identifier":
        return context[node.name as keyof typeof context];

    case "Literal":
        return node.value;

    case "LogicalExpression": {
        if (node.operator === "||") {
            return (
                (await evalAsync(node.left, context)) ||
                (await evalAsync(node.right, context))
            );
        } else if (node.operator === "&&") {
            return (
                (await evalAsync(node.left, context)) &&
                (await evalAsync(node.right, context))
            );
        }

        const [left, right] = await Promise.all([
            evalAsync(node.left, context),
            evalAsync(node.right, context)
        ]);

        return binops[node.operator as keyof typeof binops](left, right, node.left, node.right, context);
    }

    case "MemberExpression":
        return (await evaluateMemberAsync(node, context))[1];

    case "ThisExpression":
        return context;

    case "UnaryExpression":
        return unops[node.operator as keyof typeof unops](await evalAsync(node.argument, context));

    default:
        return undefined;
    }
}

function compile(expression: jsep.Expression): (context: object) => any {
    return evaluate.bind(null, expression);
}

function compileAsync(expression: string | jsep.Expression): (context: object) => Promise<any> {
    return evalAsync.bind(null, (expression as Expression)?.type ? expression : Jsep.parse(expression as string));
}

// Added functions to inject Custom Unary Operators (and override existing ones)
function addUnaryOp(operator: string, _function: unaryCallback): void {
    Jsep.addUnaryOp(operator);
    unops[operator] = _function;
}

// Added functions to inject Custom Binary Operators (and override existing ones)
function addBinaryOp(operator: string, precedence_or_fn: number | binaryCallback, _function: binaryCallback): void {
    if (_function) {
        Jsep.addBinaryOp(operator, precedence_or_fn as number);
        binops[operator as keyof typeof binops] = _function;
    } else {
        Jsep.addBinaryOp(operator, DEFAULT_PRECEDENCE[operator] || 1);
        binops[operator as keyof typeof binops] = precedence_or_fn as ((a: any, b: any) => any);
    }
}

export {
    jsep as parse,
    evaluate as eval,
    evalAsync,
    compile,
    compileAsync,
    addUnaryOp,
    addBinaryOp
};


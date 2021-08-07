/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

//     JavaScript Expression Parser (JSEP) <%= version %>
//     JSEP may be freely distributed under the MIT License
//     https://ericsmekens.github.io/jsep/

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace jsep {
    export interface Expression {
        type: ExpressionType;
    }

    export interface ArrayExpression extends Expression {
        type: "ArrayExpression";
        elements: Expression[];
    }

    export interface BinaryExpression extends Expression {
        type: "BinaryExpression";
        operator: string;
        left: Expression;
        right: Expression;
    }

    export interface CallExpression extends Expression {
        type: "CallExpression";
        arguments: Expression[];
        callee: Expression;
    }

    export interface Compound extends Expression {
        type: "Compound";
        body: Expression[];
    }

    export interface ConditionalExpression extends Expression {
        type: "ConditionalExpression";
        test: Expression;
        consequent: Expression;
        alternate: Expression;
    }

    export interface Identifier extends Expression {
        type: "Identifier";
        name: string;
    }

    export interface Literal extends Expression {
        type: "Literal";
        value: boolean | number | string;
        raw: string;
    }

    export interface LogicalExpression extends Expression {
        type: "LogicalExpression";
        operator: string;
        left: Expression;
        right: Expression;
    }

    export interface MemberExpression extends Expression {
        type: "MemberExpression";
        computed: boolean;
        object: Expression;
        property: Expression;
    }

    export interface ThisExpression extends Expression {
        type: "ThisExpression";
    }

    export interface UnaryExpression extends Expression {
        type: "UnaryExpression";
        operator: string;
        argument: Expression;
        prefix: boolean;
    }

    type ExpressionType =
        "Compound"
        | "Identifier"
        | "MemberExpression"
        | "Literal"
        | "ThisExpression"
        | "CallExpression"
        | "UnaryExpression"
        | "BinaryExpression"
        | "LogicalExpression"
        | "ConditionalExpression"
        | "ArrayExpression";

}


export class Jsep {

    private expr: string;
    public index = 0;

    /**
     * @returns {string}
     */
    static get version(): string {
        // To be filled in by the template
        return "<%= version %>";
    }

    /**
     * @returns {string}
     */
    static toString(): string {
        return "JavaScript Expression Parser (JSEP) v" + Jsep.version;
    }

    // ==================== CONFIG ================================
    /**
     * @method addUnaryOp
     * @param {string} op_name The name of the unary op to add
     * @returns {Jsep}
     */
    static addUnaryOp(op_name: string): typeof Jsep {
        Jsep.max_unop_len = Math.max(op_name.length, Jsep.max_unop_len);
        Jsep.unary_ops[op_name] = 1;
        return Jsep;
    }

    /**
     * @method jsep.addBinaryOp
     * @param {string} op_name The name of the binary op to add
     * @param {number} precedence The precedence of the binary op (can be a float)
     * @returns {Jsep}
     */
    static addBinaryOp(op_name: string, precedence: number): typeof Jsep {
        Jsep.max_binop_len = Math.max(op_name.length, Jsep.max_binop_len);
        Jsep.binary_ops[op_name] = precedence;
        return Jsep;
    }

    /**
     * @method addIdentifierChar
     * @param {string} char The additional character to treat as a valid part of an identifier
     * @returns {Jsep}
     */
    static addIdentifierChar(char: string): typeof Jsep {
        Jsep.additional_identifier_chars.add(char);
        return Jsep;
    }

    /**
     * @method addLiteral
     * @param {string} literal_name The name of the literal to add
     * @param {*} literal_value The value of the literal
     * @returns {Jsep}
     */
    static addLiteral(literal_name: string, literal_value: any): typeof Jsep { // eslint-disable-line
        Jsep.literals[literal_name] = literal_value;
        return Jsep;
    }

    /**
     * @method removeUnaryOp
     * @param {string} op_name The name of the unary op to remove
     * @returns {Jsep}
     */
    static removeUnaryOp(op_name: string): typeof Jsep {
        delete Jsep.unary_ops[op_name];
        if (op_name.length === Jsep.max_unop_len) {
            Jsep.max_unop_len = Jsep.getMaxKeyLen(Jsep.unary_ops);
        }
        return Jsep;
    }

    /**
     * @method removeAllUnaryOps
     * @returns {Jsep}
     */
    static removeAllUnaryOps(): typeof Jsep {
        Jsep.unary_ops = {};
        Jsep.max_unop_len = 0;

        return Jsep;
    }

    /**
     * @method removeIdentifierChar
     * @param {string} char The additional character to stop treating as a valid part of an identifier
     * @returns {Jsep}
     */
    static removeIdentifierChar(char: string): typeof Jsep {
        Jsep.additional_identifier_chars.delete(char);
        return Jsep;
    }

    /**
     * @method removeBinaryOp
     * @param {string} op_name The name of the binary op to remove
     * @returns {Jsep}
     */
    static removeBinaryOp(op_name: string): typeof Jsep {
        delete Jsep.binary_ops[op_name];

        if (op_name.length === Jsep.max_binop_len) {
            Jsep.max_binop_len = Jsep.getMaxKeyLen(Jsep.binary_ops);
        }

        return Jsep;
    }

    /**
     * @method removeAllBinaryOps
     * @returns {Jsep}
     */
    static removeAllBinaryOps(): typeof Jsep {
        Jsep.binary_ops = {};
        Jsep.max_binop_len = 0;

        return Jsep;
    }

    /**
     * @method removeLiteral
     * @param {string} literal_name The name of the literal to remove
     * @returns {Jsep}
     */
    static removeLiteral(literal_name: string): typeof Jsep {
        delete Jsep.literals[literal_name];
        return Jsep;
    }

    /**
     * @method removeAllLiterals
     * @returns {Jsep}
     */
    static removeAllLiterals(): typeof Jsep {
        Jsep.literals = {};

        return Jsep;
    }

    // ==================== END CONFIG ============================


    /**
     * @returns {string}
     */
    get char(): string {
        return this.expr.charAt(this.index);
    }

    /**
     * @returns {number}
     */
    get code(): number {
        return this.expr.charCodeAt(this.index);
    }


    /**
     * @param {string} expr a string with the passed in express
     * @returns Jsep
     */
    constructor(expr: string) {
        // `index` stores the character number we are currently at
        // All of the gobbles below will modify `index` as we move along
        this.expr = expr;
        this.index = 0;
    }

    /**
     * static top-level parser
     * @returns {jsep.Expression}
     */
    static parse(expr: string): jsep.Expression {
        return (new Jsep(expr)).parse();
    }

    /**
     * Get the longest key length of any object
     * @param {object} obj
     * @returns {number}
     */
    static getMaxKeyLen<T>(obj: T): number {
        return Math.max(0, ...Object.keys(obj).map(k => k.length));
    }

    /**
     * `ch` is a character code in the next three functions
     * @param {number} ch
     * @returns {boolean}
     */
    static isDecimalDigit(ch: number): boolean {
        return (ch >= 48 && ch <= 57); // 0...9
    }

    /**
     * Returns the precedence of a binary operator or `0` if it isn't a binary operator. Can be float.
     * @param {string} op_val
     * @returns {number}
     */
    static binaryPrecedence(op_val: string): number {
        return Jsep.binary_ops[op_val] || 0;
    }

    /**
     * Looks for start of identifier
     * @param {number} ch
     * @returns {boolean}
     */
    static isIdentifierStart(ch: number): boolean {
        return (ch >= 65 && ch <= 90) || // A...Z
            (ch >= 97 && ch <= 122) || // a...z
            (ch >= 128 && !Jsep.binary_ops[String.fromCharCode(ch)]) || // any non-ASCII that is not an operator
            (Jsep.additional_identifier_chars.has(String.fromCharCode(ch))); // additional characters
    }

    /**
     * @param {number} ch
     * @returns {boolean}
     */
    static isIdentifierPart(ch: number): boolean {
        return Jsep.isIdentifierStart(ch) || Jsep.isDecimalDigit(ch);
    }

    /**
     * throw error at index of the expression
     * @param {string} message
     * @throws
     */
    throwError(message: string): void {
        throw {
            ...new Error(message + " at character " + this.index),
            index: this.index,
            description: message
        };
    }

    /**
     * Push `index` up to the next non-space character
     */
    gobbleSpaces(): void {
        let ch = this.code;
        // Whitespace
        while (ch === Jsep.SPACE_CODE
        || ch === Jsep.TAB_CODE
        || ch === Jsep.LF_CODE
        || ch === Jsep.CR_CODE) {
            ch = this.expr.charCodeAt(++this.index);
        }
    }

    /**
     * Top-level method to parse all expressions and returns compound or single node
     * @returns {jsep.Expression}
     */
    parse(): jsep.Expression {
        const nodes = this.gobbleExpressions(-1);

        // If there's only one expression just try returning the expression
        const node = nodes.length === 1
            ? nodes[0]
            : {
                type: Jsep.COMPOUND,
                body: nodes
            } as jsep.Expression;
        return node;
    }

    /**
     * top-level parser (but can be reused within as well)
     * @param {number} [untilICode]
     * @returns {jsep.Expression[]}
     */
    gobbleExpressions(untilICode: number): jsep.Expression[] {
        const nodes: jsep.Expression[] = [];
        let ch_i: number;
        let node: jsep.Expression;

        while (this.index < this.expr.length) {
            ch_i = this.code;

            // Expressions can be separated by semicolons, commas, or just inferred without any
            // separators
            if (ch_i === Jsep.SEMCOL_CODE || ch_i === Jsep.COMMA_CODE) {
                this.index++; // ignore separators
            } else {
                // Try to gobble each expression individually
                const gobbled = node = this.gobbleExpression();
                if (gobbled) {
                    nodes.push(node);
                    // If we weren't able to find a binary expression and are out of room, then
                    // the expression passed in probably has too much
                } else if (this.index < this.expr.length) {
                    if (ch_i === untilICode) {
                        break;
                    }
                    this.throwError("Unexpected \"" + this.char + "\"");
                }
            }
        }

        return nodes;
    }

    /**
     * The main parsing function.
     * @returns {?jsep.Expression}
     */
    gobbleExpression(): jsep.Expression {
        const node = this.gobbleBinaryExpression();
        this.gobbleSpaces();
        if (!node) {
            throw new Error("Expecteed expression");
        }
        return gobbleTernary.bind(this)({node: node, context: this});
    }

    /**
     * Search for the operation portion of the string (e.g. `+`, `===`)
     * Start by taking the longest possible binary operations (3 characters: `===`, `!==`, `>>>`)
     * and move down from 3 to 2 to 1 character until a matching binary operation is found
     * then, return that binary operation
     * @returns {string|boolean}
     */
    gobbleBinaryOp(): string | false {
        this.gobbleSpaces();
        let to_check = this.expr.substr(this.index, Jsep.max_binop_len);
        let tc_len = to_check.length;

        while (tc_len > 0) {
            // Don't accept a binary op when it is an identifier.
            // Binary ops that start with a identifier-valid character must be followed
            // by a non identifier-part valid character
            if (to_check in Jsep.binary_ops && (
                !Jsep.isIdentifierStart(this.code) ||
                (this.index + to_check.length < this.expr.length && !Jsep.isIdentifierPart(this.expr.charCodeAt(this.index + to_check.length)))
            )) {
                this.index += tc_len;
                return to_check;
            }
            to_check = to_check.substr(0, --tc_len);
        }
        return false;
    }

    /**
     * This function is responsible for gobbling an individual expression,
     * e.g. `1`, `1+2`, `a+(b*2)-Math.sqrt(2)`
     * @returns {?jsep.BinaryExpression}
     */
    gobbleBinaryExpression(): jsep.Expression | false {
        let node: jsep.Expression, biop: string, prec, biop_info, left, right, i, cur_biop;

        // First, try to get the leftmost thing
        // Then, check to see if there's a binary operator operating on that leftmost thing
        left = this.gobbleToken();
        let biopStart = this.gobbleBinaryOp();

        // If there wasn't a binary operator, just return the leftmost node
        if (!biopStart) {
            return left;
        }
        biop = biopStart;

        // Otherwise, we need to start a stack to properly place the binary operations in their
        // precedence structure
        biop_info = {value: biop, prec: Jsep.binaryPrecedence(biop)};

        right = this.gobbleToken();

        if (!right) {
            this.throwError("Expected expression after " + biop);
        }
        if (!left) {
            this.throwError("Expected expression before " + biop);
        }

        type BiOp = { value: string, prec: number };

        const stack: (BiOp | jsep.Expression)[] = [left as jsep.Expression, biop_info, right as jsep.Expression];

        // Properly deal with precedence using [recursive descent](http://www.engr.mun.ca/~theo/Misc/exp_parsing.htm)
        while ((biopStart = this.gobbleBinaryOp())) {
            biop = biopStart;
            prec = Jsep.binaryPrecedence(biop);

            if (prec === 0) {
                this.index -= biop.length;
                break;
            }

            biop_info = {value: biop, prec};

            cur_biop = biop;

            // Reduce: make a binary expression from the three topmost entries.
            while ((stack.length > 2) && (prec <= (stack[stack.length - 2] as BiOp).prec)) {
                right = stack.pop();
                biop = (stack.pop() as BiOp)?.value;
                left = stack.pop();
                node = {
                    type: "BinaryExpression",
                    operator: biop,
                    left,
                    right
                } as jsep.BinaryExpression;
                stack.push(node);
            }

            node = this.gobbleToken() as jsep.Expression;

            if (!node) {
                this.throwError("Expected expression after " + cur_biop);
            }

            stack.push(biop_info, node);
        }

        i = stack.length - 1;
        node = stack[i] as jsep.Expression;

        while (i > 1) {
            node = {
                type: Jsep.BINARY_EXP,
                operator: (stack[i - 1] as BiOp).value,
                left: stack[i - 2],
                right: node
            } as jsep.BinaryExpression;
            i -= 2;
        }

        return node;
    }

    /**
     * An individual part of a binary expression:
     * e.g. `foo.bar(baz)`, `1`, `"abc"`, `(a % 2)` (because it's in parenthesis)
     * @returns {boolean|jsep.Expression}
     */
    gobbleToken(): false | jsep.Expression {
        let ch, to_check, tc_len, node;

        this.gobbleSpaces();

        ch = this.code;

        if (Jsep.isDecimalDigit(ch) || ch === Jsep.PERIOD_CODE) {
            // Char code 46 is a dot `.` which can start off a numeric literal
            return this.gobbleNumericLiteral();
        }

        if (ch === Jsep.SQUOTE_CODE || ch === Jsep.DQUOTE_CODE) {
            // Single or double quotes
            node = this.gobbleStringLiteral();
        } else if (ch === Jsep.OBRACK_CODE) {
            node = this.gobbleArray();
        } else {
            to_check = this.expr.substr(this.index, Jsep.max_unop_len);
            tc_len = to_check.length;

            while (tc_len > 0) {
                // Don't accept an unary op when it is an identifier.
                // Unary ops that start with a identifier-valid character must be followed
                // by a non identifier-part valid character
                if (to_check in Jsep.unary_ops && (
                    !Jsep.isIdentifierStart(this.code) ||
                    (this.index + to_check.length < this.expr.length && !Jsep.isIdentifierPart(this.expr.charCodeAt(this.index + to_check.length)))
                )) {
                    this.index += tc_len;
                    return {
                        type: Jsep.UNARY_EXP,
                        operator: to_check,
                        argument: this.gobbleToken(),
                        prefix: true} as jsep.UnaryExpression;
                }

                to_check = to_check.substr(0, --tc_len);
            }

            if (Jsep.isIdentifierStart(ch)) {
                node = this.gobbleIdentifier();
            } else if (ch === Jsep.OPAREN_CODE) { // open parenthesis
                node = this.gobbleGroup();
            }
        }

        this.gobbleSpaces();

        ch = this.code;

        // Gobble properties of of identifiers/strings/arrays/groups.
        // e.g. `foo`, `bar.baz`, `foo['bar'].baz`
        // It also gobbles function calls:
        // e.g. `Math.acos(obj.angle)`

        while (ch === Jsep.PERIOD_CODE || ch === Jsep.OBRACK_CODE || ch === Jsep.OPAREN_CODE) {
            this.index++;

            if (ch === Jsep.PERIOD_CODE) {
                this.gobbleSpaces();
                node = {
                    type: Jsep.MEMBER_EXP,
                    computed: false,
                    object: node,
                    property: this.gobbleIdentifier()
                };
            } else if (ch === Jsep.OBRACK_CODE) {
                node = {
                    type: Jsep.MEMBER_EXP,
                    computed: true,
                    object: node,
                    property: this.gobbleExpression()
                };
                this.gobbleSpaces();
                ch = this.code;
                if (ch !== Jsep.CBRACK_CODE) {
                    this.throwError("Unclosed [");
                }
                this.index++;
            } else if (ch === Jsep.OPAREN_CODE) {
                // A function call is being made; gobble all the arguments
                node = {
                    type: Jsep.CALL_EXP,
                    "arguments": this.gobbleArguments(Jsep.CPAREN_CODE),
                    callee: node
                };
            }
            this.gobbleSpaces();
            ch = this.code;
        }

        return node as jsep.Expression;
    }

    /**
     * Parse simple numeric literals: `12`, `3.4`, `.5`. Do this by using a string to
     * keep track of everything in the numeric literal and then calling `parseFloat` on that string
     * @returns {jsep.Literal}
     */
    gobbleNumericLiteral() : jsep.Literal {
        let number = "", ch;

        while (Jsep.isDecimalDigit(this.code)) {
            number += this.expr.charAt(this.index++);
        }

        if (this.code === Jsep.PERIOD_CODE) { // can start with a decimal marker
            number += this.expr.charAt(this.index++);

            while (Jsep.isDecimalDigit(this.code)) {
                number += this.expr.charAt(this.index++);
            }
        }

        ch = this.char;

        if (ch === "e" || ch === "E") { // exponent marker
            number += this.expr.charAt(this.index++);
            ch = this.char;

            if (ch === "+" || ch === "-") { // exponent sign
                number += this.expr.charAt(this.index++);
            }

            while (Jsep.isDecimalDigit(this.code)) { // exponent itself
                number += this.expr.charAt(this.index++);
            }

            if (!Jsep.isDecimalDigit(this.expr.charCodeAt(this.index - 1))) {
                this.throwError("Expected exponent (" + number + this.char + ")");
            }
        }

        const chCode = this.code;

        // Check to make sure this isn't a variable name that start with a number (123abc)
        if (Jsep.isIdentifierStart(chCode)) {
            this.throwError("Variable names cannot start with a number (" +
                number + this.char + ")");
        } else if (chCode === Jsep.PERIOD_CODE) {
            this.throwError("Unexpected period");
        }

        return {
            type: Jsep.LITERAL,
            value: parseFloat(number),
            raw: number
        } as jsep.Literal;
    }

    /**
     * Parses a string literal, staring with single or double quotes with basic support for escape codes
     * e.g. `"hello world"`, `'this is\nJSEP'`
     * @returns {jsep.Literal}
     */
    gobbleStringLiteral(): jsep.Literal {
        let str = "";
        const quote = this.expr.charAt(this.index++);
        let closed = false;

        while (this.index < this.expr.length) {
            let ch = this.expr.charAt(this.index++);

            if (ch === quote) {
                closed = true;
                break;
            } else if (ch === "\\") {
                // Check for all of the common escape codes
                ch = this.expr.charAt(this.index++);

                switch (ch) {
                case "n":
                    str += "\n";
                    break;
                case "r":
                    str += "\r";
                    break;
                case "t":
                    str += "\t";
                    break;
                case "b":
                    str += "\b";
                    break;
                case "f":
                    str += "\f";
                    break;
                case "v":
                    str += "\x0B";
                    break;
                default :
                    str += ch;
                }
            } else {
                str += ch;
            }
        }

        if (!closed) {
            this.throwError("Unclosed quote after \"" + str + "\"");
        }

        return {
            type: Jsep.LITERAL,
            value: str,
            raw: quote + str + quote
        } as jsep.Literal;
    }

    /**
     * Gobbles only identifiers
     * e.g.: `foo`, `_value`, `$x1`
     * Also, this function checks if that identifier is a literal:
     * (e.g. `true`, `false`, `null`) or `this`
     * @returns {jsep.Expression}
     */
    gobbleIdentifier(): jsep.Expression {
        let ch = this.code;
        const start = this.index;

        if (Jsep.isIdentifierStart(ch)) {
            this.index++;
        } else {
            this.throwError("Unexpected " + this.char);
        }

        while (this.index < this.expr.length) {
            ch = this.code;

            if (Jsep.isIdentifierPart(ch)) {
                this.index++;
            } else {
                break;
            }
        }
        const identifier = this.expr.slice(start, this.index);

        if (identifier in Jsep.literals) {
            return {
                type: Jsep.LITERAL,
                value: Jsep.literals[identifier],
                raw: identifier
            } as jsep.Expression;
        } else if (identifier === Jsep.this_str) {
            return {type: Jsep.THIS_EXP} as jsep.Expression;
        } else {
            return {
                type: Jsep.IDENTIFIER,
                name: identifier
            } as jsep.Expression;
        }
    }

    /**
     * Gobbles a list of arguments within the context of a function call
     * or array literal. This function also assumes that the opening character
     * `(` or `[` has already been gobbled, and gobbles expressions and commas
     * until the terminator character `)` or `]` is encountered.
     * e.g. `foo(bar, baz)`, `my_func()`, or `[bar, baz]`
     * @param {string} termination
     * @returns {jsep.Expression[]}
     */
    gobbleArguments(termination: any): (jsep.Expression | null)[] { // eslint-disable-line
        const args = [];
        let closed = false;
        let separator_count = 0;

        while (this.index < this.expr.length) {
            this.gobbleSpaces();
            const ch_i = this.code;

            if (ch_i === termination) { // done parsing
                closed = true;
                this.index++;

                if (termination === Jsep.CPAREN_CODE && separator_count && separator_count >= args.length) {
                    this.throwError("Unexpected token " + String.fromCharCode(termination));
                }

                break;
            } else if (ch_i === Jsep.COMMA_CODE) { // between expressions
                this.index++;
                separator_count++;

                if (separator_count !== args.length) { // missing argument
                    if (termination === Jsep.CPAREN_CODE) {
                        this.throwError("Unexpected token ,");
                    } else if (termination === Jsep.CBRACK_CODE) {
                        for (let arg = args.length; arg < separator_count; arg++) {
                            args.push(null);
                        }
                    }
                }
            } else {
                const node = this.gobbleExpression();

                if (!node || node.type === Jsep.COMPOUND) {
                    this.throwError("Expected comma");
                }

                args.push(node);
            }
        }

        if (!closed) {
            this.throwError("Expected " + String.fromCharCode(termination));
        }

        return args;
    }

    /**
     * Responsible for parsing a group of things within parentheses `()`
     * that have no identifier in front (so not a function call)
     * This function assumes that it needs to gobble the opening parenthesis
     * and then tries to gobble everything within that parenthesis, assuming
     * that the next thing it should see is the close parenthesis. If not,
     * then the expression probably doesn't have a `)`
     * @returns {boolean|jsep.Expression}
     */
    gobbleGroup(): jsep.Expression {
        this.index++;
        const args = this.gobbleArguments(Jsep.CPAREN_CODE);
        if (args.length === 1) {
            return args[0] === null ? {
                type: "Compound",
                body: []
            } as jsep.Compound : args[0];
        } else {
            return {
                type: "Compound",
                body: args
            } as jsep.Compound;
        }
    }

    /**
     * Responsible for parsing Array literals `[1, 2, 3]`
     * This function assumes that it needs to gobble the opening bracket
     * and then tries to gobble the expressions as arguments.
     * @returns {jsep.ArrayExpression}
     */
    gobbleArray(): jsep.ArrayExpression {
        this.index++;

        return {
            type: Jsep.ARRAY_EXP,
            elements: this.gobbleArguments(Jsep.CBRACK_CODE)
        } as jsep.ArrayExpression;
    }

    // Node Types
    // ----------
    // This is the full set of types that any JSEP node can be.
    // Store them here to save space when minified
    static COMPOUND = "Compound";
    static SEQUENCE_EXP = "SequenceExpression";
    static IDENTIFIER = "Identifier";
    static MEMBER_EXP = "MemberExpression";
    static LITERAL = "Literal";
    static THIS_EXP = "ThisExpression";
    static CALL_EXP = "CallExpression";
    static UNARY_EXP = "UnaryExpression";
    static BINARY_EXP = "BinaryExpression";
    static CONDITIONAL_EXP = "ConditionalExpression";
    static ARRAY_EXP = "ArrayExpression";

    static TAB_CODE = 9;
    static LF_CODE = 10;
    static CR_CODE = 13;
    static SPACE_CODE = 32;
    static PERIOD_CODE = 46; // '.'
    static COMMA_CODE = 44; // ','
    static SQUOTE_CODE = 39; // single quote
    static DQUOTE_CODE = 34; // double quotes
    static OPAREN_CODE = 40; // (
    static CPAREN_CODE = 41; // )
    static OBRACK_CODE = 91; // [
    static CBRACK_CODE = 93; // ]
    static QUMARK_CODE = 63; // ?
    static SEMCOL_CODE = 59; // ;
    static COLON_CODE = 58; // :


    // Operations
    // ----------
    // Use a quickly-accessible map to store all of the unary operators
    // Values are set to `1` (it really doesn't matter)
    static unary_ops: Record<string, number> = {
        "-": 1,
        "!": 1,
        "~": 1,
        "+": 1
    };

    // Also use a map for the binary operations but set their values to their
    // binary precedence for quick reference:
    // see [Order of operations](http://en.wikipedia.org/wiki/Order_of_operations#Programming_language)
    static binary_ops: Record<string, number> = {
        "||": 1, "&&": 2, "|": 3, "^": 4, "&": 5,
        "==": 6, "!=": 6, "===": 6, "!==": 6,
        "<": 7, ">": 7, "<=": 7, ">=": 7,
        "<<": 8, ">>": 8, ">>>": 8,
        "+": 9, "-": 9,
        "*": 10, "/": 10, "%": 10
    };

    // Additional valid identifier chars, apart from a-z, A-Z and 0-9 (except on the starting char)
    static additional_identifier_chars = new Set(["$", "_"]);

    // Literals
    // ----------
    // Store the values to return for the various literals we may encounter
    static literals: Record<string, boolean | null> = {
        "true": true,
        "false": false,
        "null": null
    };

    // Except for `this`, which is special. This could be changed to something like `'self'` as well
    static this_str = "this";

    static max_unop_len = Jsep.getMaxKeyLen(Jsep.unary_ops);
    static max_binop_len = Jsep.getMaxKeyLen(Jsep.binary_ops);
}

function gobbleTernary(this: Jsep, env: { context: Jsep, node: jsep.Expression }): jsep.Expression {
    if (this.code === Jsep.QUMARK_CODE) {
        this.index++;
        const test = env.node;
        const consequent = this.gobbleExpression();

        if (!consequent) {
            this.throwError("Expected expression");
        }

        this.gobbleSpaces();

        if (this.code === Jsep.COLON_CODE) {
            this.index++;
            const alternate = this.gobbleExpression();

            if (!alternate) {
                this.throwError("Expected expression");
            }
            return {
                type: "ConditionalExpression",
                test,
                consequent,
                alternate,
            } as jsep.ConditionalExpression;
        } else {
            this.throwError("Expected :");
        }
    }
    return env.node;
}

export default jsep;
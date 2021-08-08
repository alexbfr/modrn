declare namespace jsep {
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
    type ExpressionType = "Compound" | "Identifier" | "MemberExpression" | "Literal" | "ThisExpression" | "CallExpression" | "UnaryExpression" | "BinaryExpression" | "LogicalExpression" | "ConditionalExpression" | "ArrayExpression";
    export {};
}
export declare class Jsep {
    private expr;
    index: number;
    /**
     * @returns {string}
     */
    static get version(): string;
    /**
     * @returns {string}
     */
    static toString(): string;
    /**
     * @method addUnaryOp
     * @param {string} op_name The name of the unary op to add
     * @returns {Jsep}
     */
    static addUnaryOp(op_name: string): typeof Jsep;
    /**
     * @method jsep.addBinaryOp
     * @param {string} op_name The name of the binary op to add
     * @param {number} precedence The precedence of the binary op (can be a float)
     * @returns {Jsep}
     */
    static addBinaryOp(op_name: string, precedence: number): typeof Jsep;
    /**
     * @method addIdentifierChar
     * @param {string} char The additional character to treat as a valid part of an identifier
     * @returns {Jsep}
     */
    static addIdentifierChar(char: string): typeof Jsep;
    /**
     * @method addLiteral
     * @param {string} literal_name The name of the literal to add
     * @param {*} literal_value The value of the literal
     * @returns {Jsep}
     */
    static addLiteral(literal_name: string, literal_value: any): typeof Jsep;
    /**
     * @method removeUnaryOp
     * @param {string} op_name The name of the unary op to remove
     * @returns {Jsep}
     */
    static removeUnaryOp(op_name: string): typeof Jsep;
    /**
     * @method removeAllUnaryOps
     * @returns {Jsep}
     */
    static removeAllUnaryOps(): typeof Jsep;
    /**
     * @method removeIdentifierChar
     * @param {string} char The additional character to stop treating as a valid part of an identifier
     * @returns {Jsep}
     */
    static removeIdentifierChar(char: string): typeof Jsep;
    /**
     * @method removeBinaryOp
     * @param {string} op_name The name of the binary op to remove
     * @returns {Jsep}
     */
    static removeBinaryOp(op_name: string): typeof Jsep;
    /**
     * @method removeAllBinaryOps
     * @returns {Jsep}
     */
    static removeAllBinaryOps(): typeof Jsep;
    /**
     * @method removeLiteral
     * @param {string} literal_name The name of the literal to remove
     * @returns {Jsep}
     */
    static removeLiteral(literal_name: string): typeof Jsep;
    /**
     * @method removeAllLiterals
     * @returns {Jsep}
     */
    static removeAllLiterals(): typeof Jsep;
    /**
     * @returns {string}
     */
    get char(): string;
    /**
     * @returns {number}
     */
    get code(): number;
    /**
     * @param {string} expr a string with the passed in express
     * @returns Jsep
     */
    constructor(expr: string);
    /**
     * static top-level parser
     * @returns {jsep.Expression}
     */
    static parse(expr: string): jsep.Expression;
    /**
     * Get the longest key length of any object
     * @param {object} obj
     * @returns {number}
     */
    static getMaxKeyLen<T>(obj: T): number;
    /**
     * `ch` is a character code in the next three functions
     * @param {number} ch
     * @returns {boolean}
     */
    static isDecimalDigit(ch: number): boolean;
    /**
     * Returns the precedence of a binary operator or `0` if it isn't a binary operator. Can be float.
     * @param {string} op_val
     * @returns {number}
     */
    static binaryPrecedence(op_val: string): number;
    /**
     * Looks for start of identifier
     * @param {number} ch
     * @returns {boolean}
     */
    static isIdentifierStart(ch: number): boolean;
    /**
     * @param {number} ch
     * @returns {boolean}
     */
    static isIdentifierPart(ch: number): boolean;
    /**
     * throw error at index of the expression
     * @param {string} message
     * @throws
     */
    throwError(message: string): void;
    /**
     * Push `index` up to the next non-space character
     */
    gobbleSpaces(): void;
    /**
     * Top-level method to parse all expressions and returns compound or single node
     * @returns {jsep.Expression}
     */
    parse(): jsep.Expression;
    /**
     * top-level parser (but can be reused within as well)
     * @param {number} [untilICode]
     * @returns {jsep.Expression[]}
     */
    gobbleExpressions(untilICode: number): jsep.Expression[];
    /**
     * The main parsing function.
     * @returns {?jsep.Expression}
     */
    gobbleExpression(): jsep.Expression;
    /**
     * Search for the operation portion of the string (e.g. `+`, `===`)
     * Start by taking the longest possible binary operations (3 characters: `===`, `!==`, `>>>`)
     * and move down from 3 to 2 to 1 character until a matching binary operation is found
     * then, return that binary operation
     * @returns {string|boolean}
     */
    gobbleBinaryOp(): string | false;
    /**
     * This function is responsible for gobbling an individual expression,
     * e.g. `1`, `1+2`, `a+(b*2)-Math.sqrt(2)`
     * @returns {?jsep.BinaryExpression}
     */
    gobbleBinaryExpression(): jsep.Expression | false;
    /**
     * An individual part of a binary expression:
     * e.g. `foo.bar(baz)`, `1`, `"abc"`, `(a % 2)` (because it's in parenthesis)
     * @returns {boolean|jsep.Expression}
     */
    gobbleToken(): false | jsep.Expression;
    /**
     * Parse simple numeric literals: `12`, `3.4`, `.5`. Do this by using a string to
     * keep track of everything in the numeric literal and then calling `parseFloat` on that string
     * @returns {jsep.Literal}
     */
    gobbleNumericLiteral(): jsep.Literal;
    /**
     * Parses a string literal, staring with single or double quotes with basic support for escape codes
     * e.g. `"hello world"`, `'this is\nJSEP'`
     * @returns {jsep.Literal}
     */
    gobbleStringLiteral(): jsep.Literal;
    /**
     * Gobbles only identifiers
     * e.g.: `foo`, `_value`, `$x1`
     * Also, this function checks if that identifier is a literal:
     * (e.g. `true`, `false`, `null`) or `this`
     * @returns {jsep.Expression}
     */
    gobbleIdentifier(): jsep.Expression;
    /**
     * Gobbles a list of arguments within the context of a function call
     * or array literal. This function also assumes that the opening character
     * `(` or `[` has already been gobbled, and gobbles expressions and commas
     * until the terminator character `)` or `]` is encountered.
     * e.g. `foo(bar, baz)`, `my_func()`, or `[bar, baz]`
     * @param {string} termination
     * @returns {jsep.Expression[]}
     */
    gobbleArguments(termination: any): (jsep.Expression | null)[];
    /**
     * Responsible for parsing a group of things within parentheses `()`
     * that have no identifier in front (so not a function call)
     * This function assumes that it needs to gobble the opening parenthesis
     * and then tries to gobble everything within that parenthesis, assuming
     * that the next thing it should see is the close parenthesis. If not,
     * then the expression probably doesn't have a `)`
     * @returns {boolean|jsep.Expression}
     */
    gobbleGroup(): jsep.Expression;
    /**
     * Responsible for parsing Array literals `[1, 2, 3]`
     * This function assumes that it needs to gobble the opening bracket
     * and then tries to gobble the expressions as arguments.
     * @returns {jsep.ArrayExpression}
     */
    gobbleArray(): jsep.ArrayExpression;
    static COMPOUND: string;
    static SEQUENCE_EXP: string;
    static IDENTIFIER: string;
    static MEMBER_EXP: string;
    static LITERAL: string;
    static THIS_EXP: string;
    static CALL_EXP: string;
    static UNARY_EXP: string;
    static BINARY_EXP: string;
    static CONDITIONAL_EXP: string;
    static ARRAY_EXP: string;
    static TAB_CODE: number;
    static LF_CODE: number;
    static CR_CODE: number;
    static SPACE_CODE: number;
    static PERIOD_CODE: number;
    static COMMA_CODE: number;
    static SQUOTE_CODE: number;
    static DQUOTE_CODE: number;
    static OPAREN_CODE: number;
    static CPAREN_CODE: number;
    static OBRACK_CODE: number;
    static CBRACK_CODE: number;
    static QUMARK_CODE: number;
    static SEMCOL_CODE: number;
    static COLON_CODE: number;
    static unary_ops: Record<string, number>;
    static binary_ops: Record<string, number>;
    static additional_identifier_chars: Set<string>;
    static literals: Record<string, boolean | null>;
    static this_str: string;
    static max_unop_len: number;
    static max_binop_len: number;
}
export default jsep;

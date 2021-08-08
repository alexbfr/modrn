/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
function isUpper(c) {
    return c >= "A" && c <= "Z";
}
function tagify(name) {
    let lower = false;
    let result = "";
    for (let idx = 0; idx < name.length; idx++) {
        const c = name.charAt(idx);
        const p = idx > 0 ? name.charAt(idx - 1) : "";
        if (isUpper(c) && (lower && !isUpper(p))) {
            result += "-";
            lower = false;
        }
        else {
            lower = true;
        }
        result += c.toLowerCase();
    }
    return result;
}
function unTagify(name, startLower) {
    let lower = startLower;
    let result = "";
    for (let idx = 0; idx < name.length; idx++) {
        const c = name.charAt(idx);
        if (c === "-") {
            lower = false;
            continue;
        }
        if (!lower) {
            result += c.toUpperCase();
            lower = true;
        }
        else {
            result += c.toLowerCase();
        }
    }
    return result;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
function logDiagnostic(...rest) {
    //console.log(...rest);
}
function logWarn(...rest) {
    console.warn(...rest);
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Checks if the provided tagName (html-named) is already registered
 * @param tagName
 */
function isRegisteredTagName(tagName) {
    const componentName = tagName.toLowerCase();
    return componentName in componentRegistry;
}
/**
 * Returns a copy of the component registry
 */
function getComponentRegistry() {
    return Object.assign({}, componentRegistry);
}
const componentByRegisteredComponent = new WeakMap();
const componentRegistry = {};
const componentsToRegister = [];
/**
 * Adds a component to the global registry without directly registering it as custom element.
 * @param componentName the js-name of the new component (i.e. without dashes)
 * @param component the component to register
 */
function addToComponentRegistry(componentName, component) {
    const tagName = tagify(componentName).toLowerCase();
    const componentInfo = {
        isSpecialAttribute: false,
        tagName,
        componentName,
        registeredComponent: component,
        content: null
    };
    componentsToRegister.push(componentInfo);
    componentRegistry[tagName] = componentInfo;
    componentByRegisteredComponent.set(component, componentInfo);
    return componentInfo;
}
function getAndResetComponentsToRegister() {
    const componentsToRegisterCopy = [...componentsToRegister];
    componentsToRegister.splice(0, componentsToRegisterCopy.length);
    return componentsToRegisterCopy;
}
/**
 * Returns the component info for a certain registered component
 * @param registeredComponent
 */
function getComponentInfoOf(registeredComponent) {
    return componentByRegisteredComponent.get(registeredComponent);
}

class ModrnHTMLElement extends HTMLElement {
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
let alreadyRequested = new WeakSet();
const renderQueue = [];
let frameRequestCallback;
function getAndResetRenderQueue() {
    const renderQueueCopy = [...renderQueue];
    alreadyRequested = new WeakSet();
    renderQueue.splice(0, renderQueueCopy.length);
    return renderQueueCopy;
}
function requestRender(selfProvided) {
    const self = (typeof selfProvided === "string") ? document.getElementById(selfProvided) : selfProvided;
    if (!self.componentInfo) {
        throw new Error(`${selfProvided} could not be resolved to a ModrnHTMLElement`);
    }
    if (alreadyRequested.has(self)) {
        return;
    }
    alreadyRequested.add(self);
    renderQueue.push({ element: new WeakRef(self) });
    requestUpdate();
}
function getRenderQueueLength() {
    return renderQueue.length;
}
let testingModeActive = false;
let requestedFrameUpdateNumber = null;
function isTestingModeActive() {
    return testingModeActive;
}
function setTestingModeActive() {
    testingModeActive = true;
}
function requestUpdate() {
    if (!isTestingModeActive() && !requestedFrameUpdateNumber && frameRequestCallback) {
        requestedFrameUpdateNumber = requestAnimationFrame(frameRequestCallback);
    }
}
function cancelUpdate() {
    if (requestedFrameUpdateNumber !== null) {
        cancelAnimationFrame(requestedFrameUpdateNumber);
        requestedFrameUpdateNumber = null;
    }
}
function setFrameRequestCallback(_frameRequestCallback) {
    frameRequestCallback = _frameRequestCallback;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Adds a module to the global registry by adding each individual registered component.
 *
 * @param module
 */
function registerModule(module) {
    Object.entries(module).forEach(([componentName, component]) => {
        addToComponentRegistry(componentName, component);
    });
}
/**
 * Updates the component registry with the static initialization result of the component (js-named, i.e.
 * without dashes)
 * @param componentName
 * @param content
 */
function setStaticInitializationResultForComponent(componentName, content) {
    getComponentRegistry()[tagify(componentName).toLowerCase()].content = content;
}
/**
 * Registers the component and creates a custom element for it.
 * @param componentInfo - the component
 * @param hasConnectedFn - the connected callback function (called when mounted)
 * @param notifyChildrenChangedFn - the (custom) callback function when dynamic children change
 * @param disconnectedFn - the disconnected callback function (called when unmounted)
 */
function register(componentInfo, hasConnectedFn, notifyChildrenChangedFn, disconnectedFn) {
    var _a;
    const tagName = componentInfo.tagName;
    if (((_a = getComponentRegistry()[tagName]) === null || _a === void 0 ? void 0 : _a.registeredComponent) === componentInfo.registeredComponent && componentInfo.registeredComponent.customElementConstructor) {
        return componentInfo.registeredComponent.customElementConstructor;
    }
    const customElementConstructor = class extends ModrnHTMLElement {
        constructor() {
            super();
            this.componentInfo = componentInfo;
        }
        connectedCallback() {
            if (this.isConnected) {
                hasConnectedFn(this, componentInfo);
            }
        }
        disconnectedCallback() {
            disconnectedFn(this, componentInfo);
        }
        notifyChildrenChanged(childFragment) {
            notifyChildrenChangedFn(this, componentInfo, childFragment);
        }
        update() {
            requestRender(this);
        }
        copyTo(other) {
            other.initialPreviousChild = this.initialPreviousChild;
            other.initialCustomProps = this.initialCustomProps;
            other.componentInfo = this.componentInfo;
            other.state = this.state ? Object.assign({}, this.state) : undefined;
        }
        static get observedAttributes() {
            return Object.keys(componentInfo.registeredComponent.propTemplate || {});
        }
    };
    try {
        customElements.define(tagName, customElementConstructor);
    }
    catch (e) {
        logWarn(`Couldn't register ${tagName}`, e);
    }
    componentInfo.registeredComponent.customElementConstructor = customElementConstructor;
    return customElementConstructor;
}
/**
 * Register all components in the component registry at once.
 * @see register
 *
 * @param hasConnectedFn
 * @param notifyChildrenChangedFn
 * @param disconnectedFn
 */
function registerAll(hasConnectedFn, notifyChildrenChangedFn, disconnectedFn) {
    getAndResetComponentsToRegister().forEach(componentInfo => {
        register(componentInfo, hasConnectedFn, notifyChildrenChangedFn, disconnectedFn);
    });
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const expressionPattern = new RegExp("{{.+?}}");
const variableNamePattern = new RegExp("{{\\s*?[^\\d][\\w\\d_-]+\\s*?}}");

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Splits the text content of the provided element around variable references like {{x}}
 * It does this by cutting off text before and/or after a variable reference and puts the variable reference
 * in its own text node.
 *
 * The text node is later upgraded to a element, if required {@see substituteVariables}
 *
 * @param rootElement
 */
function splitTextContentAtVariables(rootElement) {
    var _a, _b;
    let childCount = rootElement.childNodes.length;
    let previousWasSplit = false;
    for (let idx = 0; idx < childCount; ++idx) {
        const child = rootElement.childNodes.item(idx);
        let startIndex;
        const textContent = previousWasSplit ? (_a = child.textContent) === null || _a === void 0 ? void 0 : _a.trimRight() : (_b = child.textContent) === null || _b === void 0 ? void 0 : _b.trim();
        previousWasSplit = false;
        if (child.nodeType === TEXT_NODE && textContent && (startIndex = textContent.indexOf("{{")) >= 0) {
            previousWasSplit = true;
            const endIndex = textContent.indexOf("}}", startIndex + 2);
            if (startIndex === 0 && endIndex === textContent.length - 2) {
                child.textContent = textContent;
                continue;
            }
            if (endIndex >= 0) {
                const remainderBefore = textContent.substring(0, startIndex);
                const value = textContent.substring(startIndex, endIndex + 2);
                if (!expressionPattern.test(value)) {
                    continue;
                }
                const remainderAfter = textContent.substring(endIndex + 2);
                if (remainderBefore.length > 0) {
                    const nextNode = document.createTextNode(remainderBefore);
                    rootElement.insertBefore(nextNode, child);
                    childCount++;
                    idx++;
                }
                if (remainderAfter.length > 0) {
                    const nextNode1 = document.createTextNode(remainderAfter);
                    rootElement.insertBefore(nextNode1, child.nextSibling);
                    childCount++;
                }
                child.textContent = value;
            }
        }
    }
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
class Jsep {
    /**
     * @param {string} expr a string with the passed in express
     * @returns Jsep
     */
    constructor(expr) {
        this.index = 0;
        // `index` stores the character number we are currently at
        // All of the gobbles below will modify `index` as we move along
        this.expr = expr;
        this.index = 0;
    }
    /**
     * @returns {string}
     */
    static get version() {
        // To be filled in by the template
        return "<%= version %>";
    }
    /**
     * @returns {string}
     */
    static toString() {
        return "JavaScript Expression Parser (JSEP) v" + Jsep.version;
    }
    // ==================== CONFIG ================================
    /**
     * @method addUnaryOp
     * @param {string} op_name The name of the unary op to add
     * @returns {Jsep}
     */
    static addUnaryOp(op_name) {
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
    static addBinaryOp(op_name, precedence) {
        Jsep.max_binop_len = Math.max(op_name.length, Jsep.max_binop_len);
        Jsep.binary_ops[op_name] = precedence;
        return Jsep;
    }
    /**
     * @method addIdentifierChar
     * @param {string} char The additional character to treat as a valid part of an identifier
     * @returns {Jsep}
     */
    static addIdentifierChar(char) {
        Jsep.additional_identifier_chars.add(char);
        return Jsep;
    }
    /**
     * @method addLiteral
     * @param {string} literal_name The name of the literal to add
     * @param {*} literal_value The value of the literal
     * @returns {Jsep}
     */
    static addLiteral(literal_name, literal_value) {
        Jsep.literals[literal_name] = literal_value;
        return Jsep;
    }
    /**
     * @method removeUnaryOp
     * @param {string} op_name The name of the unary op to remove
     * @returns {Jsep}
     */
    static removeUnaryOp(op_name) {
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
    static removeAllUnaryOps() {
        Jsep.unary_ops = {};
        Jsep.max_unop_len = 0;
        return Jsep;
    }
    /**
     * @method removeIdentifierChar
     * @param {string} char The additional character to stop treating as a valid part of an identifier
     * @returns {Jsep}
     */
    static removeIdentifierChar(char) {
        Jsep.additional_identifier_chars.delete(char);
        return Jsep;
    }
    /**
     * @method removeBinaryOp
     * @param {string} op_name The name of the binary op to remove
     * @returns {Jsep}
     */
    static removeBinaryOp(op_name) {
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
    static removeAllBinaryOps() {
        Jsep.binary_ops = {};
        Jsep.max_binop_len = 0;
        return Jsep;
    }
    /**
     * @method removeLiteral
     * @param {string} literal_name The name of the literal to remove
     * @returns {Jsep}
     */
    static removeLiteral(literal_name) {
        delete Jsep.literals[literal_name];
        return Jsep;
    }
    /**
     * @method removeAllLiterals
     * @returns {Jsep}
     */
    static removeAllLiterals() {
        Jsep.literals = {};
        return Jsep;
    }
    // ==================== END CONFIG ============================
    /**
     * @returns {string}
     */
    get char() {
        return this.expr.charAt(this.index);
    }
    /**
     * @returns {number}
     */
    get code() {
        return this.expr.charCodeAt(this.index);
    }
    /**
     * static top-level parser
     * @returns {jsep.Expression}
     */
    static parse(expr) {
        return (new Jsep(expr)).parse();
    }
    /**
     * Get the longest key length of any object
     * @param {object} obj
     * @returns {number}
     */
    static getMaxKeyLen(obj) {
        return Math.max(0, ...Object.keys(obj).map(k => k.length));
    }
    /**
     * `ch` is a character code in the next three functions
     * @param {number} ch
     * @returns {boolean}
     */
    static isDecimalDigit(ch) {
        return (ch >= 48 && ch <= 57); // 0...9
    }
    /**
     * Returns the precedence of a binary operator or `0` if it isn't a binary operator. Can be float.
     * @param {string} op_val
     * @returns {number}
     */
    static binaryPrecedence(op_val) {
        return Jsep.binary_ops[op_val] || 0;
    }
    /**
     * Looks for start of identifier
     * @param {number} ch
     * @returns {boolean}
     */
    static isIdentifierStart(ch) {
        return (ch >= 65 && ch <= 90) || // A...Z
            (ch >= 97 && ch <= 122) || // a...z
            (ch >= 128 && !Jsep.binary_ops[String.fromCharCode(ch)]) || // any non-ASCII that is not an operator
            (Jsep.additional_identifier_chars.has(String.fromCharCode(ch))); // additional characters
    }
    /**
     * @param {number} ch
     * @returns {boolean}
     */
    static isIdentifierPart(ch) {
        return Jsep.isIdentifierStart(ch) || Jsep.isDecimalDigit(ch);
    }
    /**
     * throw error at index of the expression
     * @param {string} message
     * @throws
     */
    throwError(message) {
        throw Object.assign(Object.assign({}, new Error(message + " at character " + this.index)), { index: this.index, description: message });
    }
    /**
     * Push `index` up to the next non-space character
     */
    gobbleSpaces() {
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
    parse() {
        const nodes = this.gobbleExpressions(-1);
        // If there's only one expression just try returning the expression
        const node = nodes.length === 1
            ? nodes[0]
            : {
                type: Jsep.COMPOUND,
                body: nodes
            };
        return node;
    }
    /**
     * top-level parser (but can be reused within as well)
     * @param {number} [untilICode]
     * @returns {jsep.Expression[]}
     */
    gobbleExpressions(untilICode) {
        const nodes = [];
        let ch_i;
        let node;
        while (this.index < this.expr.length) {
            ch_i = this.code;
            // Expressions can be separated by semicolons, commas, or just inferred without any
            // separators
            if (ch_i === Jsep.SEMCOL_CODE || ch_i === Jsep.COMMA_CODE) {
                this.index++; // ignore separators
            }
            else {
                // Try to gobble each expression individually
                const gobbled = node = this.gobbleExpression();
                if (gobbled) {
                    nodes.push(node);
                    // If we weren't able to find a binary expression and are out of room, then
                    // the expression passed in probably has too much
                }
                else if (this.index < this.expr.length) {
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
    gobbleExpression() {
        const node = this.gobbleBinaryExpression();
        this.gobbleSpaces();
        if (!node) {
            throw new Error("Expecteed expression");
        }
        return gobbleTernary.bind(this)({ node: node, context: this });
    }
    /**
     * Search for the operation portion of the string (e.g. `+`, `===`)
     * Start by taking the longest possible binary operations (3 characters: `===`, `!==`, `>>>`)
     * and move down from 3 to 2 to 1 character until a matching binary operation is found
     * then, return that binary operation
     * @returns {string|boolean}
     */
    gobbleBinaryOp() {
        this.gobbleSpaces();
        let to_check = this.expr.substr(this.index, Jsep.max_binop_len);
        let tc_len = to_check.length;
        while (tc_len > 0) {
            // Don't accept a binary op when it is an identifier.
            // Binary ops that start with a identifier-valid character must be followed
            // by a non identifier-part valid character
            if (to_check in Jsep.binary_ops && (!Jsep.isIdentifierStart(this.code) ||
                (this.index + to_check.length < this.expr.length && !Jsep.isIdentifierPart(this.expr.charCodeAt(this.index + to_check.length))))) {
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
    gobbleBinaryExpression() {
        var _a;
        let node, biop, prec, biop_info, left, right, i, cur_biop;
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
        biop_info = { value: biop, prec: Jsep.binaryPrecedence(biop) };
        right = this.gobbleToken();
        if (!right) {
            this.throwError("Expected expression after " + biop);
        }
        if (!left) {
            this.throwError("Expected expression before " + biop);
        }
        const stack = [left, biop_info, right];
        // Properly deal with precedence using [recursive descent](http://www.engr.mun.ca/~theo/Misc/exp_parsing.htm)
        while ((biopStart = this.gobbleBinaryOp())) {
            biop = biopStart;
            prec = Jsep.binaryPrecedence(biop);
            if (prec === 0) {
                this.index -= biop.length;
                break;
            }
            biop_info = { value: biop, prec };
            cur_biop = biop;
            // Reduce: make a binary expression from the three topmost entries.
            while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
                right = stack.pop();
                biop = (_a = stack.pop()) === null || _a === void 0 ? void 0 : _a.value;
                left = stack.pop();
                node = {
                    type: "BinaryExpression",
                    operator: biop,
                    left,
                    right
                };
                stack.push(node);
            }
            node = this.gobbleToken();
            if (!node) {
                this.throwError("Expected expression after " + cur_biop);
            }
            stack.push(biop_info, node);
        }
        i = stack.length - 1;
        node = stack[i];
        while (i > 1) {
            node = {
                type: Jsep.BINARY_EXP,
                operator: stack[i - 1].value,
                left: stack[i - 2],
                right: node
            };
            i -= 2;
        }
        return node;
    }
    /**
     * An individual part of a binary expression:
     * e.g. `foo.bar(baz)`, `1`, `"abc"`, `(a % 2)` (because it's in parenthesis)
     * @returns {boolean|jsep.Expression}
     */
    gobbleToken() {
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
        }
        else if (ch === Jsep.OBRACK_CODE) {
            node = this.gobbleArray();
        }
        else {
            to_check = this.expr.substr(this.index, Jsep.max_unop_len);
            tc_len = to_check.length;
            while (tc_len > 0) {
                // Don't accept an unary op when it is an identifier.
                // Unary ops that start with a identifier-valid character must be followed
                // by a non identifier-part valid character
                if (to_check in Jsep.unary_ops && (!Jsep.isIdentifierStart(this.code) ||
                    (this.index + to_check.length < this.expr.length && !Jsep.isIdentifierPart(this.expr.charCodeAt(this.index + to_check.length))))) {
                    this.index += tc_len;
                    return {
                        type: Jsep.UNARY_EXP,
                        operator: to_check,
                        argument: this.gobbleToken(),
                        prefix: true
                    };
                }
                to_check = to_check.substr(0, --tc_len);
            }
            if (Jsep.isIdentifierStart(ch)) {
                node = this.gobbleIdentifier();
            }
            else if (ch === Jsep.OPAREN_CODE) { // open parenthesis
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
            }
            else if (ch === Jsep.OBRACK_CODE) {
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
            }
            else if (ch === Jsep.OPAREN_CODE) {
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
        return node;
    }
    /**
     * Parse simple numeric literals: `12`, `3.4`, `.5`. Do this by using a string to
     * keep track of everything in the numeric literal and then calling `parseFloat` on that string
     * @returns {jsep.Literal}
     */
    gobbleNumericLiteral() {
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
        }
        else if (chCode === Jsep.PERIOD_CODE) {
            this.throwError("Unexpected period");
        }
        return {
            type: Jsep.LITERAL,
            value: parseFloat(number),
            raw: number
        };
    }
    /**
     * Parses a string literal, staring with single or double quotes with basic support for escape codes
     * e.g. `"hello world"`, `'this is\nJSEP'`
     * @returns {jsep.Literal}
     */
    gobbleStringLiteral() {
        let str = "";
        const quote = this.expr.charAt(this.index++);
        let closed = false;
        while (this.index < this.expr.length) {
            let ch = this.expr.charAt(this.index++);
            if (ch === quote) {
                closed = true;
                break;
            }
            else if (ch === "\\") {
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
                    default:
                        str += ch;
                }
            }
            else {
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
        };
    }
    /**
     * Gobbles only identifiers
     * e.g.: `foo`, `_value`, `$x1`
     * Also, this function checks if that identifier is a literal:
     * (e.g. `true`, `false`, `null`) or `this`
     * @returns {jsep.Expression}
     */
    gobbleIdentifier() {
        let ch = this.code;
        const start = this.index;
        if (Jsep.isIdentifierStart(ch)) {
            this.index++;
        }
        else {
            this.throwError("Unexpected " + this.char);
        }
        while (this.index < this.expr.length) {
            ch = this.code;
            if (Jsep.isIdentifierPart(ch)) {
                this.index++;
            }
            else {
                break;
            }
        }
        const identifier = this.expr.slice(start, this.index);
        if (identifier in Jsep.literals) {
            return {
                type: Jsep.LITERAL,
                value: Jsep.literals[identifier],
                raw: identifier
            };
        }
        else if (identifier === Jsep.this_str) {
            return { type: Jsep.THIS_EXP };
        }
        else {
            return {
                type: Jsep.IDENTIFIER,
                name: identifier
            };
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
    gobbleArguments(termination) {
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
            }
            else if (ch_i === Jsep.COMMA_CODE) { // between expressions
                this.index++;
                separator_count++;
                if (separator_count !== args.length) { // missing argument
                    if (termination === Jsep.CPAREN_CODE) {
                        this.throwError("Unexpected token ,");
                    }
                    else if (termination === Jsep.CBRACK_CODE) {
                        for (let arg = args.length; arg < separator_count; arg++) {
                            args.push(null);
                        }
                    }
                }
            }
            else {
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
    gobbleGroup() {
        this.index++;
        const args = this.gobbleArguments(Jsep.CPAREN_CODE);
        if (args.length === 1) {
            return args[0] === null ? {
                type: "Compound",
                body: []
            } : args[0];
        }
        else {
            return {
                type: "Compound",
                body: args
            };
        }
    }
    /**
     * Responsible for parsing Array literals `[1, 2, 3]`
     * This function assumes that it needs to gobble the opening bracket
     * and then tries to gobble the expressions as arguments.
     * @returns {jsep.ArrayExpression}
     */
    gobbleArray() {
        this.index++;
        return {
            type: Jsep.ARRAY_EXP,
            elements: this.gobbleArguments(Jsep.CBRACK_CODE)
        };
    }
}
// Node Types
// ----------
// This is the full set of types that any JSEP node can be.
// Store them here to save space when minified
Jsep.COMPOUND = "Compound";
Jsep.SEQUENCE_EXP = "SequenceExpression";
Jsep.IDENTIFIER = "Identifier";
Jsep.MEMBER_EXP = "MemberExpression";
Jsep.LITERAL = "Literal";
Jsep.THIS_EXP = "ThisExpression";
Jsep.CALL_EXP = "CallExpression";
Jsep.UNARY_EXP = "UnaryExpression";
Jsep.BINARY_EXP = "BinaryExpression";
Jsep.CONDITIONAL_EXP = "ConditionalExpression";
Jsep.ARRAY_EXP = "ArrayExpression";
Jsep.TAB_CODE = 9;
Jsep.LF_CODE = 10;
Jsep.CR_CODE = 13;
Jsep.SPACE_CODE = 32;
Jsep.PERIOD_CODE = 46; // '.'
Jsep.COMMA_CODE = 44; // ','
Jsep.SQUOTE_CODE = 39; // single quote
Jsep.DQUOTE_CODE = 34; // double quotes
Jsep.OPAREN_CODE = 40; // (
Jsep.CPAREN_CODE = 41; // )
Jsep.OBRACK_CODE = 91; // [
Jsep.CBRACK_CODE = 93; // ]
Jsep.QUMARK_CODE = 63; // ?
Jsep.SEMCOL_CODE = 59; // ;
Jsep.COLON_CODE = 58; // :
// Operations
// ----------
// Use a quickly-accessible map to store all of the unary operators
// Values are set to `1` (it really doesn't matter)
Jsep.unary_ops = {
    "-": 1,
    "!": 1,
    "~": 1,
    "+": 1
};
// Also use a map for the binary operations but set their values to their
// binary precedence for quick reference:
// see [Order of operations](http://en.wikipedia.org/wiki/Order_of_operations#Programming_language)
Jsep.binary_ops = {
    "||": 1, "&&": 2, "|": 3, "^": 4, "&": 5,
    "==": 6, "!=": 6, "===": 6, "!==": 6,
    "<": 7, ">": 7, "<=": 7, ">=": 7,
    "<<": 8, ">>": 8, ">>>": 8,
    "+": 9, "-": 9,
    "*": 10, "/": 10, "%": 10
};
// Additional valid identifier chars, apart from a-z, A-Z and 0-9 (except on the starting char)
Jsep.additional_identifier_chars = new Set(["$", "_"]);
// Literals
// ----------
// Store the values to return for the various literals we may encounter
Jsep.literals = {
    "true": true,
    "false": false,
    "null": null
};
// Except for `this`, which is special. This could be changed to something like `'self'` as well
Jsep.this_str = "this";
Jsep.max_unop_len = Jsep.getMaxKeyLen(Jsep.unary_ops);
Jsep.max_binop_len = Jsep.getMaxKeyLen(Jsep.binary_ops);
function gobbleTernary(env) {
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
            };
        }
        else {
            this.throwError("Expected :");
        }
    }
    return env.node;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
var ExpressionType;
(function (ExpressionType) {
    ExpressionType[ExpressionType["VariableUsage"] = 0] = "VariableUsage";
    ExpressionType[ExpressionType["ComplexExpression"] = 1] = "ComplexExpression";
    ExpressionType[ExpressionType["ConstantExpression"] = 2] = "ConstantExpression";
    ExpressionType[ExpressionType["FunctionReferenceExpression"] = 3] = "FunctionReferenceExpression";
})(ExpressionType || (ExpressionType = {}));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Evaluation code from JSEP project, under MIT License.
 * Copyright (c) 2013 Stephen Oney, http://jsep.from.so/
 */
// Default operator precedence from https://github.com/EricSmekens/jsep/blob/master/src/jsep.js#L55
const DEFAULT_PRECEDENCE = {
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
const binops = {
    "||": function (a, b) { return a || b; },
    "&&": function (a, b) { return a && b; },
    "|": function (a, b) { return a | b; },
    "^": function (a, b) { return a ^ b; },
    "&": function (a, b) { return a & b; },
    "==": function (a, b) { return a == b; },
    "!=": function (a, b) { return a != b; },
    "===": function (a, b) { return a === b; },
    "!==": function (a, b) { return a !== b; },
    "<": function (a, b) { return a < b; },
    ">": function (a, b) { return a > b; },
    "<=": function (a, b) { return a <= b; },
    ">=": function (a, b) { return a >= b; },
    "<<": function (a, b) { return a << b; },
    ">>": function (a, b) { return a >> b; },
    ">>>": function (a, b) { return a >>> b; },
    "+": function (a, b) { return a + b; },
    "-": function (a, b) { return a - b; },
    "*": function (a, b) { return a * b; },
    "/": function (a, b) { return a / b; },
    "%": function (a, b) { return a % b; }
};
const unops = {
    "-": function (a) { return -a; },
    "+": function (a) { return +a; },
    "~": function (a) { return ~a; },
    "!": function (a) { return !a; },
};
function evaluateArray(list, context) {
    return list.map(function (v) { return evaluate(v, context); });
}
function evaluateMember(node, context) {
    const object = evaluate(node.object, context);
    let key;
    if (node.computed) {
        key = evaluate(node.property, context);
    }
    else {
        key = node.property.name;
    }
    if (/^__proto__|prototype|constructor$/.test(key)) {
        throw Error(`Access to member "${key}" disallowed.`);
    }
    return [object, object[key]];
}
function evaluate(_node, context) {
    const node = _node;
    switch (node.type) {
        case "ArrayExpression":
            return evaluateArray(node.elements, context);
        case "BinaryExpression": {
            const binop = binops[node.operator];
            if (binop.lazy) {
                return binop(null, null, node.left, node.right, context);
            }
            const left = evaluate(node.left, context);
            if (node.operator === "&&" && !left) {
                return false;
            }
            return binop(evaluate(node.left, context), evaluate(node.right, context), node.left, node.right, context);
        }
        case "CallExpression":
            let caller, fn, assign;
            if (node.callee.type === "MemberExpression") {
                assign = evaluateMember(node.callee, context);
                caller = assign[0];
                fn = assign[1];
            }
            else {
                fn = evaluate(node.callee, context);
            }
            if (typeof fn !== "function") {
                return undefined;
            }
            return fn.apply(caller, evaluateArray(node.arguments, context));
        case "ConditionalExpression":
            return evaluate(node.test, context)
                ? evaluate(node.consequent, context)
                : evaluate(node.alternate, context);
        case "Identifier":
            return context[node.name];
        case "Literal":
            return node.value;
        case "LogicalExpression":
            if (node.operator === "||") {
                return evaluate(node.left, context) || evaluate(node.right, context);
            }
            else if (node.operator === "&&") {
                return evaluate(node.left, context) && evaluate(node.right, context);
            }
            return binops[node.operator](evaluate(node.left, context), evaluate(node.right, context), node.left, node.right, context);
        case "MemberExpression":
            return evaluateMember(node, context)[1];
        case "ThisExpression":
            return context;
        case "UnaryExpression":
            return unops[node.operator](evaluate(node.argument, context));
        case "Compound": {
            const compound = node;
            return compound.body.map(value => evaluate(value, context));
        }
        default:
            return undefined;
    }
}
function compile(expression) {
    return evaluate.bind(null, expression);
}
// Added functions to inject Custom Binary Operators (and override existing ones)
function addBinaryOp(operator, precedence_or_fn, _function) {
    if (_function) {
        Jsep.addBinaryOp(operator, precedence_or_fn);
        binops[operator] = _function;
    }
    else {
        Jsep.addBinaryOp(operator, DEFAULT_PRECEDENCE[operator] || 1);
        binops[operator] = precedence_or_fn;
    }
}
function evalLambda(a, b, nodeA, nodeB, ctx) {
    if (nodeA.type !== "Identifier" && nodeA.type !== "Compound") {
        throw new Error("Left-hand side must be an identifier or argument list");
    }
    const names = nodeA.type === "Identifier" ? [nodeA.name] : (nodeA.body.map(node => {
        if (node.type !== "Identifier") {
            throw new Error("Argument list must only consist of identifiers");
        }
        return node.name;
    }));
    const compiled = compile(nodeB);
    return (...params) => {
        const subContext = Object.assign({}, ctx);
        for (let idx = 0; idx < names.length; ++idx) {
            subContext[names[idx]] = (idx < params.length) ? params[idx] : undefined;
        }
        return compiled(subContext);
    };
}
evalLambda.lazy = true;
addBinaryOp("=>", 20, evalLambda);

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Extract an expression from the provided text content
 * @param textContent
 */
function extractExpression(textContent) {
    // Is it an expression after all?
    if (!textContent.startsWith("{{")) {
        return {
            expressionType: ExpressionType.ConstantExpression,
            value: textContent
        };
    }
    const text = textContent.substring(2, textContent.length - 2).trim();
    // Function references start with & (abbreviation for () => ...)
    if (text.startsWith("&")) {
        return extractFunctionReferenceExpression(text);
    }
    else if (variableNamePattern.test(textContent)) {
        return extractVariableReferenceExpression(text);
    }
    else {
        return extractComplexExpression(text);
    }
}
function extractVariableReferenceExpression(text) {
    return { expressionType: ExpressionType.VariableUsage, variableName: text };
}
function extractComplexExpression(text) {
    const variableNames = [];
    const expression = Jsep.parse(text);
    collectVariableNames(expression, variableNames);
    const compiled = compile(expression);
    if (variableNames.length === 0) {
        return {
            expressionType: ExpressionType.ConstantExpression,
            value: compiled({})
        };
    }
    return {
        expressionType: ExpressionType.ComplexExpression,
        usedVariableNames: variableNames,
        expression,
        compiledExpression: compiled,
        originalExpression: text
    };
}
function extractFunctionReferenceExpression(text) {
    const expression = Jsep.parse(text.substring(1));
    if (expression.type !== "CallExpression") {
        throw new Error(`Cannot parse ${text} as a function reference`);
    }
    const variableNames = [];
    collectVariableNames(expression, variableNames);
    const compiled = compile(expression);
    return {
        expressionType: ExpressionType.FunctionReferenceExpression,
        usedVariableNames: variableNames,
        expression,
        compiledExpression: compiled,
        originalExpression: "&" + text
    };
}
function collectVariableNames(parsed, variableNameList) {
    switch (parsed.type) {
        case "ArrayExpression":
            parsed.elements.forEach(element => collectVariableNames(element, variableNameList));
            break;
        case "BinaryExpression":
            [parsed.left, parsed.right].forEach(element => collectVariableNames(element, variableNameList));
            break;
        case "CallExpression":
            [parsed.callee, ...parsed.arguments].forEach(element => collectVariableNames(element, variableNameList));
            break;
        case "Compound":
            parsed.body.forEach(element => collectVariableNames(element, variableNameList));
            break;
        case "Identifier": {
            const identifier = parsed.name;
            if (!(identifier in jsKeyword) && identifier !== "Date") {
                variableNameList.push(identifier);
            }
            break;
        }
        case "MemberExpression":
            collectVariableNames(parsed.object, variableNameList);
            break;
        case "Literal":
        case "ThisExpression":
            break;
        case "UnaryExpression":
            collectVariableNames(parsed.argument, variableNameList);
            break;
        case "LogicalExpression":
            [parsed.left, parsed.right].forEach(element => collectVariableNames(element, variableNameList));
            break;
        case "ConditionalExpression":
            [parsed.test, parsed.consequent, parsed.alternate].forEach(element => collectVariableNames(element, variableNameList));
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

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
function nextId() {
    const rnd = Math.floor(Math.random() * 1000000);
    const date = new Date();
    return `${rnd}-${date.getDate()}`;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
const specialAttributeRegistry = {};
function registerSpecialAttribute(attributeName, handler, precedence = 0) {
    return specialAttributeRegistry[attributeName] = {
        id: nextId(),
        precedence,
        attributeName,
        handler,
    };
}
function getSpecialAttributeRegistry() {
    return specialAttributeRegistry;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
var MappingType;
(function (MappingType) {
    MappingType[MappingType["childVariable"] = 0] = "childVariable";
    MappingType[MappingType["attribute"] = 1] = "attribute";
    MappingType[MappingType["attributeRef"] = 2] = "attributeRef";
    MappingType[MappingType["specialAttribute"] = 3] = "specialAttribute";
})(MappingType || (MappingType = {}));

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
function classifyAttribute(attributeName) {
    if (!attributeName) {
        return undefined;
    }
    if (attributeName === "ref") {
        return { type: "ref" };
    }
    if (variableNamePattern.test(attributeName)) {
        return { type: "wildcard", variableName: attributeName };
    }
    else {
        const specialAttributeRegistry = getSpecialAttributeRegistry();
        const indexOfColon = (attributeName || "").indexOf(":");
        const name = (indexOfColon >= 0) ? attributeName === null || attributeName === void 0 ? void 0 : attributeName.substring(0, indexOfColon) : attributeName;
        const registration = specialAttributeRegistry[name];
        if (registration) {
            return {
                type: "special",
                name: name,
                fullName: attributeName,
                registration
            };
        }
        else {
            return {
                type: "standard",
                name
            };
        }
    }
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Looks for special attributes, that is, attributes which have been registered as such
 * @see registerSpecialAttribute
 *
 * @param rootElement
 * @param indexes
 */
function findSpecialAttributes(rootElement, indexes) {
    var _a;
    const result = [];
    const attributes = (_a = rootElement) === null || _a === void 0 ? void 0 : _a.attributes;
    const attributesLength = (attributes === null || attributes === void 0 ? void 0 : attributes.length) || 0;
    if (attributes && (attributes === null || attributes === void 0 ? void 0 : attributes.length) > 0) {
        for (let attIdx = 0; attIdx < attributesLength; ++attIdx) {
            const { name: fullName, value } = attributes.item(attIdx) || { name: null, value: null };
            const classification = classifyAttribute(fullName);
            if (fullName && value && (classification === null || classification === void 0 ? void 0 : classification.type) === "special") {
                const expression = extractExpression(value);
                result.push({
                    type: MappingType.specialAttribute,
                    indexes,
                    specialAttributeRegistration: classification.registration,
                    expression,
                    attributeName: fullName,
                    hidden: classification.registration.hidden
                });
            }
        }
    }
    return result;
}
function hasSpecialAttributes(rootElement) {
    var _a;
    const specialAttributeRegistry = getSpecialAttributeRegistry();
    const attributes = (_a = rootElement) === null || _a === void 0 ? void 0 : _a.attributes;
    const attributesLength = (attributes === null || attributes === void 0 ? void 0 : attributes.length) || 0;
    if (attributes && (attributes === null || attributes === void 0 ? void 0 : attributes.length) > 0) {
        for (let attIdx = 0; attIdx < attributesLength; ++attIdx) {
            const { name, value } = attributes.item(attIdx) || { name: null, value: null };
            // TODO: this will also skip decorating special attributes, which is unintended
            if (name && value && specialAttributeRegistry[name]) {
                return true;
            }
        }
    }
    return false;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Searches for child variables
 * @example
 * <span>{{aChild}}</span>
 *
 * @param rootElement
 * @param indexes
 */
function findChildVariables(rootElement, indexes) {
    const result = [];
    const length = rootElement.childNodes.length;
    for (let idx = 0; idx < length; ++idx) {
        const childNode = rootElement.childNodes.item(idx);
        if (childNode.nodeType === ELEMENT_NODE && hasSpecialAttributes(childNode)) {
            continue;
        }
        const textContent = childNode.textContent;
        if (textContent && textContent.startsWith("{{") && textContent.endsWith("}}")) {
            childNode.textContent = "";
            const newIndexes = [...indexes, idx];
            const expression = extractExpression(textContent);
            if (expression.expressionType === ExpressionType.ConstantExpression) {
                childNode.textContent = "" + (expression.value);
                continue;
            }
            result.push({
                expression,
                type: MappingType.childVariable,
                indexes: newIndexes
            });
        }
    }
    return result;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Searches for attribute variables
 * @example
 * <span title="{{dynamicTitle}}">...</span>
 *
 * @param rootElement
 * @param indexes
 */
function findAttributeVariables(rootElement, indexes) {
    var _a;
    const result = [];
    const attributes = (_a = rootElement) === null || _a === void 0 ? void 0 : _a.attributes;
    const attributesLength = (attributes === null || attributes === void 0 ? void 0 : attributes.length) || 0;
    if (attributes && (attributes === null || attributes === void 0 ? void 0 : attributes.length) > 0) {
        for (let attIdx = 0; attIdx < attributesLength; ++attIdx) {
            const { name, value } = extractNameAndValue(rootElement, attributes, attIdx);
            const classification = classifyAttribute(name);
            if (name && value && (classification === null || classification === void 0 ? void 0 : classification.type) === "standard" && expressionPattern.test(value)) {
                rootElement.setAttribute(name, "");
                const expression = extractExpression(value);
                if (expression.expressionType === ExpressionType.ConstantExpression) {
                    rootElement.setAttribute(name, "" + (expression.value));
                    continue;
                }
                result.push({
                    attributeName: name,
                    expression,
                    indexes,
                    hidden: false,
                    type: MappingType.attribute
                });
            }
        }
    }
    return result;
}
function extractNameAndValue(element, attributes, attIdx) {
    const { name, value } = attributes.item(attIdx) || { name: null, value: null };
    if (name === null || name === void 0 ? void 0 : name.startsWith(":")) {
        element.removeAttribute(name);
        const newName = name.substring(1);
        return { name: newName, value };
    }
    return { name, value };
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Searches for ref attributes
 * @example
 * <span ref="{{myRef}}">...</span>
 *
 * @param rootElement
 * @param indexes
 */
function findAttributeRefVariables(rootElement, indexes) {
    var _a;
    const result = [];
    const attributes = (_a = rootElement) === null || _a === void 0 ? void 0 : _a.attributes;
    const attributesLength = (attributes === null || attributes === void 0 ? void 0 : attributes.length) || 0;
    if (attributes && (attributes === null || attributes === void 0 ? void 0 : attributes.length) > 0) {
        for (let attIdx = 0; attIdx < attributesLength; ++attIdx) {
            const { name, value } = attributes.item(attIdx) || { name: null, value: null };
            const classification = classifyAttribute(name);
            if (name && value && classification.type === "ref") {
                rootElement.removeAttribute(name);
                const expression = extractExpression(value);
                if (expression.expressionType !== ExpressionType.VariableUsage) {
                    throw new Error("Ref attribute must be a direct reference");
                }
                result.push({
                    expression,
                    type: MappingType.attributeRef,
                    indexes
                });
            }
        }
    }
    return result;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Finds variable references in the provided element.
 * This function inspects all children recursively. If a ModrnHTMLElement is encountered,
 * recursion stops there (a ModrnHTMLElement will have done the same process for its own content already).
 *
 * Also, there is specific handling for special attributes which wrap their element (like m-if or m-for).
 *
 * @param rootElement
 */
function findVariables(rootElement) {
    const allMappings = {
        __constants: []
    };
    const result = {};
    // Ensure variables occurring in textContent are in their own respective nodes
    splitTextContentAtVariables(rootElement);
    // Look for special attributes
    const specialAttributes = findSpecialAttributes(rootElement, []);
    let vars = [];
    let newRootElement = rootElement;
    // If we do have special attributes, the root element may have been changed if the attribute is of the wrapping kind
    if (specialAttributes.length) {
        const analyzed = analyzeWrappedFragment(rootElement, [], specialAttributes, vars);
        newRootElement = analyzed.rootElement;
    }
    /** If the root element was changed, we don't need to delve into children since this will already have been done {@see analyzeWrappedFragment} */
    if (newRootElement === rootElement) {
        vars = [...vars, ...analyze(rootElement, []), ...iterateChildren(rootElement, [])];
    }
    // Normalize the list of variable mappings by putting them in a map first in order to group by child node indexes
    vars.forEach(varMapping => {
        const indexesString = varMapping.indexes.join(",");
        const where = result[indexesString] || (result[indexesString] = {
            indexes: varMapping.indexes,
            mappings: { __constants: [] }
        });
        if (varMapping.expression.expressionType === ExpressionType.ConstantExpression) {
            where.mappings.__constants.push(varMapping);
            allMappings.__constants.push(varMapping);
        }
        allVariableReferencesOf(varMapping).forEach(variableName => {
            const list = where.mappings[variableName] || (where.mappings[variableName] = []);
            list.push(varMapping);
            const allList = allMappings[variableName] || (allMappings[variableName] = []);
            allList.push(varMapping);
        });
    });
    // Finally, return the result my taking the grouped result object's entries and sort by the indexes (ensuring the
    // element will be updated from top of hierarchy to bottom of hierarchy)
    return {
        variables: {
            sorted: Object.entries(result)
                .sort(([, value1], [, value2]) => indexArrayComparer(value1.indexes, value2.indexes))
                .map(([, vars]) => vars),
            all: allMappings
        },
        newRootElement: newRootElement
    };
}
/**
 * Analyzes the provided element for variable references.
 *
 * @param rootElement
 * @param indexes
 */
function analyze(rootElement, indexes) {
    const specialAttributes = findSpecialAttributes(rootElement, indexes).sort(precedenceComparer);
    const result = [];
    if (specialAttributes.length > 0) {
        const wrappedFragmentResult = analyzeWrappedFragment(rootElement, indexes, specialAttributes, result);
        if (wrappedFragmentResult.rootElement !== rootElement) {
            return result;
        }
    }
    result.push(...findChildVariables(rootElement, indexes));
    result.push(...findAttributeVariables(rootElement, indexes));
    result.push(...findAttributeRefVariables(rootElement, indexes));
    if (!isRegisteredTagName(rootElement.tagName)) {
        result.push(...iterateChildren(rootElement, indexes));
    }
    return result;
}
/**
 * Inspect children
 * @param rootElement
 * @param indexes
 */
function iterateChildren(rootElement, indexes) {
    const result = [];
    splitTextContentAtVariables(rootElement);
    if (!rootElement.firstElementChild) {
        return result;
    }
    const length = rootElement.childNodes.length;
    for (let idx = 0; idx < length; ++idx) {
        const element = rootElement.childNodes.item(idx);
        if (!element.tagName) {
            continue;
        }
        result.push(...analyze(element, [...indexes, idx]));
    }
    return result;
}
/**
 * Extract all variable references in a mapping
 * @param varMapping
 */
function allVariableReferencesOf(varMapping) {
    switch (varMapping.expression.expressionType) {
        case ExpressionType.VariableUsage:
            return [varMapping.expression.variableName];
        case ExpressionType.ComplexExpression:
            return varMapping.expression.usedVariableNames;
        case ExpressionType.ConstantExpression:
            return [];
        case ExpressionType.FunctionReferenceExpression:
            return varMapping.expression.usedVariableNames;
        default:
            throw new Error(`Unknown expression type for ${varMapping} (${varMapping.expression.expressionType})`);
    }
}
/**
 * Analyze the first special attribute, recurse over the rest (since we have to take precedence into account and some
 * special attributes may be of the wrapping kind, like m-for)
 *
 * This is not optimal but unlikely to be a measurable bottleneck.
 *
 * @param rootElementProvided
 * @param indexes
 * @param specialAttributes
 * @param result
 */
function analyzeWrappedFragment(rootElementProvided, indexes, specialAttributes, result) {
    var _a;
    let rootElement = rootElementProvided;
    if (specialAttributes.length === 0) {
        return {
            rootElement
        };
    }
    const specialAttribute = specialAttributes[0];
    rootElement.removeAttribute(specialAttribute.specialAttributeRegistration.attributeName);
    // Invoke the handler function
    const specialAttributeHandlerResult = (_a = specialAttribute.specialAttributeRegistration) === null || _a === void 0 ? void 0 : _a.handler(rootElement);
    // Check if there is a new element returned, if so, recurse directly into it
    if (specialAttributeHandlerResult.transformedElement && specialAttributeHandlerResult.transformedElement !== rootElement) {
        rootElement = specialAttributeHandlerResult.transformedElement;
        // Recursively analyze variables in the original (unwrapped) item
        const variableResult = findVariables(rootElementProvided);
        const newRootElement = variableResult.newRootElement;
        // Build a fragment of the result (will be assigned as dynamic child later on)
        const subFragment = {
            childElement: newRootElement,
            variableDefinitions: variableResult.variables
        };
        // Re-map found variable definitions; all variable definitions now are attributes (i.e. custom props) to the
        // wrapping container
        if (subFragment.variableDefinitions) {
            const subVariables = Object.keys(subFragment.variableDefinitions.all)
                .map(variableName => ({
                indexes,
                attributeName: tagify(variableName),
                type: MappingType.attribute,
                hidden: true,
                expression: { expressionType: ExpressionType.VariableUsage, variableName }
            }));
            result.push(...subVariables);
        }
        const parentElement = newRootElement.parentElement;
        if (!parentElement) {
            throw new Error(`Parent element was assumed to exist, but didn't at ${newRootElement}`);
        }
        // Inform the wrapping element of its dynamic children
        rootElement.notifyChildrenChanged(subFragment);
        // And add to parent, removing the wrapped children
        parentElement.insertBefore(rootElement, newRootElement);
        parentElement.removeChild(newRootElement);
        result.push(specialAttribute);
        return {
            rootElement
        };
    }
    specialAttributes.splice(0, 1);
    result.push({
        type: MappingType.specialAttribute,
        hidden: false,
        indexes,
        attributeName: specialAttributeHandlerResult.remapAttributeName ? specialAttributeHandlerResult.remapAttributeName(specialAttribute.attributeName) : specialAttribute.attributeName,
        expression: specialAttribute.expression,
        specialAttributeRegistration: specialAttribute.specialAttributeRegistration,
        valueTransformer: specialAttributeHandlerResult.valueTransformer
    });
    return analyzeWrappedFragment(rootElementProvided, indexes, specialAttributes, result);
}
function precedenceComparer(s1, s2) {
    return s1.specialAttributeRegistration.precedence - s2.specialAttributeRegistration.precedence;
}
function indexArrayComparer(indexes1, indexes2) {
    const l1 = indexes1.length;
    const l2 = indexes2.length;
    if (l1 < l2) {
        return -1;
    }
    else if (l1 > l2) {
        return 1;
    }
    for (let idx = 0; idx < l1; idx++) {
        const v1 = indexes1[idx];
        const v2 = indexes2[idx];
        if (v1 < v2) {
            return -1;
        }
        else if (v1 > v2) {
            return 1;
        }
    }
    return 0;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
function copyDeep(current, currentRoot) {
    let pivotRoot = currentRoot;
    let pivot = current;
    while (pivot && pivotRoot) {
        const current = pivot;
        const currentRoot = pivotRoot;
        pivot = pivot.nextElementSibling;
        pivotRoot = pivotRoot.nextElementSibling;
        if (current instanceof ModrnHTMLElement) {
            currentRoot.copyTo(current);
        }
        else if (current.firstElementChild && currentRoot.firstElementChild) {
            copyDeep(current.firstElementChild, currentRoot.firstElementChild);
        }
    }
}
function cloneDeep(root) {
    const result = root.cloneNode(true);
    copyDeep(result, root);
    return result;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Analyzes the provided root element to a fragment.
 * @see Fragment
 *
 * @param rootElement
 */
function analyzeToFragment(rootElement) {
    const variables = findVariables(rootElement);
    const childElement = cloneDeep(rootElement);
    return { childElement, variableDefinitions: variables.variables };
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Creates the root element for the provided custom element
 * @param component
 * @param tagName
 */
function createRootElement(component, tagName) {
    const result = document.createElement("div", { is: tagName });
    result.style.display = "contents";
    return result;
}
/**
 * Performs the static (one-time) initialization for the provided component.
 * @param componentName
 * @param component
 */
function componentStaticInitialize(componentName, component) {
    const tagName = tagify(componentName);
    const rootElement = createRootElement(component, tagName);
    rootElement.innerHTML = component.htmlTemplate;
    const fragment = analyzeToFragment(rootElement);
    logDiagnostic(`Element ${componentName} analyzed to`, fragment.variableDefinitions);
    setStaticInitializationResultForComponent(componentName, fragment);
}
/**
 * Statically initialize all components currently registered
 * @param componentRegistry
 */
function initializeAll(componentRegistry) {
    Object.entries(componentRegistry).forEach(([, componentInfo]) => {
        componentStaticInitialize(componentInfo.componentName, componentInfo.registeredComponent);
    });
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
function childNodesToArray(element) {
    const result = [];
    const length = element.childNodes.length;
    for (let idx = 0; idx < length; ++idx) {
        result.push(element.childNodes.item(idx));
    }
    return result;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
let domContentIsLoaded = document.readyState === "complete";
let domContentLoadedPromise;
function isDomContentLoaded() {
    return domContentIsLoaded;
}
function waitUntilDomContentLoaded() {
    return __awaiter(this, void 0, void 0, function* () {
        if (domContentIsLoaded) {
            return Promise.resolve();
        }
        if (domContentLoadedPromise) {
            return domContentLoadedPromise;
        }
        let resolver = () => void 0;
        function hasLoadedFn() {
            domContentIsLoaded = true;
            document.removeEventListener("DOMContentLoaded", hasLoadedFn);
            resolver(null);
        }
        domContentLoadedPromise = new Promise(resolve => resolver = resolve);
        document.addEventListener("DOMContentLoaded", hasLoadedFn);
        return domContentLoadedPromise;
    });
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Gets the child value of the node
 * @param self
 * @param node
 */
function getChildValue(self, node) {
    if (node instanceof HTMLElement || node instanceof SVGElement) {
        return node;
    }
    if (node.nodeType === TEXT_NODE) {
        return node.textContent;
    }
    throw new Error(`Cannot get child content of ${nodeInfo(node)} of ${nodeInfo(self)}: cannot map type`);
}
/**
 * Sets the child value of the provided node. This is a bit lengthy (see the individual functions below),
 * since several cases have to be taken care of. There will be bugs here waiting to be fixed.
 *
 * @param self
 * @param node
 * @param match
 * @param valueProvided
 */
function setChildValue(self, node, match, valueProvided) {
    let value;
    const valueTransformer = match.valueTransformer;
    if (node instanceof ModrnHTMLElement) {
        value = setModrnElementChildContent(self, node, valueProvided, valueTransformer);
    }
    else if (node instanceof HTMLElement || node instanceof SVGElement) {
        value = setChildContentToElementChild(self, node, valueProvided, valueTransformer);
    }
    else if (node.nodeType === TEXT_NODE) {
        value = setChildContentToTextNode(self, node, valueProvided, valueTransformer);
    }
    return value;
}
function setModrnElementChildContent(self, node, valueProvided, valueTransformer) {
    var _a;
    let value;
    const state = node === null || node === void 0 ? void 0 : node.state;
    if (!state) {
        throw new Error(`Node is missing state: ${nodeInfo(node)} of ${nodeInfo(self)}`);
    }
    if (typeof valueProvided === "undefined" || valueProvided === null || valueProvided === false) {
        // Clear if falsy and not a number or string
        state.previousChild = null;
    }
    else if (typeof valueProvided === "object" && valueProvided instanceof HTMLElement) {
        value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
        if (((_a = state.previousChild) === null || _a === void 0 ? void 0 : _a.childElement) !== value) {
            // Setting a HTMLELement child requires to first analyze the provided fragment
            state.previousChild = analyzeToFragment(value);
        }
    }
    else if (typeof valueProvided === "string" || typeof valueProvided === "number" || typeof valueProvided === "boolean") {
        // TODO: could be optimized to check if there's already just one span, then it'd be enough to just replace the text content
        const valueNode = document.createElement("span");
        value = valueTransformer ? valueTransformer(valueNode, valueProvided) : valueProvided;
        valueNode.textContent = "" + value;
        state.previousChild = { childElement: valueNode, variableDefinitions: null };
    }
    else if (typeof valueProvided === "object" && valueProvided.unsafeHtml) {
        // same as above
        const valueNode = document.createElement("span");
        value = valueTransformer ? valueTransformer(valueNode, valueProvided) : valueProvided;
        valueNode.innerHTML = "" + value.unsafeHtml;
        state.previousChild = { childElement: valueNode, variableDefinitions: null };
    }
    else {
        throw new Error(`Cannot set child content on ${nodeInfo(node)} of ${nodeInfo(self)} to ${valueProvided}: cannot map type`);
    }
    return value;
}
function clearChildren(node) {
    let child;
    while ((child = node.lastChild))
        node.removeChild(child);
}
function setChildContentToElementChild(self, node, valueProvided, valueTransformer) {
    var _a;
    let value;
    if (typeof valueProvided === "undefined" || valueProvided === null) {
        value = valueTransformer ? valueTransformer(node, valueProvided) : "";
        node.innerHTML = value;
    }
    else if (typeof valueProvided === "object" && valueProvided instanceof HTMLElement) {
        // Set a html element child directly. We're not cloning here, since clones can easily provided in an efficient
        // manner using useTemplateChildren()
        value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
        if (node.childNodes.length !== 1 || node.firstElementChild !== value) {
            clearChildren(node);
            node.appendChild(value);
        }
    }
    else if (typeof valueProvided === "object" && ((_a = valueProvided) === null || _a === void 0 ? void 0 : _a.__childCollection)) {
        // Here we're setting a useTemplateChildren() result as the body of another html element
        value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
        const children = value.elements;
        let currentElement = node.firstElementChild;
        for (const child of children) { // iterate all desired children
            const replace = child !== currentElement; // compare current desired child with actual child
            const before = currentElement;
            currentElement = (currentElement === null || currentElement === void 0 ? void 0 : currentElement.nextElementSibling) || null;
            if (replace) { // if replacing is required, do that
                node.insertBefore(child, currentElement);
                if (before) {
                    node.removeChild(before);
                }
            } // otherwise we can skip this element
        }
        // all remaining actual children are superfluous and must be removed
        while (currentElement != null) {
            const before = currentElement;
            currentElement = currentElement.nextElementSibling;
            node.removeChild(before);
        }
    }
    else if (typeof valueProvided === "object" && valueProvided.unsafeHtml) {
        value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
        node.innerHTML = "" + value.unsafeHtml;
    }
    else if (typeof valueProvided === "string" || typeof valueProvided === "number" || typeof valueProvided === "boolean") {
        value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
        node.textContent = "" + value;
    }
    else {
        if (node.nodeName === "PRE") {
            node.innerHTML = "";
            value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
            node.textContent = JSON.stringify(valueProvided, null, 2);
        }
        else {
            throw new Error(`Cannot set child content on ${nodeInfo(node)} of ${nodeInfo(self)} to ${valueProvided}: cannot map type`);
        }
    }
    return value;
}
/**
 * Text nodes need a little special treatment, since depending on the value they need to be upgraded to elements
 * @param self
 * @param node
 * @param valueProvided
 * @param valueTransformer
 */
function setChildContentToTextNode(self, node, valueProvided, valueTransformer) {
    var _a;
    let value;
    if ((_a = valueProvided) === null || _a === void 0 ? void 0 : _a.__childCollection) {
        // We're providing a child collection, upgrade the text node to an element
        const parent = node.parentElement;
        if (!parent) {
            throw new Error(`Parent element missing on ${nodeInfo(node)} of ${nodeInfo(self)}`);
        }
        // Create a div style=contents container
        const newNode = document.createElement("div");
        newNode.style.display = "contents";
        value = valueTransformer ? valueTransformer(newNode, valueProvided) : valueProvided;
        // Append the children
        const children = value.elements;
        children.forEach(newNode.appendChild.bind(newNode));
        parent.insertBefore(newNode, node);
        parent.removeChild(node);
    }
    else if (typeof valueProvided === "undefined" || valueProvided === null) {
        value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
        node.textContent = "";
    }
    else if (typeof valueProvided === "object" && valueProvided instanceof HTMLElement) {
        const parent = node.parentElement;
        if (!parent) {
            throw new Error(`Parent element missing on ${nodeInfo(node)} of ${nodeInfo(self)}`);
        }
        value = valueTransformer ? valueTransformer(parent, valueProvided) : valueProvided;
        parent.insertBefore(value, node);
        parent.removeChild(node);
    }
    else if (typeof valueProvided === "string" || typeof valueProvided === "number" || typeof valueProvided === "boolean") {
        value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
        node.textContent = "" + value;
    }
    else {
        value = valueTransformer ? valueTransformer(node, valueProvided) : valueProvided;
        node.textContent = JSON.stringify(valueProvided, null, 2);
    }
    return value;
}
function nodeInfo(node) {
    if (node.nodeType === ELEMENT_NODE) {
        return node.nodeName.toLowerCase() + "#" + node.id;
    }
    else {
        return node.nodeName.toLowerCase();
    }
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
const hasWarned = {};
/**
 * Gets the value of an attribute for a specific node (with the rendering context of "self" i.e. the containing ModrnHTMLElement)
 *
 * @param self
 * @param node
 * @param attributeNameOriginal
 */
function getAttributeValue(self, node, attributeNameOriginal) {
    // If the node is a ModrnHTMLElement, first look into custom props
    if (node instanceof ModrnHTMLElement) {
        // Convert the attribute name from attribute-case to propCase
        const attributeName = unTagify(attributeNameOriginal, true);
        const state = node === null || node === void 0 ? void 0 : node.state;
        // Maybe the element is not yet upgraded, we may have to look into the initial props
        if (!state) {
            const initialCustomProps = self.initialCustomProps;
            if (initialCustomProps && (attributeName in initialCustomProps)) {
                return initialCustomProps[attributeName];
            }
        }
        else {
            if (attributeName in state.customProps) {
                return state.customProps[attributeName];
            }
        }
    }
    // Check if the attribute is a property of the node
    const attributeName = attributeNameOriginal;
    if (attributeName in node) {
        return node[attributeName];
    }
    // No, then try getAttribute last
    return node.getAttribute(attributeName);
}
/**
 * Sets the value of an attribute/prop
 * @param self - the ModrnHTMLElement providing the context
 * @param node - the node to set the attribute/prop on
 * @param attributeName - the name of the attribute/prop
 * @param value - the value
 * @param hidden - if true, hides a html-visible counterpart for a ModrnHTMLElement node
 */
function setAttributeValue(self, node, attributeName, value, hidden) {
    // For a ModrnHTMLElement, simply set the (initial, if not yet upgraded) props
    if (node instanceof ModrnHTMLElement) {
        const untagifiedName = unTagify(attributeName, true);
        const state = node === null || node === void 0 ? void 0 : node.state;
        if (!state) {
            node.initialCustomProps = Object.assign(Object.assign({}, node.initialCustomProps), { [untagifiedName]: value });
        }
        else {
            state.customProps[untagifiedName] = value;
        }
        if (!hidden) {
            node.setAttribute(attributeName, "" + value);
        }
    }
    else {
        // For other elements, it gets more complicated
        // First check if the attribute is a member of "node" - SVGElements behave not so well here // TODO: maybe problematic for certain other attributes as well
        if (!(node instanceof SVGElement) && attributeName in node) {
            node[attributeName] = value;
        }
        else if (typeof value === "string" || typeof value === "number") { // string or number => just set attribute
            node.setAttribute(attributeName, "" + value);
        }
        else if (typeof value === "boolean") { // booleans need probably special treatment, for now it works - TODO: revisit
            if (value) {
                node.setAttribute(attributeName, "1");
            }
            else {
                node.removeAttribute(attributeName);
            }
        }
        else if (typeof value === "undefined" || value === null) { // for other falsy values, remove the attribute
            node.removeAttribute(attributeName);
        }
        else if (typeof value === "function") {
            // We're here if the value is a function but there is no property of node of the required name
            // That means we have to warn (once) that the attribute cannot be applied
            if (!hasWarned[node.nodeName + "_" + attributeName]) {
                console.warn(`Cannot set attribute ${attributeName} on ${nodeInfo(node)} of ${nodeInfo(self)}: event handler does not exist`);
                hasWarned[node.nodeName + "_" + attributeName] = true;
            }
        }
        else {
            throw new Error(`Cannot set attribute ${attributeName} on ${nodeInfo(node)} of ${nodeInfo(self)} to ${value}: cannot map type`);
        }
    }
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
let changes = {
    list: new WeakMap() // eslint-disable-line
};
function union(applyResult, applyResult2) {
    applyResult.madeChanges || (applyResult.madeChanges = applyResult2.madeChanges);
    return applyResult;
}
function clean(what, except) {
    const filtered = what.consumers.filter(consumer => {
        const ref = consumer.deref();
        return ref !== undefined && ref !== except;
    });
    if (filtered.length !== what.consumers.length) {
        what.consumers = filtered;
    }
    return what.consumers;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
let tainted = new WeakSet(); // eslint-disable-line
/**
 * Checks if an object is tainted (i.e. marked dirty, despite potentially having the same reference than in the
 * past rendering cycle)
 *
 * @param what
 */
function isTainted(what) {
    if (typeof what === "object") {
        return tainted.has(what); // eslint-disable-line
    }
    return false;
}
/**
 * Reset tainted flags
 */
function clearTainted() {
    tainted = new WeakSet(); // eslint-disable-line
}
/**
 * Mark an object as tainted. This both marks the object as tainted and checks which other
 * components reference this specific object currently, and marks those as requiring a re-render.
 *
 * @param what
 * @param recursive
 */
function markChanged(what, recursive) {
    if (typeof what === "object") {
        tainted.add(what);
    }
    const found = changes.list.get(what);
    if (found) {
        clean(found).forEach(consumer => {
            const ref = consumer.deref();
            if (ref) {
                requestRender(ref);
            }
        });
    }
    if (recursive) {
        Object.values(what).filter(what => typeof what === "object" && what !== null).forEach(what => markChanged(what, true));
    }
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
function getStateId(what) {
    var _a;
    if (typeof what === "function") {
        return (_a = what) === null || _a === void 0 ? void 0 : _a.stateId;
    }
    return undefined;
}
/**
 * Checks if a function has changed. If the function is dynamic {@see dynamic}, it is strictly compared for equality,
 * which means it changes during each re-render. If the function is state-bound {@see purify}, it is considered
 * inequal only if the state has changed in between. @TODO this is probably not even necessary, write test
 *
 * @param previous
 * @param valueToSet
 */
function hasFunctionChanged(previous, valueToSet) {
    var _a, _b, _c, _d;
    if (valueToSet.dynamic && previous !== valueToSet) {
        return true;
    }
    const previousId = getStateId(previous);
    const currentId = getStateId(valueToSet);
    if (typeof previous === "function" && typeof valueToSet === "function" && previousId && currentId) {
        if (previousId !== currentId) {
            return true;
        }
        const previousContext = (_b = (_a = previous) === null || _a === void 0 ? void 0 : _a.stateContext) === null || _b === void 0 ? void 0 : _b.deref();
        const currentContext = (_d = (_c = valueToSet) === null || _c === void 0 ? void 0 : _c.stateContext) === null || _d === void 0 ? void 0 : _d.deref();
        return previousContext !== currentContext;
    }
    return false;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Checks if an object has changed up to a maximum recursion depth
 * @param previous
 * @param now
 * @param depth
 */
function hasChanged(previous, now, depth) {
    if (!now || !previous) {
        return true;
    }
    if (Array.isArray(now) && Array.isArray(previous)) {
        if (hasArrayChanged(previous, now, depth - 1)) {
            return true;
        }
    }
    else if (typeof now === "object" && typeof previous === "object") {
        if (hasObjectChanged(previous, now, depth - 1)) {
            return true;
        }
    }
    else if (typeof now === "function" && typeof previous === "function") {
        return hasFunctionChanged(previous, now);
    }
    return false;
}
/**
 * Checks if an array has changed up to a maximum recursion depth
 * @param previousArr
 * @param nowArr
 * @param depth
 */
function hasArrayChanged(previousArr, nowArr, depth) {
    if (previousArr.length !== nowArr.length) {
        return true;
    }
    else {
        for (let idx = 0; idx < nowArr.length; idx++) {
            const now = nowArr[idx];
            const previous = previousArr[idx];
            if (now !== previous) {
                if (depth !== 0) {
                    if (hasChanged(previous, now, depth - 1)) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
        }
    }
    return false;
}
/**
 * Checks if an object has changed up to a maximum recursion depth
 * @param previous
 * @param value
 * @param depth
 */
function hasObjectChanged(previous, value, depth) {
    const previousEntries = Object.entries(previous);
    const nowEntries = Object.keys(value);
    if (previousEntries.length !== nowEntries.length) {
        return true;
    }
    else {
        const now = value;
        for (const [name, val] of previousEntries) {
            if (!(name in now)) {
                return true;
            }
            if (now[name] !== val) {
                if (depth !== 0) {
                    if (hasChanged(val, now[name], depth - 1)) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
        }
    }
    return false;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Called after a variable has been applied with the previous and current value.
 * This is not a simple copy of {@see hasChanged} but a specific implementation to deal with the specifics of the
 * underlying DOM data model.
 *
 * @param previous
 * @param now
 * @param forConsumer
 * @param node
 */
function changeFromTo(previous, now, forConsumer) {
    var _a, _b;
    if (!previous && !now) {
        return { madeChanges: false };
    }
    /** Check if the "now" object has been marked as tainted, if so, we have to re-render {@see markChanged} */
    if (isTainted(now)) {
        return { madeChanges: true };
    }
    updateChangeTracking(previous, now, forConsumer);
    /** Check if the reference is equal, then we cannot have changed (except if tainted, see above) */
    if (previous === now) {
        return { madeChanges: false };
    }
    /** Check if the value is a ref; if so, compare the refs' contents */
    if (((_a = previous) === null || _a === void 0 ? void 0 : _a.__addRef) && ((_b = now) === null || _b === void 0 ? void 0 : _b.__addRef)) {
        return compareRefs(previous, now);
    }
    /** Check if we're rendering dynamic children, if so, compare the child collection */
    if (previous instanceof HTMLElement && now.__childCollection) {
        return compareChildCollection(previous, now);
    }
    if (typeof now === "function") {
        return { madeChanges: hasFunctionChanged(previous, now) };
    }
    if (Array.isArray(now) && Array.isArray(previous)) {
        const nowArr = now;
        const previousArr = previous;
        if (nowArr.length === 0 && previousArr.length === 0) {
            return { madeChanges: false };
        }
        else {
            return { madeChanges: hasArrayChanged(previousArr, nowArr, DEFAULT_RECURSION_DEPTH - 1) };
        }
    }
    return { madeChanges: true };
}
function compareRefs(previous, now) {
    const prevRefs = previous;
    const nowRefs = now;
    if (prevRefs.length !== nowRefs.length) {
        return { madeChanges: true };
    }
    const len = prevRefs.length;
    for (let idx = 0; idx < len; idx++) {
        const p = prevRefs[idx];
        const n = nowRefs[idx];
        if (p !== n) {
            return { madeChanges: true };
        }
    }
    return { madeChanges: false };
}
function compareChildCollection(previous, now) {
    const children = now.elements;
    if (previous.childNodes.length !== children.length) {
        return { madeChanges: true };
    }
    for (let idx = 0; idx < children.length; ++idx) {
        if (previous.childNodes.item(idx) !== children[idx]) {
            return { madeChanges: true };
        }
    }
    return { madeChanges: false };
}
function updateChangeTracking(previous, now, forConsumer) {
    var _a;
    if (typeof previous === "object") {
        const found = changes.list.get(previous); // eslint-disable-line
        if (found) {
            clean(found, forConsumer);
        }
    }
    if (typeof now === "object") {
        let found = (_a = changes.list.get(now)) === null || _a === void 0 ? void 0 : _a.consumers; // eslint-disable-line
        if (!found) {
            found = [];
            changes.list.set(now, { consumers: found }); // eslint-disable-line
        }
        found.push(new WeakRef(forConsumer));
    }
}
const DEFAULT_RECURSION_DEPTH = 1;

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
let currentStateContext = undefined;
/**
 * Creates the initial state for the provided modrn html element. If the component was instantiated and is now being
 * upgraded, the initial props prior to upgrade (self.initialCustomProps) are copied over to the actual custom props
 * (self.customProps)
 *
 * @param self
 */
function createEmptyState(self) {
    try {
        return {
            addedChildElements: new WeakSet(),
            previousChild: null,
            customProps: self.initialCustomProps || {},
            state: {},
            disconnected: [],
            update: self.update.bind(self),
            getOwner: () => self
        };
    }
    finally {
        delete self.initialCustomProps;
    }
}
/**
 * Returns or creates the empty state for the element
 * @param self
 */
function getStateOf(self) {
    return self.state || (self.state = createEmptyState(self));
}
/**
 * Returns the current state context during rendering
 */
function getCurrentStateContext() {
    const state = currentStateContext;
    if (!state) {
        throw new Error("Not initialized - forgotten to use bindToStateContext?");
    }
    return state;
}
/**
 * Wraps the provided function with the state, preserving the state context stack
 * @param state
 * @param fn
 * @param params
 */
function withState(state, fn, ...params) {
    const oldStateContext = currentStateContext;
    try {
        currentStateContext = state;
        return fn(...params);
    }
    finally {
        currentStateContext = oldStateContext;
    }
}
/**
 * Explicitly declares the provided function as dynamic. This has the effect that the function is newly instantiated
 * during each render and thus sees all props always. This has some performance implications, and it is preferable to
 * use state-bound functions instead (state is always up-to-date) and should be avoided where not necessary.
 *
 * @param fn
 * @param params
 */
function dynamic(fn, ...params) {
    const result = bindToStateContext(fn);
    result.dynamic = true;
    return result;
}
/**
 * Binds the provided function to the current state context, if not already bound.
 * @see withState
 *
 * @param fn
 * @param params
 */
function bindToStateContext(fn, ...params) {
    if ("bound" in fn) {
        return fn;
    }
    if (!currentStateContext) {
        throw new Error("Cannot bind to current state context since none exists");
    }
    const boundCurrentStateContext = currentStateContext;
    const result = ((...params) => withState(boundCurrentStateContext, fn, ...params)); // eslint-disable-line
    result.bound = true;
    result.dynamic = false;
    return result;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
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
function substituteVariables(self, root, varsProvided, variableDefinitionsProvided, suppressReRender = false) {
    var _a, _b;
    const componentInfoProvided = self.componentInfo;
    const vars = Object.assign(Object.assign({}, varsProvided), (_a = self.componentInfo) === null || _a === void 0 ? void 0 : _a.registeredComponent.filters);
    if (!componentInfoProvided) {
        throw new Error(`Can only substitute variables after component info is initialized for ${nodeInfo(self)} node`);
    }
    const componentInfo = componentInfoProvided;
    const variableDefinitions = variableDefinitionsProvided || ((_b = componentInfo.content) === null || _b === void 0 ? void 0 : _b.variableDefinitions);
    if (!variableDefinitions) {
        return;
    }
    const processedExpressions = {};
    // Iterate over child nodes which reference variables
    variableDefinitions.sorted.forEach(variableDefinitionForNode => {
        let _node;
        function node() {
            return _node || (_node = getNode(root, variableDefinitionForNode.indexes));
        }
        const constants = variableDefinitionForNode.mappings.__constants;
        const slotsBySpecialAttribute = {};
        const specialAttributeProcessFns = [];
        const applyResult = { madeChanges: false };
        // Apply constants, if any
        constants.forEach(constant => {
            const value = wrapFunctionWithContextIfRequired(constant.expression.value);
            if (value) {
                if (value.then) {
                    const theNode = node();
                    value.then(resolved => setValue(theNode, constant, resolved, null, null));
                }
                else {
                    union(applyResult, setValue(node(), constant, value, slotsBySpecialAttribute, specialAttributeProcessFns));
                }
            }
        });
        // Iterate over provided variables
        Object.keys(vars).forEach(variableName => {
            var _a;
            // And see if there is a mapping for this variable in this node
            const matches = variableDefinitionForNode.mappings[variableName] || [];
            // If yes, apply
            for (const match of matches) {
                let value;
                if (match.expression.expressionType === ExpressionType.VariableUsage) {
                    // Just variable reference
                    value = vars[variableName];
                }
                else if (match.expression.expressionType === ExpressionType.ComplexExpression) {
                    // Complex expression
                    try {
                        const complexExpression = match.expression;
                        value = (complexExpression.originalExpression in processedExpressions)
                            ? processedExpressions[complexExpression.originalExpression]
                            : (processedExpressions[complexExpression.originalExpression] = complexExpression.compiledExpression(vars));
                    }
                    catch (err) {
                        logWarn(`Couldn't evaluate expression on ${nodeInfo(self)} triggered by ${variableName}`);
                        value = undefined;
                    }
                }
                else if (match.expression.expressionType === ExpressionType.FunctionReferenceExpression) {
                    // Function reference
                    const functionReferenceExpression = match.expression;
                    value = (functionReferenceExpression.originalExpression in processedExpressions)
                        ? processedExpressions[functionReferenceExpression.originalExpression]
                        : (processedExpressions[functionReferenceExpression.originalExpression] = () => functionReferenceExpression.compiledExpression(vars));
                }
                value = wrapFunctionWithContextIfRequired(value);
                // If promise, set asynchronously, otherwise directly
                if ((_a = value) === null || _a === void 0 ? void 0 : _a.then) {
                    const theNode = node();
                    value.then(resolved => setValue(theNode, match, resolved, null, null).madeChanges);
                }
                else {
                    union(applyResult, setValue(node(), match, value, slotsBySpecialAttribute, specialAttributeProcessFns));
                }
            }
        });
        // Special attributes may require post processing
        if (specialAttributeProcessFns === null || specialAttributeProcessFns === void 0 ? void 0 : specialAttributeProcessFns.map(fn => fn()).filter(res => res).length) {
            applyResult.madeChanges = true;
        }
        const modrnNode = node();
        if (applyResult.madeChanges && modrnNode.state) {
            renderComponent(node());
        }
    });
    function setValue(node, match, valueProvided, slotsBySpecialAttribute, specialAttributeProcessFns) {
        var _a, _b;
        if (!componentInfo) {
            throw new Error(`Can only substitute variables after component info is initialized for ${nodeInfo(self)} node`);
        }
        let applyResult = { madeChanges: false };
        switch (match.type) {
            case MappingType.attributeRef: {
                if (node instanceof HTMLElement) {
                    const value = match.valueTransformer ? match.valueTransformer(node, valueProvided) : valueProvided;
                    const ref = value;
                    ref.__addRef(node);
                }
                if (node instanceof ModrnHTMLElement && ((_b = (_a = node.componentInfo) === null || _a === void 0 ? void 0 : _a.registeredComponent) === null || _b === void 0 ? void 0 : _b.transparent) && !suppressReRender) {
                    requestRender(node);
                }
                break;
            }
            case MappingType.specialAttribute: {
                const attributeVariable = match;
                const attributeName = attributeVariable.specialAttributeRegistration.attributeName;
                if (!(node instanceof HTMLElement)) {
                    throw new Error(`Special attribute can not be set on regular node (${node}), ${attributeName}`);
                }
                if (match.valueTransformer) {
                    if (!slotsBySpecialAttribute || !specialAttributeProcessFns) {
                        throw new Error("Special attributes must not be used with promises");
                    }
                    let slots = slotsBySpecialAttribute[attributeVariable.specialAttributeRegistration.id];
                    if (!slots) {
                        slots = slotsBySpecialAttribute[attributeVariable.specialAttributeRegistration.id] = {};
                        specialAttributeProcessFns.push(() => {
                            const value = match.valueTransformer(node, slots);
                            return setAsAttribute(node, attributeName, value).madeChanges;
                        });
                    }
                    slots[attributeVariable.attributeName] = valueProvided;
                }
                else {
                    applyResult = setAsAttribute(node, attributeName, valueProvided);
                }
                break;
            }
            case MappingType.attribute: {
                const attributeVariable = match;
                const attributeName = attributeVariable.attributeName;
                if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
                    throw new Error(`Attribute can not be set on regular node (${node}), ${attributeName}`);
                }
                const value = match.valueTransformer ? match.valueTransformer(node, valueProvided) : valueProvided;
                applyResult = setAsAttribute(node, attributeName, value);
                break;
            }
            case MappingType.childVariable: {
                applyResult = setAsChildValue(node, match, valueProvided);
                break;
            }
            default:
                throw new Error("Unsupported");
        }
        return applyResult;
    }
    function setAsAttribute(node, attributeName, value) {
        const original = getAttributeValue(self, node, attributeName);
        setAttributeValue(self, node, attributeName, value, true);
        return changeFromTo(original, value, self);
    }
    function setAsChildValue(node, match, valueProvided) {
        const original = getChildValue(self, node);
        const value = setChildValue(self, node, match, valueProvided);
        return changeFromTo(original, value, self);
    }
}
function varsWithOptions(vars, options) {
    return Object.assign(Object.assign({}, vars), { __options: options });
}
function getNode(rootElement, indexes) {
    let current = rootElement;
    for (const index of indexes) {
        current = current.childNodes.item(index);
    }
    return current;
}
function wrapFunctionWithContextIfRequired(value) {
    if (typeof value === "function") {
        if (!("bound" in value)) {
            value = bindToStateContext(value);
        }
    }
    return value;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Builds the props for the element by merging attributes and custom props.
 *
 * @param self
 * @param componentInfo
 */
function buildProps(self, componentInfo) {
    const props = { allProps };
    function allProps() {
        var _a;
        return Object.assign(Object.assign({}, attributesOf(self)), (_a = self.state) === null || _a === void 0 ? void 0 : _a.customProps);
    }
    if (componentInfo.registeredComponent.propTemplate) {
        Object.entries(componentInfo.registeredComponent.propTemplate)
            // TODO: check type
            .forEach(([name, propTypeValue]) => {
            var _a, _b;
            const value = (((_a = self.state) === null || _a === void 0 ? void 0 : _a.customProps[name]) !== undefined) ? (_b = self.state) === null || _b === void 0 ? void 0 : _b.customProps[name] : self.getAttribute(tagify(name));
            props[name] = value;
        });
    }
    return props;
}
/**
 * Renders the component. The root node to render may be specified explicitly during the initial rendering (the fully rendered
 * content is then appended at once).
 *
 * @param self
 * @param nodeToRender
 * @param suppressForDirectChildren
 */
function renderComponent(self, nodeToRender, suppressForDirectChildren = false) {
    const componentInfo = self.componentInfo;
    const state = self.state;
    if (!state) {
        throw new Error(`Cannot render ${self}: no state exists`);
    }
    if (!componentInfo) {
        throw new Error(`Cannot render ${self}: componentInfo missing`);
    }
    const root = (nodeToRender || self);
    if (!root) {
        return;
    }
    const props = buildProps(self, componentInfo);
    withState(state, () => {
        var _a;
        let variables = componentInfo.registeredComponent.renderFunction(props) || {};
        if (componentInfo.registeredComponent.transparent) {
            variables = Object.assign(Object.assign(Object.assign({}, attributesOf(self)), (_a = self.state) === null || _a === void 0 ? void 0 : _a.customProps), variables);
        }
        substituteVariables(self, root, variables, undefined, suppressForDirectChildren);
    });
}
/**
 * Extract attributes to a more convenient record.
 * @param self
 */
function attributesOf(self) {
    const result = {};
    const length = self.attributes.length;
    for (let index = 0; index < length; ++index) {
        const { name, value } = self.attributes.item(index) || {};
        if (name && value) {
            result[name] = value;
        }
    }
    return result;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/** [[include:./README.md]] */
/**
 * Extracts dynamic child content (commonly named "slot"). Since the component may have been upgraded,
 * children which belong to the component itself are being excluded, the rest is detached from the component
 * and stored in state.previousChild.
 *
 * @param self
 */
function extractDynamicChildContent(self) {
    const state = getStateOf(self);
    const childNodes = childNodesToArray(self).filter(cn => !state.addedChildElements.has(cn));
    if (childNodes.length === 1 && childNodes[0].nodeType === ELEMENT_NODE) {
        state.previousChild = analyzeToFragment(self.firstElementChild);
        self.removeChild(self.firstElementChild);
        logDiagnostic("Done extracting previous single child", self, state.previousChild.childElement);
    }
    else if (childNodes.length > 0) {
        const container = document.createElement("div");
        container.style.display = "contents";
        for (const childNode of childNodes) {
            container.appendChild(childNode);
        }
        state.previousChild = analyzeToFragment(container);
        logDiagnostic("Done extracting previous children", self, state.previousChild.childElement);
    }
}
/**
 * During initial rendering the dynamic children are not yet available.
 * IMPORTANT: This occurs only if the component is marked as dynamic {@see ComponentBuilderDynamicChildren} to avoid
 * the overhead of re-checking for all components not expecting dynamic children.
 *
 * @param weakSelf
 */
function waitForDynamicChildContentInitialization(weakSelf) {
    waitUntilDomContentLoaded().then(() => {
        const self = weakSelf.deref();
        if (self) {
            extractDynamicChildContent(self);
            requestRender(self);
        }
    });
}
/**
 * Tries to extract the dynamic children if required and possible, and returns true otherwise if we have to wait
 * for a re-render.
 * @see waitForDynamicChildContentInitialization
 *
 * @param self
 */
function extractDynamicChildContentIfPossible(self) {
    var _a;
    if (!((_a = self.componentInfo) === null || _a === void 0 ? void 0 : _a.registeredComponent.dynamicChildren)) {
        logDiagnostic(`Not parsing dynamic children for ${self.nodeName}, since dynamicChildren attribute is not set`);
        return false;
    }
    if (isDomContentLoaded()) {
        extractDynamicChildContent(self);
    }
    return !isDomContentLoaded();
}
/**
 * Appends the static child content of the element (i.e. the template used during registration)
 *
 * @param componentInfo
 * @param self
 */
function appendStaticChildContent(componentInfo, self) {
    var _a, _b;
    if ((_a = componentInfo.content) === null || _a === void 0 ? void 0 : _a.childElement) {
        const state = getStateOf(self);
        const cloned = cloneDeep((_b = componentInfo.content) === null || _b === void 0 ? void 0 : _b.childElement);
        renderComponent(self, cloned, true);
        const childNodes = childNodesToArray(cloned);
        for (const childNode of childNodes) {
            self.appendChild(childNode);
            state.addedChildElements.add(childNode);
        }
    }
}
/**
 * Component has connected callback function. This function may be called multiple times and guards itself against that.
 * @param self
 * @param componentInfo
 */
function componentHasConnected(self, componentInfo) {
    self.nodeName + "#" + self.id;
    if (self.parentNode && !self.state) {
        self.style.display = "contents";
        let requireObserverForChildContent;
        if (self.initialPreviousChild) {
            getStateOf(self).previousChild = self.initialPreviousChild;
            requireObserverForChildContent = false;
        }
        else {
            requireObserverForChildContent = extractDynamicChildContentIfPossible(self);
        }
        appendStaticChildContent(componentInfo, self);
        if (requireObserverForChildContent) {
            waitForDynamicChildContentInitialization(new WeakRef(self));
        }
    }
}
/**
 * Called when the component unmounts. Calls disconnect functions
 * @param self
 */
function componentHasDisconnected(self) {
    var _a;
    if ((_a = self.state) === null || _a === void 0 ? void 0 : _a.disconnected) {
        (self.state.disconnected || []).forEach(fn => fn());
        self.state.disconnected = [];
    }
}
/**
 * Called when the dynamic children change. Does not implicitly re-render, since this is usually happening
 * inside a render cycle.
 *
 * @param self
 * @param componentInfo
 * @param childFragment
 */
function childrenChanged(self, componentInfo, childFragment) {
    if (!self.state) {
        self.initialPreviousChild = childFragment;
    }
    else {
        self.state.previousChild = childFragment;
    }
}
/**
 * Mostly to help tests: this method registers *and* initializes the provided component in one go.
 * @param componentName
 * @param component
 */
function only(componentName, component) {
    const componentInfo = addToComponentRegistry(componentName, component);
    register(componentInfo, componentHasConnected, childrenChanged, componentHasDisconnected);
    componentStaticInitialize(componentInfo.componentName, componentInfo.registeredComponent);
    return componentInfo;
}

const sigDate = new Date(0);
const sigElementRefs = { refs: [] };
const sigEventHandler = () => void 0;
const sigFunction = () => void 0;
function mBool() {
    return false;
}
function mString() {
    return "";
}
function mNumber() {
    return 0;
}
function mChild() {
    return { __childCollection: true, elements: [] };
}
function mDate() {
    return sigDate;
}
function mRef() {
    return sigElementRefs;
}
function mEventHandler() {
    return sigEventHandler;
}
function mFunction() {
    return sigFunction;
}
function mArray() {
    return [];
}
function mObj() {
    return null;
}
function m(v) {
    return Object.assign(Object.assign({}, v), { __typed: true });
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Declares a module consisting of the provided registered components. Modules will later be registered by calling
 * start with the list of modules. The declaration is global, since web components are globally registered.
 * @see modrn
 *
 * @example
 * const myComponent = makeComponent().html(`<h1>Hello world</h1>`).register();
 * const myModule = declare({myComponent});
 *
 * @param module the Module consisting of registered components to declare
 */
function declare(module) {
    const result = Object.assign(Object.assign({}, module), { dependsOn });
    function dependsOn(...unused) {
        return result;
    }
    registerModule(module);
    return result;
}
/**
 * Creates a component, having a defined set of props (optional) and a render function (also optional). If the render function
 * is omitted, the props are passed directly to the template as variables. If props are omitted, the component does not have any props.
 *
 * The return value is a builder, which allows to further configure the component {@see ComponentBuilder} like for example making the
 * component transparent (i.e. passing all incoming props to the resulting template variables, even if not returned) or declaring
 * the component expects dynamic children (commonly named "slots").
 *
 * @param propsType - The expected props (optional)
 * @param renderFn - The render function (optional)
 */
function makeComponent(propsType, renderFn) {
    const result = { html, register, transparent, dynamicChildren, withFilters };
    let htmlTemplate;
    let isTransparent = false;
    let hasDynamicChildren = false;
    let filters = {};
    function html(htmlText) {
        htmlTemplate = htmlText;
        return result;
    }
    function transparent() {
        isTransparent = true;
        return result;
    }
    function dynamicChildren() {
        hasDynamicChildren = true;
        return result;
    }
    function withFilters(filtersProvided) {
        filters = Object.assign(Object.assign({}, filters), filtersProvided);
        return result;
    }
    function register() {
        return {
            transparent: isTransparent,
            dynamicChildren: hasDynamicChildren,
            propTemplate: (propsType || m({})),
            renderFunction: renderFn || (() => null),
            filters,
            htmlTemplate
        };
    }
    return result;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
function extract(from, name, full) {
    return full.val;
}
function replaceWith(val) {
    return { full: true, val };
}
function immodify(on, modifier) {
    const result = Object.assign(Object.assign({}, on), modifier);
    Object.entries(modifier).forEach(([name, val]) => {
        var _a;
        const tname = name;
        if (val !== null && typeof val === "object" && !Array.isArray(val)) {
            if ((_a = val) === null || _a === void 0 ? void 0 : _a.full) {
                result[tname] = extract(on, tname, val);
            }
            else if (val) {
                result[tname] = immodify(on[tname], val);
            }
        }
    });
    return result;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
function createState(prefix) {
    return { id: (prefix || "") + nextId(), dummy: null };
}
function clone(initial) {
    if (typeof initial === "object") {
        return Object.assign({}, initial);
    }
    return initial;
}
function getOrCreateElementAttachedState(prefix, element) {
    if (!element.id) {
        element.id = nextId();
    }
    return { id: `${prefix || ""}#${element.id}`, dummy: null };
}
function getOrCreateTokenAttachedState(prefix, otherTokenProvided) {
    const otherToken = otherTokenProvided;
    const attachments = otherToken.__attachments || (otherToken.__attachments = {});
    if (prefix in attachments) {
        return attachments[prefix];
    }
    else {
        const result = { id: `${prefix || ""}${nextId()}-${otherToken.id}`, dummy: null };
        attachments[prefix] = result;
        return result;
    }
}
function useStateInternal(token, context, initial) {
    const currentState = context.state[token.id];
    function update(newState, silent) {
        if (!silent) {
            context.update();
        }
        context.state[token.id] = newState;
        return newState;
    }
    if (!currentState) {
        const data = (typeof initial === "function") ? initial() : initial;
        const result = context.state[token.id] = clone(data);
        return [clone(result), update];
    }
    return [clone(currentState), update];
}
function getStateInternal(token, context) {
    const currentState = context.state[token.id];
    if (!currentState) {
        throw new Error("State not yet initialized (useState missing?)");
    }
    function update(newState, silent) {
        if (!silent) {
            context.update();
        }
        context.state[token.id] = newState;
        return newState;
    }
    return [clone(currentState), update];
}
function mutableStateInternal(token, context) {
    const state = context.state[token.id];
    if (!state) {
        throw new Error("State not yet initialized (useState missing?)");
    }
    return [state, () => {
            Object.values(state).forEach(val => markChanged(val));
            context.update();
        }];
}
function purifyInternal(context, token, fn) {
    function update(newState, silent) {
        context.state[token.id] = newState;
        if (!silent) {
            Object.values(newState).forEach(value => (typeof value === "object" && value !== null) && markChanged(value));
            context.update();
        }
    }
    function pureWrapper(...rest) {
        const currentState = context.state[token.id];
        const [state, setState] = [Object.assign({}, currentState), update];
        const result = fn(state, ...rest);
        result && setState(immodify(state, result));
    }
    const wrapped = pureWrapper;
    wrapped.stateContext = new WeakRef(context);
    wrapped.stateId = token.id;
    return wrapped;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Returns the state associated with the provided stateToken {@see createState}. If the state wasn't initialized yet,
 * it will be initialized first. The initial value may be either an object or a function returning an object of type T.
 *
 * @param token - the state token {@see createState}
 * @param initial - the initial value
 */
function useState(token, initial) {
    const state = getCurrentStateContext();
    return useStateInternal(token, state, initial);
}
/**
 * Similar to useState, but requires the state to be already initialized
 * @param token - the state token {@see createState}
 */
function getState(token) {
    const state = getCurrentStateContext();
    return getStateInternal(token, state);
}
/**
 * Returns a mutable view of the state of the provided token.
 * @param token - the state token {@see createState}
 */
function mutableState(token) {
    const state = getCurrentStateContext();
    return mutableStateInternal(token, state);
}
/**
 * Produces a state-bound function with up to 4 additional parameters aside from the 1st (which is always the current state).
 *
 * The method may return undefined if it doesn't alter the state, or it may return a Partial<T> of the state. Only keys being part of the
 * partial result will be updated, the rest will stay in place.
 *
 * The return value of purify is the state-bound function.
 *
 * @param token - the state token {@see createState}
 * @param fn - the function to bind the state to
 */
function purify(token, fn) {
    const state = getCurrentStateContext();
    return purifyInternal(state, token, fn);
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * This is the main function of the children handling. There are other variants following in this file, but this is the
 * central function.
 *
 * The basic process is to store the previously existing children in a state, and to compare each render cycle if props,
 * template or number of children change, and if so, to re-render those accordingly.
 *
 * @param stateToken
 * @param items
 * @param configFn
 * @param templateIfMissing
 */
function useTemplatedChildren(stateToken, items, configFn, templateIfMissing) {
    const { previousChild, getOwner } = getCurrentStateContext();
    const [childrenByKey, setChildrenByKey] = useState(stateToken, {});
    const baseTemplate = templateIfMissing || previousChild;
    const result = { elements: [], __childCollection: true };
    const usedChildrenKeys = {};
    const length = items.length;
    let madeChanges = Object.keys(childrenByKey).length !== length;
    /** Iterate over the item list - each element of items[] produces one child */
    for (let index = 0; index < length; ++index) {
        // Get the configuration for this specific item (i.e. collection key, template, props)
        const configuration = configFn(items[index], index);
        const template = configuration.template || baseTemplate;
        if (!(template === null || template === void 0 ? void 0 : template.childElement)) {
            throw new Error(`No template for child #${index}, key ${configuration.key}`);
        }
        // Mark this key as being used
        usedChildrenKeys[configuration.key] = true;
        const oldChild = childrenByKey[configuration.key];
        const oldChildTemplateId = oldChild && getTemplateId(oldChild.child);
        const newChildTemplateId = getTemplateId(template.childElement);
        // Compare with old child's props (having the same collection key). If equal by reference and template did not change, skip this child
        if (oldChild &&
            ((oldChild.props === configuration.props && !configuration.forceUpdate)
                && (oldChildTemplateId === newChildTemplateId))) {
            result.elements.push(oldChild.child);
            continue;
        }
        madeChanges = true;
        let childToApplyPropsOn;
        let suppress = false;
        // Has the template changed? then create new clone, otherwise apply the props on the existing child
        if (oldChildTemplateId !== newChildTemplateId) {
            childToApplyPropsOn = cloneDeep(template.childElement);
            suppress = true;
        }
        else {
            childToApplyPropsOn = oldChild.child;
        }
        // Apply variables on the child
        if (!template.variableDefinitions) {
            // This branch is taken if the child is a direct ModrnHTMLElement child; its props are provided directly and need no mapping
            if (childToApplyPropsOn instanceof ModrnHTMLElement) {
                if (childToApplyPropsOn.state) {
                    childToApplyPropsOn.state.customProps = configuration.props;
                }
                else {
                    childToApplyPropsOn.initialCustomProps = configuration.props;
                }
            }
            else {
                throw new Error(`No variable definitions for child #${index}, key ${configuration.key} in template`);
            }
        }
        else {
            // This branch is taken for a html template based child - apply regular variable substition
            substituteVariables(getOwner(), childToApplyPropsOn, configuration.props, template.variableDefinitions, suppress);
        }
        // Add the modified child to the result
        result.elements.push(childToApplyPropsOn);
        childrenByKey[configuration.key] = {
            child: childToApplyPropsOn,
            props: configuration.props,
            childKey: configuration.key
        };
    }
    if (madeChanges) {
        const previousKeys = Object.keys(childrenByKey);
        for (const previousKey of previousKeys) {
            if (!usedChildrenKeys[previousKey]) {
                delete childrenByKey[previousKey];
            }
        }
        setChildrenByKey(childrenByKey, true);
    }
    return result;
}
function getTemplateId(child) {
    const existingTemplateId = child.getAttribute("template-id");
    if (!existingTemplateId) {
        const templateId = nextId();
        child.setAttribute("template-id", templateId);
        return templateId;
    }
    return existingTemplateId;
}
function createChildrenState() {
    return createState();
}
function createTemplatedChildrenState() {
    return createState();
}
const defaultChildrenState = createChildrenState();
const defaultTemplatedChildrenState = createTemplatedChildrenState();
const htmlTemplateMap = new WeakMap();
const stringTemplateMap = {};
function createTemplateFromString(source) {
    const element = document.createElement("div");
    element.style.display = "contents";
    element.innerHTML = source;
    return analyzeToFragment(element);
}
function createTemplateFromHTMLElement(source) {
    return analyzeToFragment(source);
}
function resolveIdReferenceIfApplicable(sourceProvided) {
    var _a, _b, _c;
    let source = sourceProvided;
    if (typeof source === "string" && source.startsWith("#")) {
        const root = getCurrentStateContext().getOwner();
        const found = ((_c = (_b = (_a = root.componentInfo) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.childElement) === null || _c === void 0 ? void 0 : _c.querySelector(source))
            || document.getElementById(source);
        if (found instanceof HTMLTemplateElement) {
            source = found.innerHTML;
        }
        else if (found instanceof HTMLElement) {
            source = found;
        }
        else {
            throw new Error(`Invalid source ${source} from provided source ${sourceProvided}`);
        }
    }
    return source;
}
function useTemplate(sourceProvided, childProps, childStateToken = defaultChildrenState) {
    var _a, _b, _c, _d, _e;
    if (sourceProvided.htmlTemplate) {
        return useModrnChild(childStateToken, sourceProvided, childProps || {});
    }
    const childrenState = useState(defaultTemplatedChildrenState, { source: "" });
    let state = childrenState[0];
    const setState = childrenState[1];
    let source = resolveIdReferenceIfApplicable(sourceProvided);
    if (source !== state.source) {
        if (typeof source === "string") {
            if (source.startsWith("#")) {
                const byId = (_e = (_d = (_c = (_b = (_a = getCurrentStateContext()) === null || _a === void 0 ? void 0 : _a.getOwner()) === null || _b === void 0 ? void 0 : _b.componentInfo) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.childElement) === null || _e === void 0 ? void 0 : _e.querySelector(source);
                if (byId instanceof HTMLElement) {
                    source = byId.innerHTML;
                }
                else {
                    throw new Error(`Couldn't find template by selector ${source} on element ${sourceProvided}`);
                }
            }
            const template = stringTemplateMap[source] || (stringTemplateMap[source] = createTemplateFromString(source));
            state = setState(Object.assign(Object.assign({}, state), { template }), true);
        }
        else {
            let template = htmlTemplateMap.get(source);
            if (!template) {
                template = createTemplateFromHTMLElement(source);
                template && htmlTemplateMap.set(source, template);
            }
            else {
                state = setState(Object.assign(Object.assign({}, state), { template }), true);
            }
        }
    }
    return useTemplatedChildren(childStateToken, childProps ? [null] : [], () => ({
        key: "__1",
        props: childProps || {},
        template: state.template
    }));
}
function useChild(childProps, childStateToken = defaultChildrenState) {
    const { previousChild } = getCurrentStateContext();
    return useTemplatedChildren(childStateToken, (previousChild && childProps) ? [null] : [], () => ({
        key: "__1",
        props: childProps || {}
    }));
}
function useModrnChild(childStateToken, component, props) {
    var _a;
    const constructor = (_a = getComponentInfoOf(component)) === null || _a === void 0 ? void 0 : _a.registeredComponent.customElementConstructor;
    if (!props || !constructor) {
        return useTemplatedChildren(childStateToken, [], () => ({ key: "__1", props: {} }));
    }
    const template = new constructor();
    return useTemplatedChildren(childStateToken, [null], () => {
        return {
            key: "__1",
            props,
            template: {
                childElement: template,
                variableDefinitions: null
            }
        };
    });
}
function useModrnChildren(childStateToken, component, props) {
    var _a;
    const fragment = (_a = getComponentInfoOf(component)) === null || _a === void 0 ? void 0 : _a.content;
    if (!props || !fragment) {
        return useTemplatedChildren(childStateToken, [], () => ({ key: "__1", props: {} }));
    }
    return useTemplatedChildren(childStateToken, props, (data, index) => {
        return {
            key: "" + index,
            props: data,
            template: fragment
        };
    });
}
const useChildrenState = createChildrenState();
function useChildren(iterateOver, basicChildProps, itemAs = "item", indexAs = "index", childStateToken = useChildrenState) {
    return useTemplatedChildren(childStateToken, iterateOver, (item, index) => ({
        key: "" + index,
        props: Object.assign(Object.assign({}, basicChildProps), { [itemAs]: item, [indexAs]: index })
    }));
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
const IF_PRECEDENCE = -2;
const ifComponent = makeComponent(m({ "mIf": mBool() }), props => {
    const vars = props.allProps();
    const child = useChild(props["mIf"] ? varsWithOptions(vars, { hideByDefault: true }) : null);
    return { child };
}).html(`{{child}}`).transparent().register();
only("modrn-if", ifComponent).isSpecialAttribute = true;
registerSpecialAttribute("m-if", ifSpecialAttributeHandler, IF_PRECEDENCE);
function ifSpecialAttributeHandler() {
    if (!ifComponent.customElementConstructor) {
        throw new Error("Constructor missing for if component");
    }
    return {
        transformedElement: new ifComponent.customElementConstructor()
    };
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
const FOR_PRECEDENCE = -1;
const AS_PRECEDENCE = -100;
const forComponent = makeComponent(m({ mFor: mArray(), mAs: mObj(), mIndexAs: mObj() }), (_a) => {
    var { mFor, mAs, mIndexAs } = _a, rest = __rest(_a, ["mFor", "mAs", "mIndexAs"]);
    const allProps = Object.assign({}, rest.allProps());
    delete allProps.mFor;
    delete allProps.mAs;
    delete allProps.mIndexAs;
    const children = useChildren(mFor || [], allProps, (mAs && mAs["m-as"]) || "item", (mIndexAs && mIndexAs["m-index-as"]) || "index");
    return { children };
}).html(`{{children}}`).transparent().register();
only("modrn-for", forComponent).isSpecialAttribute = true;
registerSpecialAttribute("m-for", forSpecialAttributeHandler, FOR_PRECEDENCE);
registerSpecialAttribute("m-as", asSpecialAttributeHandler, AS_PRECEDENCE);
registerSpecialAttribute("m-index-as", asSpecialAttributeHandler, AS_PRECEDENCE);
function forSpecialAttributeHandler() {
    if (!forComponent.customElementConstructor) {
        throw new Error("Constructor missing for 'for' component");
    }
    return {
        transformedElement: new forComponent.customElementConstructor()
    };
}
function asSpecialAttributeHandler() {
    return {
        valueTransformer: (element, value) => value
    };
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
registerSpecialAttribute("m-class", classSpecialAttributeHandler).hidden = true;
function classSpecialAttributeHandler() {
    function valueTransformer(elem, valueMap) {
        const value = valueMap["m-class"];
        if (!value) {
            elem.className = "";
            return undefined;
        }
        if (typeof value === "string") {
            elem.className = value;
            return undefined;
        }
        else if (Array.isArray(value)) {
            elem.className = value.filter(value => !!value).join(" ");
            return undefined;
        }
        throw new Error(`Cannot map ${value} to class names`);
    }
    return {
        valueTransformer
    };
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
registerSpecialAttribute("m-show", showSpecialAttributeHandler).hidden = true;
function showSpecialAttributeHandler() {
    function valueTransformer(elem, value) {
        if (value["m-show"] === "false" || !value["m-show"]) {
            elem.style.display = "none";
        }
        else {
            elem.style.display = "";
        }
        return undefined;
    }
    return {
        valueTransformer
    };
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
const disconnectState = createState();
function useDisconnect(fn) {
    const [state, setState] = useState(disconnectState, { hasHooked: false });
    if (!state.hasHooked) {
        getCurrentStateContext().disconnected.push(bindToStateContext(fn));
        setState({ hasHooked: true }, true);
    }
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
registerSpecialAttribute("m-autofocus", autofocusSpecialAttributeHandler, 1000000).hidden = true;
function autofocusSpecialAttributeHandler() {
    function setFocus(weakRef) {
        const elem = weakRef.deref();
        if (elem) {
            if (elem.offsetParent) {
                elem.focus();
            }
            else {
                setTimeout(() => setFocus(weakRef));
            }
        }
    }
    function valueTransformer(elem, value) {
        const focusState = getOrCreateElementAttachedState("autofocus-special-attribute", elem);
        const [state, setState] = useState(focusState, { hasGrabbed: false });
        useDisconnect(() => setState({ hasGrabbed: false }));
        const focusRequested = value["m-autofocus"];
        if (!state.hasGrabbed && focusRequested) {
            const weakRef = new WeakRef(elem);
            setFocus(weakRef);
            setState({ hasGrabbed: true }, true);
        }
        else if (state.hasGrabbed && !focusRequested) {
            setState({ hasGrabbed: false }, true);
        }
        if (focusRequested) {
            elem.setAttribute("m-autofocus", "");
        }
        else {
            elem.removeAttribute("m-autofocus");
        }
        return undefined;
    }
    return {
        valueTransformer
    };
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Creates a change hook. depth specifies the maximum recursion depth to compare the two objects
 * @param depth - maximum recursion depth
 */
function createChangeHook(depth = 0) {
    return Object.assign(Object.assign({}, createState()), { depth });
}
/**
 * Gets or creates an element-attached change hook-
 * @param prefix - the prefix to disambiguate multiple attached states on the same element
 * @param element - the element to attach the state to
 * @param depth - maximum recusrion depth
 */
function getOrCreateElementAttachedChangeHook(prefix, element, depth = 0) {
    return Object.assign(Object.assign({}, getOrCreateElementAttachedState(prefix, element)), { depth });
}
/**
 * Gets or creates a change hook attached on another state
 * @param prefix - the prefix to disambiguate multiple attached states on the same element
 * @param otherToken - the other state to attach this change hook to
 * @param depth - maximum recusrion depth
 */
function getOrCreateTokenAttachedChangeHook(prefix, otherToken, depth = 0) {
    return Object.assign(Object.assign({}, getOrCreateTokenAttachedState(prefix, otherToken)), { depth });
}
/**
 * Tracks changes to the provided value, which must be not null. Change is detected recursively up to the depth when
 * creating the state token.
 * @see createChangeHook
 * @see getOrCreateElementAttachedChangeHook
 *
 * @param stateToken
 * @param value
 * @param changeHandlerFn
 */
function useChange(stateToken, value, changeHandlerFn) {
    const [state, setState] = useState(stateToken, { previous: value, initial: true });
    const previous = state.previous;
    let changed = false;
    // Do not trigger change on initialization
    if (state.initial) {
        setState(Object.assign(Object.assign({}, state), { initial: false }), true);
    }
    else {
        if (Array.isArray(value)) {
            if (!Array.isArray(previous)) {
                throw new Error("Array must not change type");
            }
            const previousArr = previous;
            const nowArr = value;
            changed = hasArrayChanged(previousArr, nowArr, stateToken.depth);
            if (changed) {
                setState({ previous: [...nowArr], initial: false }, true);
            }
        }
        else if (typeof value !== "object") {
            if (previous === "object") {
                throw new Error("Value must not change from object to primitive");
            }
            changed = value !== previous;
            if (changed) {
                setState({ previous: value, initial: false }, true);
            }
        }
        else if (typeof value === "object") {
            if (typeof previous !== "object") {
                throw new Error("Value must not change from primitive to object");
            }
            changed = hasObjectChanged(previous, value, stateToken.depth);
            if (changed) {
                setState({ previous: Object.assign({}, value), initial: false }, true);
            }
        }
        else if (typeof value !== typeof previous) {
            if (changed) {
                setState({ previous: value, initial: false }, true);
            }
        }
    }
    if (changed && changeHandlerFn) {
        changeHandlerFn(value, previous);
    }
    return changed;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
registerSpecialAttribute("m-keyup", keyupSpecialAttributeHandler, 1000000).hidden = true;
function keyupSpecialAttributeHandler() {
    function valueTransformer(elem, value) {
        const attachState = getOrCreateElementAttachedState("keyup-special-handler-as", elem);
        const changeState = getOrCreateElementAttachedChangeHook("keyup-special-handler-cs", elem, 1);
        const [state, setState] = useState(attachState, { hasAttached: false });
        function eventListener(evt) {
            const action = value[evt.code] || value[evt.key] || value[""];
            if (typeof action === "function") {
                const theEvt = Object.assign({}, evt);
                setTimeout(() => action(theEvt));
            }
            else if (action) {
                logWarn(`Not a function: ${action} for key/code ${evt.key}/${evt.code}`);
            }
        }
        if (useChange(changeState, value) || !state.hasAttached) {
            if (state.oldEventListener) {
                elem.removeEventListener("keyup", state.oldEventListener);
            }
            elem.addEventListener("keyup", eventListener);
            setState({ hasAttached: true, oldEventListener: eventListener }, true);
        }
        useDisconnect(() => {
            if (state.oldEventListener) {
                elem.removeEventListener("keyup", state.oldEventListener);
            }
            setState({ hasAttached: false }, true);
        });
        return undefined;
    }
    function remapAttributeName(attributeName) {
        const indexOfColon = attributeName.indexOf(":");
        if (indexOfColon >= 0) {
            const keyOrKeycode = attributeName.substring(indexOfColon + 1).toLowerCase();
            const result = keys[keyOrKeycode] || keyCodes[keyOrKeycode];
            if (!result) {
                throw new Error(`Unknown key or keycode ${keyOrKeycode}`);
            }
            return result;
        }
        return "";
    }
    return {
        valueTransformer,
        remapAttributeName
    };
}
const keyCodes = {
    "space": " ",
    "backspace": "Backspace",
    "tab": "Tab",
    "enter": "Enter",
    "shiftleft": "ShiftLeft",
    "shiftright": "ShiftRight",
    "controlleft": "ControlLeft",
    "controlright": "ControlRight",
    "altleft": "AltLeft",
    "altright": "AltRight",
    "pause": "Pause",
    "capslock": "CapsLock",
    "escape": "Escape",
    "pageup": "PageUp",
    "pagedown": "PageDown",
    "end": "End",
    "home": "Home",
    "arrowleft": "ArrowLeft",
    "arrowup": "ArrowUp",
    "arrowright": "ArrowRight",
    "arrowdown": "ArrowDown",
    "printscreen": "PrintScreen",
    "insert": "Insert",
    "delete": "Delete",
    "keya": "KeyA",
    "keyb": "KeyB",
    "keyc": "KeyC",
    "keyd": "KeyD",
    "keye": "KeyE",
    "keyf": "KeyF",
    "keyg": "KeyG",
    "keyh": "KeyH",
    "keyi": "KeyI",
    "keyj": "KeyJ",
    "keyk": "KeyK",
    "keyl": "KeyL",
    "keym": "KeyM",
    "keyn": "KeyN",
    "keyo": "KeyO",
    "keyp": "KeyP",
    "keyq": "KeyQ",
    "keyr": "KeyR",
    "keys": "KeyS",
    "keyt": "KeyT",
    "keyu": "KeyU",
    "keyv": "KeyV",
    "keyw": "KeyW",
    "keyx": "KeyX",
    "keyy": "KeyY",
    "keyz": "KeyZ",
    "metaleft": "MetaLeft",
    "metaright": "MetaRight",
    "contextmenu": "ContextMenu",
    "f1": "F1",
    "f2": "F2",
    "f3": "F3",
    "f4": "F4",
    "f5": "F5",
    "f6": "F6",
    "f7": "F7",
    "f8": "F8",
    "f9": "F9",
    "f10": "F10",
    "f11": "F11",
    "f12": "F12",
    "numlock": "NumLock",
    "scrolllock": "ScrollLock",
    "digit0": "Digit0",
    "digit1": "Digit1",
    "digit2": "Digit2",
    "digit3": "Digit3",
    "digit4": "Digit4",
    "digit5": "Digit5",
    "digit6": "Digit6",
    "digit7": "Digit7",
    "digit8": "Digit8",
    "digit9": "Digit9",
    "numpad0": "Numpad0",
    "numpad1": "Numpad1",
    "numpad2": "Numpad2",
    "numpad3": "Numpad3",
    "numpad4": "Numpad4",
    "numpad5": "Numpad5",
    "numpad6": "Numpad6",
    "numpad7": "Numpad7",
    "numpad8": "Numpad8",
    "numpad9": "Numpad9",
    "numpadmultiply": "NumpadMultiply",
    "numpadadd": "NumpadAdd",
    "numpadsubtract": "NumpadSubtract",
    "numpaddecimal": "NumpadDecimal",
    "numpaddivide": "NumpadDivide",
    "audiovolumemute": "AudioVolumeMute",
    "audiovolumedown": "AudioVolumeDown",
    "audiovolumeup": "AudioVolumeUp",
    "launchmediaplayer": "LaunchMediaPlayer",
    "launchapplication1": "LaunchApplication1",
    "launchapplication2": "LaunchApplication2",
    "semicolon": "Semicolon",
    "equal": "Equal",
    "comma": "Comma",
    "minus": "Minus",
    "period": "Period",
    "slash": "Slash",
    "backquote": "Backquote",
    "bracketleft": "BracketLeft",
    "backslash": "Backslash",
    "bracketright": "BracketRight",
    "quote": "Quote",
};
const keys = {
    "backspace": "Backspace",
    "tab": "Tab",
    "enter": "Enter",
    "shift": "Shift",
    "control": "Control",
    "alt": "Alt",
    "pause": "Pause",
    "capslock": "CapsLock",
    "escape": "Escape",
    "space": "Space",
    "pageup": "PageUp",
    "pagedown": "PageDown",
    "end": "End",
    "home": "Home",
    "arrowleft": "ArrowLeft",
    "arrowup": "ArrowUp",
    "arrowright": "ArrowRight",
    "arrowdown": "ArrowDown",
    "printscreen": "PrintScreen",
    "insert": "Insert",
    "delete": "Delete",
    "a": "a",
    "b": "b",
    "c": "c",
    "d": "d",
    "e": "e",
    "f": "f",
    "g": "g",
    "h": "h",
    "i": "i",
    "j": "j",
    "k": "k",
    "l": "l",
    "m": "m",
    "n": "n",
    "o": "o",
    "p": "p",
    "q": "q",
    "r": "r",
    "s": "s",
    "t": "t",
    "u": "u",
    "v": "v",
    "w": "w",
    "x": "x",
    "y": "y",
    "z": "z",
    "meta": "Meta",
    "contextmenu": "ContextMenu",
    "f1": "F1",
    "f2": "F2",
    "f3": "F3",
    "f4": "F4",
    "f5": "F5",
    "f6": "F6",
    "f7": "F7",
    "f8": "F8",
    "f9": "F9",
    "f10": "F10",
    "f11": "F11",
    "f12": "F12",
    "numlock": "NumLock",
    "scrolllock": "ScrollLock",
};

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
makeChangeHandler("m-change", "change");
makeChangeHandler("m-input", "input");
makeChangeHandler("m-blur", "blur");
function makeChangeHandler(attributeName, eventName) {
    function changeSpecialAttributeHandler() {
        function valueTransformer(elem, value) {
            const attachState = getOrCreateElementAttachedState(attributeName + "-attach", elem);
            const changeState = getOrCreateElementAttachedChangeHook(attributeName + "-state", elem, 1);
            const [state, setState] = useState(attachState, { hasAttached: false });
            function eventListener(evt) {
                var _a;
                const action = value[""];
                if (typeof action === "function") {
                    action((_a = evt === null || evt === void 0 ? void 0 : evt.target) === null || _a === void 0 ? void 0 : _a.value, evt);
                }
                else if (action) {
                    logWarn(`Not a function: ${action}`);
                }
            }
            if (useChange(changeState, value) || !state.hasAttached) {
                if (state.oldEventListener) {
                    elem.removeEventListener(eventName, state.oldEventListener);
                }
                elem.addEventListener(eventName, eventListener);
                setState({ hasAttached: true, oldEventListener: eventListener }, true);
            }
            useDisconnect(() => {
                if (state.oldEventListener) {
                    elem.removeEventListener(eventName, state.oldEventListener);
                }
                setState({ hasAttached: false }, true);
            });
            return undefined;
        }
        function remapAttributeName(attributeName) {
            const indexOfColon = attributeName.indexOf(":");
            if (indexOfColon >= 0) {
                throw new Error(`No specialization possible for ${attributeName} attribute`);
            }
            return "";
        }
        return {
            valueTransformer,
            remapAttributeName
        };
    }
    const result = registerSpecialAttribute(attributeName, changeSpecialAttributeHandler, 1000000);
    result.hidden = true;
    return result;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
/**
 * Perform the global initialization of all components contained in the provided module list.
 * This creates a custom element (aka web component) for each of them.
 *
 * @param modules
 */
function modrn(...modules) {
    registerAll(componentHasConnected, childrenChanged, componentHasDisconnected);
    initializeAll(getComponentRegistry());
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
function createEventListener() {
    return createState();
}
function useEventListener(token, on, type, listener) {
    const [state] = useState(token, () => {
        const listener1 = bindToStateContext(listener.bind(on));
        on.addEventListener(type, listener1);
        return {
            listener: listener1
        };
    });
    useDisconnect(() => {
        on.removeEventListener(type, state.listener);
    });
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
function checkIsShown(firstElementChild) {
    let elem = firstElementChild;
    while ((elem === null || elem === void 0 ? void 0 : elem.style.display) === "contents") {
        elem = elem.firstElementChild;
        if (!elem) {
            return false;
        }
    }
    return elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
const frameUpdateQueue = [];
let alreadyRendered = new WeakSet();
function requestFrameUpdate(callback) {
    frameUpdateQueue.push(callback);
    requestUpdate();
}
function render(element) {
    if (alreadyRendered.has(element)) {
        return;
    }
    alreadyRendered.add(element);
    logDiagnostic("Rendering: ", element.nodeName + "#" + element.id);
    renderComponent(element);
}
function justRender() {
    alreadyRendered = new WeakSet();
    const toRender = getAndResetRenderQueue();
    const elementsToRender = toRender.map(item => item.element.deref()).filter(item => item !== undefined);
    elementsToRender.forEach(element => render(element)); // eslint-disable-line
}
function renderElements() {
    cancelUpdate();
    const frameUpdate = [...frameUpdateQueue];
    frameUpdateQueue.splice(0, frameUpdate.length);
    frameUpdate.forEach(callback => callback());
    let count = 0;
    while (getRenderQueueLength() > 0) {
        justRender();
        if ((count++) > 10) {
            logWarn("Renderqueue not empty after 10 retries");
        }
    }
    clearTainted();
}
setFrameRequestCallback(renderElements);

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
function getRefId(child) {
    const existingRefId = child.getAttribute("ref-id");
    if (!existingRefId) {
        const refId = nextId();
        child.setAttribute("ref-id", refId);
        return refId;
    }
    return existingRefId;
}
function createRef() {
    return createState();
}
/**
 * Create a ref given the state token. Refs are always lists of elements which are returned from the rendering function
 * and which are recognized by the variable substitution process by updating the ref'ed elements then on the fly.
 * That means that to have access to refs, another render cycle needs to follow. The variable substitution process
 * informs the ref container by calling 'addRef' or 'update' on it.
 *
 * All refs are held as WeakRef; this should avoid garbage collection load. Refs are also checked for dom-containment,
 * so if a ref is not in the dom anymore, the ref is automatically dropped.
 *
 * @param stateToken
 */
function useRef(stateToken) {
    const [currentRefState] = useState(stateToken, { refs: {} });
    const update = getCurrentStateContext().update;
    function addRef(htmlElement) {
        const refId = getRefId(htmlElement);
        if (!currentRefState.refs[refId]) {
            currentRefState.refs[refId] = new WeakRef(htmlElement);
            update();
        }
    }
    const allRefs = Object.entries(currentRefState.refs);
    function checkForRemovedRefs() {
        let result = false;
        allRefs.forEach(([refId, elemRef]) => {
            const elem = elemRef.deref();
            if (!elem || !checkIsShown(elem)) {
                delete currentRefState.refs[refId];
                result = true;
            }
        });
        if (result) {
            update();
        }
    }
    requestFrameUpdate(checkForRemovedRefs);
    const results = [];
    allRefs.forEach(([refId, elemRef]) => {
        const elem = elemRef.deref();
        if (!elem || !checkIsShown(elem)) {
            delete currentRefState.refs[refId];
        }
        else {
            results.push(elem);
        }
    });
    const resultInternal = results;
    resultInternal.__addRef = addRef;
    resultInternal.__update = update;
    return resultInternal;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
function useStateChange(stateToken, changeHandler, depth = 0) {
    const stateChangeToken = getOrCreateTokenAttachedChangeHook("stateChange", stateToken, depth);
    const [currentState] = getState(stateToken);
    useChange(stateChangeToken, currentState, changeHandler);
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
function useLocalStorageState(token, initial, localStorageKey, depth = -1) {
    function readFromLocalStorage() {
        try {
            const item = localStorage.getItem(localStorageKey);
            return item ? JSON.parse(item) : null;
        }
        catch (e) {
            logWarn(`Read from local storage for key ${localStorageKey} failed`, e);
            return null;
        }
    }
    function saveToLocalStorage(item) {
        try {
            localStorage.setItem(localStorageKey, JSON.stringify(item));
        }
        catch (e) {
            logWarn(`Write to local storage for key ${localStorageKey} failed`, e, item);
        }
    }
    const result = useState(token, () => {
        const result = readFromLocalStorage();
        if (result) {
            return result;
        }
        if (typeof initial === "function") {
            return initial();
        }
        else {
            return initial;
        }
    });
    useStateChange(token, saveToLocalStorage, depth);
    return result;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
const NoProps = m({});

export { ExpressionType, MappingType, ModrnHTMLElement, NoProps, addToComponentRegistry, analyzeToFragment, bindToStateContext, cancelUpdate, childrenChanged, clearTainted, cloneDeep, componentHasConnected, componentHasDisconnected, componentStaticInitialize, createChangeHook, createChildrenState, createEventListener, createRef, createState, createTemplatedChildrenState, declare, dynamic, getAndResetComponentsToRegister, getAndResetRenderQueue, getComponentInfoOf, getComponentRegistry, getCurrentStateContext, getOrCreateElementAttachedChangeHook, getOrCreateElementAttachedState, getOrCreateTokenAttachedChangeHook, getOrCreateTokenAttachedState, getRenderQueueLength, getState, getStateInternal, getStateOf, hasArrayChanged, hasChanged, hasObjectChanged, immodify, initializeAll, isRegisteredTagName, isTainted, isTestingModeActive, logDiagnostic, logWarn, m, mArray, mBool, mChild, mDate, mEventHandler, mFunction, mNumber, mObj, mRef, mString, makeComponent, markChanged, modrn, mutableState, mutableStateInternal, only, purify, purifyInternal, register, registerAll, registerModule, replaceWith, requestRender, requestUpdate, setFrameRequestCallback, setStaticInitializationResultForComponent, setTestingModeActive, sigDate, sigElementRefs, sigEventHandler, sigFunction, substituteVariables, useChange, useChild, useChildren, useDisconnect, useEventListener, useLocalStorageState, useModrnChild, useModrnChildren, useRef, useState, useStateInternal, useTemplate, useTemplatedChildren, varsWithOptions, withState };

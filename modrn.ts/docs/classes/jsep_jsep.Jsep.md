[modrn](../README.md) / [Exports](../modules.md) / [jsep/jsep](../modules/jsep_jsep.md) / Jsep

# Class: Jsep

[jsep/jsep](../modules/jsep_jsep.md).Jsep

## Table of contents

### Constructors

- [constructor](jsep_jsep.Jsep.md#constructor)

### Properties

- [expr](jsep_jsep.Jsep.md#expr)
- [index](jsep_jsep.Jsep.md#index)
- [ARRAY\_EXP](jsep_jsep.Jsep.md#array_exp)
- [BINARY\_EXP](jsep_jsep.Jsep.md#binary_exp)
- [CALL\_EXP](jsep_jsep.Jsep.md#call_exp)
- [CBRACK\_CODE](jsep_jsep.Jsep.md#cbrack_code)
- [COLON\_CODE](jsep_jsep.Jsep.md#colon_code)
- [COMMA\_CODE](jsep_jsep.Jsep.md#comma_code)
- [COMPOUND](jsep_jsep.Jsep.md#compound)
- [CONDITIONAL\_EXP](jsep_jsep.Jsep.md#conditional_exp)
- [CPAREN\_CODE](jsep_jsep.Jsep.md#cparen_code)
- [CR\_CODE](jsep_jsep.Jsep.md#cr_code)
- [DQUOTE\_CODE](jsep_jsep.Jsep.md#dquote_code)
- [IDENTIFIER](jsep_jsep.Jsep.md#identifier)
- [LF\_CODE](jsep_jsep.Jsep.md#lf_code)
- [LITERAL](jsep_jsep.Jsep.md#literal)
- [MEMBER\_EXP](jsep_jsep.Jsep.md#member_exp)
- [OBRACK\_CODE](jsep_jsep.Jsep.md#obrack_code)
- [OPAREN\_CODE](jsep_jsep.Jsep.md#oparen_code)
- [PERIOD\_CODE](jsep_jsep.Jsep.md#period_code)
- [QUMARK\_CODE](jsep_jsep.Jsep.md#qumark_code)
- [SEMCOL\_CODE](jsep_jsep.Jsep.md#semcol_code)
- [SEQUENCE\_EXP](jsep_jsep.Jsep.md#sequence_exp)
- [SPACE\_CODE](jsep_jsep.Jsep.md#space_code)
- [SQUOTE\_CODE](jsep_jsep.Jsep.md#squote_code)
- [TAB\_CODE](jsep_jsep.Jsep.md#tab_code)
- [THIS\_EXP](jsep_jsep.Jsep.md#this_exp)
- [UNARY\_EXP](jsep_jsep.Jsep.md#unary_exp)
- [additional\_identifier\_chars](jsep_jsep.Jsep.md#additional_identifier_chars)
- [binary\_ops](jsep_jsep.Jsep.md#binary_ops)
- [literals](jsep_jsep.Jsep.md#literals)
- [max\_binop\_len](jsep_jsep.Jsep.md#max_binop_len)
- [max\_unop\_len](jsep_jsep.Jsep.md#max_unop_len)
- [this\_str](jsep_jsep.Jsep.md#this_str)
- [unary\_ops](jsep_jsep.Jsep.md#unary_ops)

### Accessors

- [char](jsep_jsep.Jsep.md#char)
- [code](jsep_jsep.Jsep.md#code)
- [version](jsep_jsep.Jsep.md#version)

### Methods

- [gobbleArguments](jsep_jsep.Jsep.md#gobblearguments)
- [gobbleArray](jsep_jsep.Jsep.md#gobblearray)
- [gobbleBinaryExpression](jsep_jsep.Jsep.md#gobblebinaryexpression)
- [gobbleBinaryOp](jsep_jsep.Jsep.md#gobblebinaryop)
- [gobbleExpression](jsep_jsep.Jsep.md#gobbleexpression)
- [gobbleExpressions](jsep_jsep.Jsep.md#gobbleexpressions)
- [gobbleGroup](jsep_jsep.Jsep.md#gobblegroup)
- [gobbleIdentifier](jsep_jsep.Jsep.md#gobbleidentifier)
- [gobbleNumericLiteral](jsep_jsep.Jsep.md#gobblenumericliteral)
- [gobbleSpaces](jsep_jsep.Jsep.md#gobblespaces)
- [gobbleStringLiteral](jsep_jsep.Jsep.md#gobblestringliteral)
- [gobbleToken](jsep_jsep.Jsep.md#gobbletoken)
- [parse](jsep_jsep.Jsep.md#parse)
- [throwError](jsep_jsep.Jsep.md#throwerror)
- [addBinaryOp](jsep_jsep.Jsep.md#addbinaryop)
- [addIdentifierChar](jsep_jsep.Jsep.md#addidentifierchar)
- [addLiteral](jsep_jsep.Jsep.md#addliteral)
- [addUnaryOp](jsep_jsep.Jsep.md#addunaryop)
- [binaryPrecedence](jsep_jsep.Jsep.md#binaryprecedence)
- [getMaxKeyLen](jsep_jsep.Jsep.md#getmaxkeylen)
- [isDecimalDigit](jsep_jsep.Jsep.md#isdecimaldigit)
- [isIdentifierPart](jsep_jsep.Jsep.md#isidentifierpart)
- [isIdentifierStart](jsep_jsep.Jsep.md#isidentifierstart)
- [parse](jsep_jsep.Jsep.md#parse)
- [removeAllBinaryOps](jsep_jsep.Jsep.md#removeallbinaryops)
- [removeAllLiterals](jsep_jsep.Jsep.md#removeallliterals)
- [removeAllUnaryOps](jsep_jsep.Jsep.md#removeallunaryops)
- [removeBinaryOp](jsep_jsep.Jsep.md#removebinaryop)
- [removeIdentifierChar](jsep_jsep.Jsep.md#removeidentifierchar)
- [removeLiteral](jsep_jsep.Jsep.md#removeliteral)
- [removeUnaryOp](jsep_jsep.Jsep.md#removeunaryop)
- [toString](jsep_jsep.Jsep.md#tostring)

## Constructors

### constructor

• **new Jsep**(`expr`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `expr` | `string` | a string with the passed in express |

#### Defined in

js/source/jsep/jsep.ts:265

## Properties

### expr

• `Private` **expr**: `string`

#### Defined in

js/source/jsep/jsep.ts:100

___

### index

• **index**: `number` = `0`

#### Defined in

js/source/jsep/jsep.ts:101

___

### ARRAY\_EXP

▪ `Static` **ARRAY\_EXP**: `string` = `"ArrayExpression"`

#### Defined in

js/source/jsep/jsep.ts:907

___

### BINARY\_EXP

▪ `Static` **BINARY\_EXP**: `string` = `"BinaryExpression"`

#### Defined in

js/source/jsep/jsep.ts:905

___

### CALL\_EXP

▪ `Static` **CALL\_EXP**: `string` = `"CallExpression"`

#### Defined in

js/source/jsep/jsep.ts:903

___

### CBRACK\_CODE

▪ `Static` **CBRACK\_CODE**: `number` = `93`

#### Defined in

js/source/jsep/jsep.ts:920

___

### COLON\_CODE

▪ `Static` **COLON\_CODE**: `number` = `58`

#### Defined in

js/source/jsep/jsep.ts:923

___

### COMMA\_CODE

▪ `Static` **COMMA\_CODE**: `number` = `44`

#### Defined in

js/source/jsep/jsep.ts:914

___

### COMPOUND

▪ `Static` **COMPOUND**: `string` = `"Compound"`

#### Defined in

js/source/jsep/jsep.ts:897

___

### CONDITIONAL\_EXP

▪ `Static` **CONDITIONAL\_EXP**: `string` = `"ConditionalExpression"`

#### Defined in

js/source/jsep/jsep.ts:906

___

### CPAREN\_CODE

▪ `Static` **CPAREN\_CODE**: `number` = `41`

#### Defined in

js/source/jsep/jsep.ts:918

___

### CR\_CODE

▪ `Static` **CR\_CODE**: `number` = `13`

#### Defined in

js/source/jsep/jsep.ts:911

___

### DQUOTE\_CODE

▪ `Static` **DQUOTE\_CODE**: `number` = `34`

#### Defined in

js/source/jsep/jsep.ts:916

___

### IDENTIFIER

▪ `Static` **IDENTIFIER**: `string` = `"Identifier"`

#### Defined in

js/source/jsep/jsep.ts:899

___

### LF\_CODE

▪ `Static` **LF\_CODE**: `number` = `10`

#### Defined in

js/source/jsep/jsep.ts:910

___

### LITERAL

▪ `Static` **LITERAL**: `string` = `"Literal"`

#### Defined in

js/source/jsep/jsep.ts:901

___

### MEMBER\_EXP

▪ `Static` **MEMBER\_EXP**: `string` = `"MemberExpression"`

#### Defined in

js/source/jsep/jsep.ts:900

___

### OBRACK\_CODE

▪ `Static` **OBRACK\_CODE**: `number` = `91`

#### Defined in

js/source/jsep/jsep.ts:919

___

### OPAREN\_CODE

▪ `Static` **OPAREN\_CODE**: `number` = `40`

#### Defined in

js/source/jsep/jsep.ts:917

___

### PERIOD\_CODE

▪ `Static` **PERIOD\_CODE**: `number` = `46`

#### Defined in

js/source/jsep/jsep.ts:913

___

### QUMARK\_CODE

▪ `Static` **QUMARK\_CODE**: `number` = `63`

#### Defined in

js/source/jsep/jsep.ts:921

___

### SEMCOL\_CODE

▪ `Static` **SEMCOL\_CODE**: `number` = `59`

#### Defined in

js/source/jsep/jsep.ts:922

___

### SEQUENCE\_EXP

▪ `Static` **SEQUENCE\_EXP**: `string` = `"SequenceExpression"`

#### Defined in

js/source/jsep/jsep.ts:898

___

### SPACE\_CODE

▪ `Static` **SPACE\_CODE**: `number` = `32`

#### Defined in

js/source/jsep/jsep.ts:912

___

### SQUOTE\_CODE

▪ `Static` **SQUOTE\_CODE**: `number` = `39`

#### Defined in

js/source/jsep/jsep.ts:915

___

### TAB\_CODE

▪ `Static` **TAB\_CODE**: `number` = `9`

#### Defined in

js/source/jsep/jsep.ts:909

___

### THIS\_EXP

▪ `Static` **THIS\_EXP**: `string` = `"ThisExpression"`

#### Defined in

js/source/jsep/jsep.ts:902

___

### UNARY\_EXP

▪ `Static` **UNARY\_EXP**: `string` = `"UnaryExpression"`

#### Defined in

js/source/jsep/jsep.ts:904

___

### additional\_identifier\_chars

▪ `Static` **additional\_identifier\_chars**: `Set`<`string`\>

#### Defined in

js/source/jsep/jsep.ts:950

___

### binary\_ops

▪ `Static` **binary\_ops**: `Record`<`string`, `number`\>

#### Defined in

js/source/jsep/jsep.ts:940

___

### literals

▪ `Static` **literals**: `Record`<`string`, ``null`` \| `boolean`\>

#### Defined in

js/source/jsep/jsep.ts:955

___

### max\_binop\_len

▪ `Static` **max\_binop\_len**: `number`

#### Defined in

js/source/jsep/jsep.ts:965

___

### max\_unop\_len

▪ `Static` **max\_unop\_len**: `number`

#### Defined in

js/source/jsep/jsep.ts:964

___

### this\_str

▪ `Static` **this\_str**: `string` = `"this"`

#### Defined in

js/source/jsep/jsep.ts:962

___

### unary\_ops

▪ `Static` **unary\_ops**: `Record`<`string`, `number`\>

#### Defined in

js/source/jsep/jsep.ts:930

## Accessors

### char

• `get` **char**(): `string`

#### Returns

`string`

#### Defined in

js/source/jsep/jsep.ts:249

___

### code

• `get` **code**(): `number`

#### Returns

`number`

#### Defined in

js/source/jsep/jsep.ts:256

___

### version

• `Static` `get` **version**(): `string`

#### Returns

`string`

#### Defined in

js/source/jsep/jsep.ts:106

## Methods

### gobbleArguments

▸ **gobbleArguments**(`termination`): (``null`` \| [`Expression`](../interfaces/jsep_jsep.default.Expression.md))[]

Gobbles a list of arguments within the context of a function call
or array literal. This function also assumes that the opening character
`(` or `[` has already been gobbled, and gobbles expressions and commas
until the terminator character `)` or `]` is encountered.
e.g. `foo(bar, baz)`, `my_func()`, or `[bar, baz]`

#### Parameters

| Name | Type |
| :------ | :------ |
| `termination` | `any` |

#### Returns

(``null`` \| [`Expression`](../interfaces/jsep_jsep.default.Expression.md))[]

#### Defined in

js/source/jsep/jsep.ts:804

___

### gobbleArray

▸ **gobbleArray**(): [`ArrayExpression`](../interfaces/jsep_jsep.default.ArrayExpression.md)

Responsible for parsing Array literals `[1, 2, 3]`
This function assumes that it needs to gobble the opening bracket
and then tries to gobble the expressions as arguments.

#### Returns

[`ArrayExpression`](../interfaces/jsep_jsep.default.ArrayExpression.md)

#### Defined in

js/source/jsep/jsep.ts:884

___

### gobbleBinaryExpression

▸ **gobbleBinaryExpression**(): ``false`` \| [`Expression`](../interfaces/jsep_jsep.default.Expression.md)

This function is responsible for gobbling an individual expression,
e.g. `1`, `1+2`, `a+(b*2)-Math.sqrt(2)`

#### Returns

``false`` \| [`Expression`](../interfaces/jsep_jsep.default.Expression.md)

#### Defined in

js/source/jsep/jsep.ts:453

___

### gobbleBinaryOp

▸ **gobbleBinaryOp**(): `string` \| ``false``

Search for the operation portion of the string (e.g. `+`, `===`)
Start by taking the longest possible binary operations (3 characters: `===`, `!==`, `>>>`)
and move down from 3 to 2 to 1 character until a matching binary operation is found
then, return that binary operation

#### Returns

`string` \| ``false``

#### Defined in

js/source/jsep/jsep.ts:427

___

### gobbleExpression

▸ **gobbleExpression**(): [`Expression`](../interfaces/jsep_jsep.default.Expression.md)

The main parsing function.

#### Returns

[`Expression`](../interfaces/jsep_jsep.default.Expression.md)

#### Defined in

js/source/jsep/jsep.ts:411

___

### gobbleExpressions

▸ **gobbleExpressions**(`untilICode`): [`Expression`](../interfaces/jsep_jsep.default.Expression.md)[]

top-level parser (but can be reused within as well)

#### Parameters

| Name | Type |
| :------ | :------ |
| `untilICode` | `number` |

#### Returns

[`Expression`](../interfaces/jsep_jsep.default.Expression.md)[]

#### Defined in

js/source/jsep/jsep.ts:376

___

### gobbleGroup

▸ **gobbleGroup**(): [`Expression`](../interfaces/jsep_jsep.default.Expression.md)

Responsible for parsing a group of things within parentheses `()`
that have no identifier in front (so not a function call)
This function assumes that it needs to gobble the opening parenthesis
and then tries to gobble everything within that parenthesis, assuming
that the next thing it should see is the close parenthesis. If not,
then the expression probably doesn't have a `)`

#### Returns

[`Expression`](../interfaces/jsep_jsep.default.Expression.md)

#### Defined in

js/source/jsep/jsep.ts:862

___

### gobbleIdentifier

▸ **gobbleIdentifier**(): [`Expression`](../interfaces/jsep_jsep.default.Expression.md)

Gobbles only identifiers
e.g.: `foo`, `_value`, `$x1`
Also, this function checks if that identifier is a literal:
(e.g. `true`, `false`, `null`) or `this`

#### Returns

[`Expression`](../interfaces/jsep_jsep.default.Expression.md)

#### Defined in

js/source/jsep/jsep.ts:758

___

### gobbleNumericLiteral

▸ **gobbleNumericLiteral**(): [`Literal`](../interfaces/jsep_jsep.default.Literal.md)

Parse simple numeric literals: `12`, `3.4`, `.5`. Do this by using a string to
keep track of everything in the numeric literal and then calling `parseFloat` on that string

#### Returns

[`Literal`](../interfaces/jsep_jsep.default.Literal.md)

#### Defined in

js/source/jsep/jsep.ts:642

___

### gobbleSpaces

▸ **gobbleSpaces**(): `void`

Push `index` up to the next non-space character

#### Returns

`void`

#### Defined in

js/source/jsep/jsep.ts:343

___

### gobbleStringLiteral

▸ **gobbleStringLiteral**(): [`Literal`](../interfaces/jsep_jsep.default.Literal.md)

Parses a string literal, staring with single or double quotes with basic support for escape codes
e.g. `"hello world"`, `'this is\nJSEP'`

#### Returns

[`Literal`](../interfaces/jsep_jsep.default.Literal.md)

#### Defined in

js/source/jsep/jsep.ts:698

___

### gobbleToken

▸ **gobbleToken**(): ``false`` \| [`Expression`](../interfaces/jsep_jsep.default.Expression.md)

An individual part of a binary expression:
e.g. `foo.bar(baz)`, `1`, `"abc"`, `(a % 2)` (because it's in parenthesis)

#### Returns

``false`` \| [`Expression`](../interfaces/jsep_jsep.default.Expression.md)

#### Defined in

js/source/jsep/jsep.ts:542

___

### parse

▸ **parse**(): [`Expression`](../interfaces/jsep_jsep.default.Expression.md)

Top-level method to parse all expressions and returns compound or single node

#### Returns

[`Expression`](../interfaces/jsep_jsep.default.Expression.md)

#### Defined in

js/source/jsep/jsep.ts:358

___

### throwError

▸ **throwError**(`message`): `void`

throw error at index of the expression

**`throws`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`void`

#### Defined in

js/source/jsep/jsep.ts:332

___

### addBinaryOp

▸ `Static` **addBinaryOp**(`op_name`, `precedence`): typeof [`Jsep`](jsep_jsep.Jsep.md)

**`method`** jsep.addBinaryOp

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `op_name` | `string` | The name of the binary op to add |
| `precedence` | `number` | The precedence of the binary op (can be a float) |

#### Returns

typeof [`Jsep`](jsep_jsep.Jsep.md)

#### Defined in

js/source/jsep/jsep.ts:136

___

### addIdentifierChar

▸ `Static` **addIdentifierChar**(`char`): typeof [`Jsep`](jsep_jsep.Jsep.md)

**`method`** addIdentifierChar

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `char` | `string` | The additional character to treat as a valid part of an identifier |

#### Returns

typeof [`Jsep`](jsep_jsep.Jsep.md)

#### Defined in

js/source/jsep/jsep.ts:147

___

### addLiteral

▸ `Static` **addLiteral**(`literal_name`, `literal_value`): typeof [`Jsep`](jsep_jsep.Jsep.md)

**`method`** addLiteral

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `literal_name` | `string` | The name of the literal to add |
| `literal_value` | `any` | The value of the literal |

#### Returns

typeof [`Jsep`](jsep_jsep.Jsep.md)

#### Defined in

js/source/jsep/jsep.ts:158

___

### addUnaryOp

▸ `Static` **addUnaryOp**(`op_name`): typeof [`Jsep`](jsep_jsep.Jsep.md)

**`method`** addUnaryOp

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `op_name` | `string` | The name of the unary op to add |

#### Returns

typeof [`Jsep`](jsep_jsep.Jsep.md)

#### Defined in

js/source/jsep/jsep.ts:124

___

### binaryPrecedence

▸ `Static` **binaryPrecedence**(`op_val`): `number`

Returns the precedence of a binary operator or `0` if it isn't a binary operator. Can be float.

#### Parameters

| Name | Type |
| :------ | :------ |
| `op_val` | `string` |

#### Returns

`number`

#### Defined in

js/source/jsep/jsep.ts:303

___

### getMaxKeyLen

▸ `Static` **getMaxKeyLen**<`T`\>(`obj`): `number`

Get the longest key length of any object

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `T` |

#### Returns

`number`

#### Defined in

js/source/jsep/jsep.ts:285

___

### isDecimalDigit

▸ `Static` **isDecimalDigit**(`ch`): `boolean`

`ch` is a character code in the next three functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `ch` | `number` |

#### Returns

`boolean`

#### Defined in

js/source/jsep/jsep.ts:294

___

### isIdentifierPart

▸ `Static` **isIdentifierPart**(`ch`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ch` | `number` |

#### Returns

`boolean`

#### Defined in

js/source/jsep/jsep.ts:323

___

### isIdentifierStart

▸ `Static` **isIdentifierStart**(`ch`): `boolean`

Looks for start of identifier

#### Parameters

| Name | Type |
| :------ | :------ |
| `ch` | `number` |

#### Returns

`boolean`

#### Defined in

js/source/jsep/jsep.ts:312

___

### parse

▸ `Static` **parse**(`expr`): [`Expression`](../interfaces/jsep_jsep.default.Expression.md)

static top-level parser

#### Parameters

| Name | Type |
| :------ | :------ |
| `expr` | `string` |

#### Returns

[`Expression`](../interfaces/jsep_jsep.default.Expression.md)

#### Defined in

js/source/jsep/jsep.ts:276

___

### removeAllBinaryOps

▸ `Static` **removeAllBinaryOps**(): typeof [`Jsep`](jsep_jsep.Jsep.md)

**`method`** removeAllBinaryOps

#### Returns

typeof [`Jsep`](jsep_jsep.Jsep.md)

#### Defined in

js/source/jsep/jsep.ts:216

___

### removeAllLiterals

▸ `Static` **removeAllLiterals**(): typeof [`Jsep`](jsep_jsep.Jsep.md)

**`method`** removeAllLiterals

#### Returns

typeof [`Jsep`](jsep_jsep.Jsep.md)

#### Defined in

js/source/jsep/jsep.ts:237

___

### removeAllUnaryOps

▸ `Static` **removeAllUnaryOps**(): typeof [`Jsep`](jsep_jsep.Jsep.md)

**`method`** removeAllUnaryOps

#### Returns

typeof [`Jsep`](jsep_jsep.Jsep.md)

#### Defined in

js/source/jsep/jsep.ts:180

___

### removeBinaryOp

▸ `Static` **removeBinaryOp**(`op_name`): typeof [`Jsep`](jsep_jsep.Jsep.md)

**`method`** removeBinaryOp

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `op_name` | `string` | The name of the binary op to remove |

#### Returns

typeof [`Jsep`](jsep_jsep.Jsep.md)

#### Defined in

js/source/jsep/jsep.ts:202

___

### removeIdentifierChar

▸ `Static` **removeIdentifierChar**(`char`): typeof [`Jsep`](jsep_jsep.Jsep.md)

**`method`** removeIdentifierChar

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `char` | `string` | The additional character to stop treating as a valid part of an identifier |

#### Returns

typeof [`Jsep`](jsep_jsep.Jsep.md)

#### Defined in

js/source/jsep/jsep.ts:192

___

### removeLiteral

▸ `Static` **removeLiteral**(`literal_name`): typeof [`Jsep`](jsep_jsep.Jsep.md)

**`method`** removeLiteral

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `literal_name` | `string` | The name of the literal to remove |

#### Returns

typeof [`Jsep`](jsep_jsep.Jsep.md)

#### Defined in

js/source/jsep/jsep.ts:228

___

### removeUnaryOp

▸ `Static` **removeUnaryOp**(`op_name`): typeof [`Jsep`](jsep_jsep.Jsep.md)

**`method`** removeUnaryOp

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `op_name` | `string` | The name of the unary op to remove |

#### Returns

typeof [`Jsep`](jsep_jsep.Jsep.md)

#### Defined in

js/source/jsep/jsep.ts:168

___

### toString

▸ `Static` **toString**(): `string`

#### Returns

`string`

#### Defined in

js/source/jsep/jsep.ts:114

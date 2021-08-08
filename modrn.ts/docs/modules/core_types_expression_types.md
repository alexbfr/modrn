[modrn](../README.md) / [Exports](../modules.md) / core/types/expression-types

# Module: core/types/expression-types

## Table of contents

### Enumerations

- [ExpressionType](../enums/core_types_expression_types.ExpressionType.md)

### Type aliases

- [BaseExpression](core_types_expression_types.md#baseexpression)
- [ComplexExpression](core_types_expression_types.md#complexexpression)
- [ConstantExpression](core_types_expression_types.md#constantexpression)
- [FunctionReferenceExpression](core_types_expression_types.md#functionreferenceexpression)
- [VariableUsageExpression](core_types_expression_types.md#variableusageexpression)

## Type aliases

### BaseExpression

Ƭ **BaseExpression**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expressionType` | [`ExpressionType`](../enums/core_types_expression_types.ExpressionType.md) |

#### Defined in

[js/source/core/types/expression-types.ts:15](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/expression-types.ts#L15)

___

### ComplexExpression

Ƭ **ComplexExpression**: { `expression`: [`Expression`](../interfaces/jsep_jsep.default.Expression.md) ; `expressionType`: [`ComplexExpression`](../enums/core_types_expression_types.ExpressionType.md#complexexpression) ; `originalExpression`: `string` ; `usedVariableNames`: `string`[] ; `compiledExpression`: (`what`: `unknown`) => `unknown`  } & [`BaseExpression`](core_types_expression_types.md#baseexpression)

#### Defined in

[js/source/core/types/expression-types.ts:24](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/expression-types.ts#L24)

___

### ConstantExpression

Ƭ **ConstantExpression**: { `expressionType`: [`ConstantExpression`](../enums/core_types_expression_types.ExpressionType.md#constantexpression) ; `value`: `unknown`  } & [`BaseExpression`](core_types_expression_types.md#baseexpression)

#### Defined in

[js/source/core/types/expression-types.ts:40](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/expression-types.ts#L40)

___

### FunctionReferenceExpression

Ƭ **FunctionReferenceExpression**: { `expression`: [`Expression`](../interfaces/jsep_jsep.default.Expression.md) ; `expressionType`: [`FunctionReferenceExpression`](../enums/core_types_expression_types.ExpressionType.md#functionreferenceexpression) ; `originalExpression`: `string` ; `usedVariableNames`: `string`[] ; `compiledExpression`: (`what`: `unknown`) => `unknown`  } & [`BaseExpression`](core_types_expression_types.md#baseexpression)

#### Defined in

[js/source/core/types/expression-types.ts:32](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/expression-types.ts#L32)

___

### VariableUsageExpression

Ƭ **VariableUsageExpression**: { `expressionType`: [`VariableUsage`](../enums/core_types_expression_types.ExpressionType.md#variableusage) ; `variableName`: `string`  } & [`BaseExpression`](core_types_expression_types.md#baseexpression)

#### Defined in

[js/source/core/types/expression-types.ts:19](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/expression-types.ts#L19)

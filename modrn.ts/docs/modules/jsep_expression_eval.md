[modrn](../README.md) / [Exports](../modules.md) / jsep/expression-eval

# Module: jsep/expression-eval

## Table of contents

### References

- [parse](jsep_expression_eval.md#parse)

### Type aliases

- [lazy](jsep_expression_eval.md#lazy)

### Functions

- [addBinaryOp](jsep_expression_eval.md#addbinaryop)
- [addUnaryOp](jsep_expression_eval.md#addunaryop)
- [compile](jsep_expression_eval.md#compile)
- [compileAsync](jsep_expression_eval.md#compileasync)
- [eval](jsep_expression_eval.md#eval)
- [evalAsync](jsep_expression_eval.md#evalasync)

## References

### parse

Renames and exports: [default](jsep_jsep.default.md)

## Type aliases

### lazy

Ƭ **lazy**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `lazy?` | ``true`` |

#### Defined in

[js/source/jsep/expression-eval.ts:78](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/jsep/expression-eval.ts#L78)

## Functions

### addBinaryOp

▸ **addBinaryOp**(`operator`, `precedence_or_fn`, `_function`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `operator` | `string` |
| `precedence_or_fn` | `number` \| `binaryCallback` |
| `_function` | `binaryCallback` |

#### Returns

`void`

#### Defined in

[js/source/jsep/expression-eval.ts:299](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/jsep/expression-eval.ts#L299)

___

### addUnaryOp

▸ **addUnaryOp**(`operator`, `_function`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `operator` | `string` |
| `_function` | `unaryCallback` |

#### Returns

`void`

#### Defined in

[js/source/jsep/expression-eval.ts:293](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/jsep/expression-eval.ts#L293)

___

### compile

▸ **compile**(`expression`): (`context`: `object`) => `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `expression` | [`Expression`](../interfaces/jsep_jsep.default.Expression.md) |

#### Returns

`fn`

▸ (`context`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `object` |

##### Returns

`any`

#### Defined in

[js/source/jsep/expression-eval.ts:284](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/jsep/expression-eval.ts#L284)

___

### compileAsync

▸ **compileAsync**(`expression`): (`context`: `object`) => `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `expression` | `string` \| [`Expression`](../interfaces/jsep_jsep.default.Expression.md) |

#### Returns

`fn`

▸ (`context`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `object` |

##### Returns

`Promise`<`any`\>

#### Defined in

[js/source/jsep/expression-eval.ts:288](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/jsep/expression-eval.ts#L288)

___

### eval

▸ **eval**(`_node`, `context`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_node` | [`Expression`](../interfaces/jsep_jsep.default.Expression.md) |
| `context` | `object` |

#### Returns

`any`

#### Defined in

[js/source/jsep/expression-eval.ts:130](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/jsep/expression-eval.ts#L130)

___

### evalAsync

▸ **evalAsync**(`_node`, `context`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_node` | [`Expression`](../interfaces/jsep_jsep.default.Expression.md) |
| `context` | `object` |

#### Returns

`Promise`<`any`\>

#### Defined in

[js/source/jsep/expression-eval.ts:201](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/jsep/expression-eval.ts#L201)

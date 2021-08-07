[modrn](../README.md) / [Exports](../modules.md) / util/state

# Module: util/state

## Table of contents

### Type aliases

- [MutableState](util_state.md#mutablestate)
- [ParamType](util_state.md#paramtype)
- [PureStateFunction](util_state.md#purestatefunction)
- [RawStateFunction](util_state.md#rawstatefunction)
- [State](util_state.md#state)
- [StateToken](util_state.md#statetoken)
- [WrappedFunction](util_state.md#wrappedfunction)

### Functions

- [createState](util_state.md#createstate)
- [getOrCreateElementAttachedState](util_state.md#getorcreateelementattachedstate)
- [getOrCreateTokenAttachedState](util_state.md#getorcreatetokenattachedstate)
- [getStateInternal](util_state.md#getstateinternal)
- [mutableStateInternal](util_state.md#mutablestateinternal)
- [purifyInternal](util_state.md#purifyinternal)
- [useStateInternal](util_state.md#usestateinternal)

## Type aliases

### MutableState

Ƭ **MutableState**<`T`\>: [`T`, () => `void`]

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

js/source/util/state.ts:22

___

### ParamType

Ƭ **ParamType**<`K1`, `K2`, `K3`, `K4`\>: [`K1`] extends [`never`] ? [] : [`K2`] extends [`never`] ? [`K1`] : [`K3`] extends [`never`] ? [`K1`, `K2`] : [`K4`] extends [`never`] ? [`K1`, `K2`, `K3`] : [`K1`, `K2`, `K3`, `K4`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K1` | `never` |
| `K2` | `never` |
| `K3` | `never` |
| `K4` | `never` |

#### Defined in

js/source/util/state.ts:11

___

### PureStateFunction

Ƭ **PureStateFunction**<`K1`, `K2`, `K3`, `K4`\>: (...`rest`: [`ParamType`](util_state.md#paramtype)<`K1`, `K2`, `K3`, `K4`\>) => `void` & [`RawStateFunction`](util_state.md#rawstatefunction)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K1` | `never` |
| `K2` | `never` |
| `K3` | `never` |
| `K4` | `never` |

#### Defined in

js/source/util/state.ts:115

___

### RawStateFunction

Ƭ **RawStateFunction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `stateContext` | `WeakRef`<[`Stateful`](../interfaces/core_types_modrn_html_element.Stateful.md)\> |
| `stateId` | `string` |

#### Defined in

js/source/util/state.ts:114

___

### State

Ƭ **State**<`T`\>: [`T`, (`newState`: `T`, `silent?`: `boolean`) => `T`]

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

js/source/util/state.ts:18

___

### StateToken

Ƭ **StateToken**<`T`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dummy` | `T` |
| `id` | `string` |

#### Defined in

js/source/util/state.ts:27

___

### WrappedFunction

Ƭ **WrappedFunction**<`T`, `K1`, `K2`, `K3`, `K4`\>: (`state`: `T`, ...`args`: [`ParamType`](util_state.md#paramtype)<`K1`, `K2`, `K3`, `K4`\>) => [`DeepPartialOrFull`](util_immodify.md#deeppartialorfull)<`T`\> \| `undefined` \| `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K1` | `never` |
| `K2` | `never` |
| `K3` | `never` |
| `K4` | `never` |

#### Type declaration

▸ (`state`, ...`args`): [`DeepPartialOrFull`](util_immodify.md#deeppartialorfull)<`T`\> \| `undefined` \| `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `T` |
| `...args` | [`ParamType`](util_state.md#paramtype)<`K1`, `K2`, `K3`, `K4`\> |

##### Returns

[`DeepPartialOrFull`](util_immodify.md#deeppartialorfull)<`T`\> \| `undefined` \| `void`

#### Defined in

js/source/util/state.ts:117

## Functions

### createState

▸ **createState**<`T`\>(`prefix?`): [`StateToken`](util_state.md#statetoken)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `prefix?` | `string` |

#### Returns

[`StateToken`](util_state.md#statetoken)<`T`\>

#### Defined in

js/source/util/state.ts:32

___

### getOrCreateElementAttachedState

▸ **getOrCreateElementAttachedState**<`T`\>(`prefix`, `element`): [`StateToken`](util_state.md#statetoken)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `prefix` | `string` |
| `element` | `Element` |

#### Returns

[`StateToken`](util_state.md#statetoken)<`T`\>

#### Defined in

js/source/util/state.ts:43

___

### getOrCreateTokenAttachedState

▸ **getOrCreateTokenAttachedState**<`T`, `K`\>(`prefix`, `otherTokenProvided`): [`StateToken`](util_state.md#statetoken)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |
| `K` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `prefix` | `string` |
| `otherTokenProvided` | [`StateToken`](util_state.md#statetoken)<`K`\> |

#### Returns

[`StateToken`](util_state.md#statetoken)<`T`\>

#### Defined in

js/source/util/state.ts:54

___

### getStateInternal

▸ **getStateInternal**<`T`, `K`\>(`token`, `context`): [`State`](util_state.md#state)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends [`StateToken`](util_state.md#statetoken)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `K` |
| `context` | [`Stateful`](../interfaces/core_types_modrn_html_element.Stateful.md) |

#### Returns

[`State`](util_state.md#state)<`T`\>

#### Defined in

js/source/util/state.ts:87

___

### mutableStateInternal

▸ **mutableStateInternal**<`T`, `K`\>(`token`, `context`): [`MutableState`](util_state.md#mutablestate)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends [`StateToken`](util_state.md#statetoken)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `K` |
| `context` | [`Stateful`](../interfaces/core_types_modrn_html_element.Stateful.md) |

#### Returns

[`MutableState`](util_state.md#mutablestate)<`T`\>

#### Defined in

js/source/util/state.ts:103

___

### purifyInternal

▸ **purifyInternal**<`T`, `K`, `K1`, `K2`, `K3`, `K4`\>(`context`, `token`, `fn`): [`PureStateFunction`](util_state.md#purestatefunction)<`K1`, `K2`, `K3`, `K4`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Record`<`string`, `unknown`\> |
| `K` | extends [`StateToken`](util_state.md#statetoken)<`T`\> |
| `K1` | `never` |
| `K2` | `never` |
| `K3` | `never` |
| `K4` | `never` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`Stateful`](../interfaces/core_types_modrn_html_element.Stateful.md) |
| `token` | `K` |
| `fn` | [`WrappedFunction`](util_state.md#wrappedfunction)<`K`[``"dummy"``], `K1`, `K2`, `K3`, `K4`\> |

#### Returns

[`PureStateFunction`](util_state.md#purestatefunction)<`K1`, `K2`, `K3`, `K4`\>

#### Defined in

js/source/util/state.ts:120

___

### useStateInternal

▸ **useStateInternal**<`T`, `K`\>(`token`, `context`, `initial`): [`State`](util_state.md#state)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends [`StateToken`](util_state.md#statetoken)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `K` |
| `context` | [`Stateful`](../interfaces/core_types_modrn_html_element.Stateful.md) |
| `initial` | `T` \| () => `T` |

#### Returns

[`State`](util_state.md#state)<`T`\>

#### Defined in

js/source/util/state.ts:66

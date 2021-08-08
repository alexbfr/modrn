[modrn](../README.md) / [Exports](../modules.md) / core/hooks/state-hooks

# Module: core/hooks/state-hooks

## Table of contents

### Functions

- [getState](core_hooks_state_hooks.md#getstate)
- [mutableState](core_hooks_state_hooks.md#mutablestate)
- [purify](core_hooks_state_hooks.md#purify)
- [useState](core_hooks_state_hooks.md#usestate)

## Functions

### getState

▸ **getState**<`T`, `K`\>(`token`): [`State`](util_state.md#state)<`K`[``"dummy"``]\>

Similar to useState, but requires the state to be already initialized

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends [`StateToken`](util_state.md#statetoken)<`T`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `K` | the state token {@see createState} |

#### Returns

[`State`](util_state.md#state)<`K`[``"dummy"``]\>

#### Defined in

[js/source/core/hooks/state-hooks.ts:35](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/hooks/state-hooks.ts#L35)

___

### mutableState

▸ **mutableState**<`T`, `K`\>(`token`): [`MutableState`](util_state.md#mutablestate)<`K`[``"dummy"``]\>

Returns a mutable view of the state of the provided token.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends [`StateToken`](util_state.md#statetoken)<`T`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `K` | the state token {@see createState} |

#### Returns

[`MutableState`](util_state.md#mutablestate)<`K`[``"dummy"``]\>

#### Defined in

[js/source/core/hooks/state-hooks.ts:44](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/hooks/state-hooks.ts#L44)

___

### purify

▸ **purify**<`T`, `K`, `K1`, `K2`, `K3`, `K4`\>(`token`, `fn`): [`PureStateFunction`](util_state.md#purestatefunction)<`K1`, `K2`, `K3`, `K4`\>

Produces a state-bound function with up to 4 additional parameters aside from the 1st (which is always the current state).

The method may return undefined if it doesn't alter the state, or it may return a Partial<T> of the state. Only keys being part of the
partial result will be updated, the rest will stay in place.

The return value of purify is the state-bound function.

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

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `K` | the state token {@see createState} |
| `fn` | [`WrappedFunction`](util_state.md#wrappedfunction)<`K`[``"dummy"``], `K1`, `K2`, `K3`, `K4`\> | the function to bind the state to |

#### Returns

[`PureStateFunction`](util_state.md#purestatefunction)<`K1`, `K2`, `K3`, `K4`\>

#### Defined in

[js/source/core/hooks/state-hooks.ts:60](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/hooks/state-hooks.ts#L60)

___

### useState

▸ **useState**<`T`, `K`\>(`token`, `initial`): [`State`](util_state.md#state)<`K`[``"dummy"``]\>

Returns the state associated with the provided stateToken {@see createState}. If the state wasn't initialized yet,
it will be initialized first. The initial value may be either an object or a function returning an object of type T.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends [`StateToken`](util_state.md#statetoken)<`T`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `K` | the state token {@see createState} |
| `initial` | `K`[``"dummy"``] \| () => `K`[``"dummy"``] | the initial value |

#### Returns

[`State`](util_state.md#state)<`K`[``"dummy"``]\>

#### Defined in

[js/source/core/hooks/state-hooks.ts:26](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/hooks/state-hooks.ts#L26)

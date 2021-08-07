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

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends [`StateToken`](util_state.md#statetoken)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `K` |

#### Returns

[`State`](util_state.md#state)<`K`[``"dummy"``]\>

#### Defined in

js/source/core/hooks/state-hooks.ts:24

___

### mutableState

▸ **mutableState**<`T`, `K`\>(`token`): [`MutableState`](util_state.md#mutablestate)<`K`[``"dummy"``]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends [`StateToken`](util_state.md#statetoken)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `K` |

#### Returns

[`MutableState`](util_state.md#mutablestate)<`K`[``"dummy"``]\>

#### Defined in

js/source/core/hooks/state-hooks.ts:29

___

### purify

▸ **purify**<`T`, `K`, `K1`, `K2`, `K3`, `K4`\>(`token`, `fn`): [`PureStateFunction`](util_state.md#purestatefunction)<`K1`, `K2`, `K3`, `K4`\>

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
| `token` | `K` |
| `fn` | [`WrappedFunction`](util_state.md#wrappedfunction)<`K`[``"dummy"``], `K1`, `K2`, `K3`, `K4`\> |

#### Returns

[`PureStateFunction`](util_state.md#purestatefunction)<`K1`, `K2`, `K3`, `K4`\>

#### Defined in

js/source/core/hooks/state-hooks.ts:34

___

### useState

▸ **useState**<`T`, `K`\>(`token`, `initial`): [`State`](util_state.md#state)<`K`[``"dummy"``]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends [`StateToken`](util_state.md#statetoken)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `K` |
| `initial` | `K`[``"dummy"``] \| () => `K`[``"dummy"``] |

#### Returns

[`State`](util_state.md#state)<`K`[``"dummy"``]\>

#### Defined in

js/source/core/hooks/state-hooks.ts:19

[modrn](../README.md) / [Exports](../modules.md) / core/hooks/localstorage-backed-state-hooks

# Module: core/hooks/localstorage-backed-state-hooks

## Table of contents

### Functions

- [useLocalStorageState](core_hooks_localstorage_backed_state_hooks.md#uselocalstoragestate)

## Functions

### useLocalStorageState

▸ **useLocalStorageState**<`T`, `K`\>(`token`, `initial`, `localStorageKey`, `depth?`): [`State`](util_state.md#state)<`K`[``"dummy"``]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends [`StateToken`](util_state.md#statetoken)<`NonNullable`<`T`\>\> |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `token` | `K` | `undefined` |
| `initial` | `NonNullable`<`K`[``"dummy"``]\> \| () => `K`[``"dummy"``] | `undefined` |
| `localStorageKey` | `string` | `undefined` |
| `depth` | `number` | `-1` |

#### Returns

[`State`](util_state.md#state)<`K`[``"dummy"``]\>

#### Defined in

js/source/core/hooks/localstorage-backed-state-hooks.ts:11

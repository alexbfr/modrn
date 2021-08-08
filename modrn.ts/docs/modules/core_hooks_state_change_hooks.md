[modrn](../README.md) / [Exports](../modules.md) / core/hooks/state-change-hooks

# Module: core/hooks/state-change-hooks

## Table of contents

### Functions

- [useStateChange](core_hooks_state_change_hooks.md#usestatechange)

## Functions

### useStateChange

▸ **useStateChange**<`T`\>(`stateToken`, `changeHandler`, `depth?`): `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `stateToken` | [`StateToken`](util_state.md#statetoken)<`NonNullable`<`T`\>\> | `undefined` |
| `changeHandler` | [`ChangeHandlerFn`](core_hooks_change_hooks.md#changehandlerfn)<`T`\> | `undefined` |
| `depth` | `number` | `0` |

#### Returns

`void`

#### Defined in

[js/source/core/hooks/state-change-hooks.ts:10](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/hooks/state-change-hooks.ts#L10)

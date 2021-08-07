[modrn](../README.md) / [Exports](../modules.md) / core/hooks/change-hooks

# Module: core/hooks/change-hooks

## Table of contents

### Type aliases

- [ChangeHandlerFn](core_hooks_change_hooks.md#changehandlerfn)
- [ChangeHookState](core_hooks_change_hooks.md#changehookstate)
- [ChangeHookStateToken](core_hooks_change_hooks.md#changehookstatetoken)

### Functions

- [createChangeHook](core_hooks_change_hooks.md#createchangehook)
- [getOrCreateElementAttachedChangeHook](core_hooks_change_hooks.md#getorcreateelementattachedchangehook)
- [getOrCreateTokenAttachedChangeHook](core_hooks_change_hooks.md#getorcreatetokenattachedchangehook)
- [useChange](core_hooks_change_hooks.md#usechange)

## Type aliases

### ChangeHandlerFn

Ƭ **ChangeHandlerFn**<`T`\>: (`now`: `T`, `previous`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`now`, `previous`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `now` | `T` |
| `previous` | `T` |

##### Returns

`void`

#### Defined in

js/source/core/hooks/change-hooks.ts:22

___

### ChangeHookState

Ƭ **ChangeHookState**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `initial` | `boolean` |
| `previous` | `unknown` |

#### Defined in

js/source/core/hooks/change-hooks.ts:15

___

### ChangeHookStateToken

Ƭ **ChangeHookStateToken**: [`StateToken`](util_state.md#statetoken)<[`ChangeHookState`](core_hooks_change_hooks.md#changehookstate)\> & { `depth`: `number`  }

#### Defined in

js/source/core/hooks/change-hooks.ts:20

## Functions

### createChangeHook

▸ **createChangeHook**(`depth?`): [`ChangeHookStateToken`](core_hooks_change_hooks.md#changehookstatetoken)

Creates a change hook. depth specifies the maximum recursion depth to compare the two objects

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `depth` | `number` | `0` | maximum recursion depth |

#### Returns

[`ChangeHookStateToken`](core_hooks_change_hooks.md#changehookstatetoken)

#### Defined in

js/source/core/hooks/change-hooks.ts:28

___

### getOrCreateElementAttachedChangeHook

▸ **getOrCreateElementAttachedChangeHook**(`prefix`, `element`, `depth?`): [`ChangeHookStateToken`](core_hooks_change_hooks.md#changehookstatetoken)

Gets or creates an element-attached change hook-

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `prefix` | `string` | `undefined` | the prefix to disambiguate multiple attached states on the same element |
| `element` | `Element` | `undefined` | the element to attach the state to |
| `depth` | `number` | `0` | maximum recusrion depth |

#### Returns

[`ChangeHookStateToken`](core_hooks_change_hooks.md#changehookstatetoken)

#### Defined in

js/source/core/hooks/change-hooks.ts:38

___

### getOrCreateTokenAttachedChangeHook

▸ **getOrCreateTokenAttachedChangeHook**<`T`\>(`prefix`, `otherToken`, `depth?`): [`ChangeHookStateToken`](core_hooks_change_hooks.md#changehookstatetoken)

Gets or creates a change hook attached on another state

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `prefix` | `string` | `undefined` | the prefix to disambiguate multiple attached states on the same element |
| `otherToken` | [`StateToken`](util_state.md#statetoken)<`T`\> | `undefined` | the other state to attach this change hook to |
| `depth` | `number` | `0` | maximum recusrion depth |

#### Returns

[`ChangeHookStateToken`](core_hooks_change_hooks.md#changehookstatetoken)

#### Defined in

js/source/core/hooks/change-hooks.ts:48

___

### useChange

▸ **useChange**<`T`\>(`stateToken`, `value`, `changeHandlerFn?`): `boolean`

Tracks changes to the provided value, which must be not null. Change is detected recursively up to the depth when
creating the state token.

**`see`** createChangeHook

**`see`** getOrCreateElementAttachedChangeHook

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateToken` | [`ChangeHookStateToken`](core_hooks_change_hooks.md#changehookstatetoken) |
| `value` | `NonNullable`<`T`\> |
| `changeHandlerFn?` | [`ChangeHandlerFn`](core_hooks_change_hooks.md#changehandlerfn)<`T`\> |

#### Returns

`boolean`

#### Defined in

js/source/core/hooks/change-hooks.ts:62

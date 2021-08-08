[modrn](../README.md) / [Exports](../modules.md) / core/component-state

# Module: core/component-state

## Table of contents

### Type aliases

- [BoundFn](core_component_state.md#boundfn)

### Functions

- [bindToStateContext](core_component_state.md#bindtostatecontext)
- [dynamic](core_component_state.md#dynamic)
- [getCurrentStateContext](core_component_state.md#getcurrentstatecontext)
- [getStateOf](core_component_state.md#getstateof)
- [withState](core_component_state.md#withstate)

## Type aliases

### BoundFn

Ƭ **BoundFn**<`T`, `R`\>: (...`params`: `T`[]) => `R` & { `bound`: ``true`` ; `dynamic`: `boolean`  }

#### Type parameters

| Name |
| :------ |
| `T` |
| `R` |

#### Defined in

[js/source/core/component-state.ts:10](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/component-state.ts#L10)

## Functions

### bindToStateContext

▸ **bindToStateContext**<`T`, `R`\>(`fn`, ...`params`): (...`params`: `T`[]) => `R`

Binds the provided function to the current state context, if not already bound.

**`see`** withState

#### Type parameters

| Name |
| :------ |
| `T` |
| `R` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | (...`params`: `T`[]) => `R` |
| `...params` | `T`[] |

#### Returns

`fn`

▸ (...`params`): `R`

Binds the provided function to the current state context, if not already bound.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...params` | `T`[] |

##### Returns

`R`

#### Defined in

[js/source/core/component-state.ts:95](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/component-state.ts#L95)

___

### dynamic

▸ **dynamic**<`T`, `R`\>(`fn`, ...`params`): (...`params`: `T`[]) => `R`

Explicitly declares the provided function as dynamic. This has the effect that the function is newly instantiated
during each render and thus sees all props always. This has some performance implications, and it is preferable to
use state-bound functions instead (state is always up-to-date) and should be avoided where not necessary.

#### Type parameters

| Name |
| :------ |
| `T` |
| `R` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | (...`params`: `T`[]) => `R` |
| `...params` | `T`[] |

#### Returns

`fn`

▸ (...`params`): `R`

Explicitly declares the provided function as dynamic. This has the effect that the function is newly instantiated
during each render and thus sees all props always. This has some performance implications, and it is preferable to
use state-bound functions instead (state is always up-to-date) and should be avoided where not necessary.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...params` | `T`[] |

##### Returns

`R`

#### Defined in

[js/source/core/component-state.ts:82](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/component-state.ts#L82)

___

### getCurrentStateContext

▸ **getCurrentStateContext**(): [`Stateful`](../interfaces/core_types_modrn_html_element.Stateful.md)

Returns the current state context during rendering

#### Returns

[`Stateful`](../interfaces/core_types_modrn_html_element.Stateful.md)

#### Defined in

[js/source/core/component-state.ts:50](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/component-state.ts#L50)

___

### getStateOf

▸ **getStateOf**(`self`): [`ComponentState`](../interfaces/core_types_modrn_html_element.ComponentState.md)

Returns or creates the empty state for the element

#### Parameters

| Name | Type |
| :------ | :------ |
| `self` | [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md) |

#### Returns

[`ComponentState`](../interfaces/core_types_modrn_html_element.ComponentState.md)

#### Defined in

[js/source/core/component-state.ts:43](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/component-state.ts#L43)

___

### withState

▸ **withState**<`T`, `R`\>(`state`, `fn`, ...`params`): `R`

Wraps the provided function with the state, preserving the state context stack

#### Type parameters

| Name |
| :------ |
| `T` |
| `R` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`Stateful`](../interfaces/core_types_modrn_html_element.Stateful.md) |
| `fn` | (...`params`: `T`[]) => `R` |
| `...params` | `T`[] |

#### Returns

`R`

#### Defined in

[js/source/core/component-state.ts:64](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/component-state.ts#L64)

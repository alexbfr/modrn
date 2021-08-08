[modrn](../README.md) / [Exports](../modules.md) / core/change-tracking/change-types

# Module: core/change-tracking/change-types

## Table of contents

### Interfaces

- [ApplyResult](../interfaces/core_change_tracking_change_types.ApplyResult.md)

### Type aliases

- [Changes](core_change_tracking_change_types.md#changes)
- [Consumers](core_change_tracking_change_types.md#consumers)

### Variables

- [changes](core_change_tracking_change_types.md#changes)

### Functions

- [clean](core_change_tracking_change_types.md#clean)
- [resetChangeTracking](core_change_tracking_change_types.md#resetchangetracking)
- [union](core_change_tracking_change_types.md#union)

## Type aliases

### Changes

Ƭ **Changes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `list` | `WeakMap`<`object`, [`Consumers`](core_change_tracking_change_types.md#consumers)\> |

#### Defined in

[js/source/core/change-tracking/change-types.ts:12](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/change-tracking/change-types.ts#L12)

___

### Consumers

Ƭ **Consumers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `consumers` | `WeakRef`<[`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md)\>[] |

#### Defined in

[js/source/core/change-tracking/change-types.ts:8](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/change-tracking/change-types.ts#L8)

## Variables

### changes

• `Let` **changes**: [`Changes`](core_change_tracking_change_types.md#changes)

#### Defined in

[js/source/core/change-tracking/change-types.ts:16](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/change-tracking/change-types.ts#L16)

## Functions

### clean

▸ **clean**(`what`, `except?`): `WeakRef`<[`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md)\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `what` | [`Consumers`](core_change_tracking_change_types.md#consumers) |
| `except?` | [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md) |

#### Returns

`WeakRef`<[`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md)\>[]

#### Defined in

[js/source/core/change-tracking/change-types.ts:35](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/change-tracking/change-types.ts#L35)

___

### resetChangeTracking

▸ **resetChangeTracking**(): `void`

#### Returns

`void`

#### Defined in

[js/source/core/change-tracking/change-types.ts:29](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/change-tracking/change-types.ts#L29)

___

### union

▸ **union**(`applyResult`, `applyResult2`): [`ApplyResult`](../interfaces/core_change_tracking_change_types.ApplyResult.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `applyResult` | [`ApplyResult`](../interfaces/core_change_tracking_change_types.ApplyResult.md) |
| `applyResult2` | [`ApplyResult`](../interfaces/core_change_tracking_change_types.ApplyResult.md) |

#### Returns

[`ApplyResult`](../interfaces/core_change_tracking_change_types.ApplyResult.md)

#### Defined in

[js/source/core/change-tracking/change-types.ts:24](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/change-tracking/change-types.ts#L24)

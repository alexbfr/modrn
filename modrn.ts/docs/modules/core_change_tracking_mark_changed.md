[modrn](../README.md) / [Exports](../modules.md) / core/change-tracking/mark-changed

# Module: core/change-tracking/mark-changed

## Table of contents

### Functions

- [clearTainted](core_change_tracking_mark_changed.md#cleartainted)
- [isTainted](core_change_tracking_mark_changed.md#istainted)
- [markChanged](core_change_tracking_mark_changed.md#markchanged)

## Functions

### clearTainted

▸ **clearTainted**(): `void`

Reset tainted flags

#### Returns

`void`

#### Defined in

[js/source/core/change-tracking/mark-changed.ts:27](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/change-tracking/mark-changed.ts#L27)

___

### isTainted

▸ **isTainted**<`T`\>(`what`): `boolean`

Checks if an object is tainted (i.e. marked dirty, despite potentially having the same reference than in the
past rendering cycle)

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `what` | `T` |

#### Returns

`boolean`

#### Defined in

[js/source/core/change-tracking/mark-changed.ts:17](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/change-tracking/mark-changed.ts#L17)

___

### markChanged

▸ **markChanged**<`T`\>(`what`, `recursive?`): `void`

Mark an object as tainted. This both marks the object as tainted and checks which other
components reference this specific object currently, and marks those as requiring a re-render.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` \| `unknown`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `what` | `T` |
| `recursive?` | `boolean` |

#### Returns

`void`

#### Defined in

[js/source/core/change-tracking/mark-changed.ts:38](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/change-tracking/mark-changed.ts#L38)

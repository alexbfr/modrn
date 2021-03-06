[modrn](../README.md) / [Exports](../modules.md) / core/types/prop-types

# Module: core/types/prop-types

## Table of contents

### Type aliases

- [ChildCollection](core_types_prop_types.md#childcollection)
- [Container](core_types_prop_types.md#container)
- [ElementRefs](core_types_prop_types.md#elementrefs)

### Variables

- [sigDate](core_types_prop_types.md#sigdate)
- [sigElementRefs](core_types_prop_types.md#sigelementrefs)

### Functions

- [m](core_types_prop_types.md#m)
- [mArray](core_types_prop_types.md#marray)
- [mBool](core_types_prop_types.md#mbool)
- [mChild](core_types_prop_types.md#mchild)
- [mDate](core_types_prop_types.md#mdate)
- [mEventHandler](core_types_prop_types.md#meventhandler)
- [mFunction](core_types_prop_types.md#mfunction)
- [mNumber](core_types_prop_types.md#mnumber)
- [mObj](core_types_prop_types.md#mobj)
- [mRef](core_types_prop_types.md#mref)
- [mString](core_types_prop_types.md#mstring)
- [sigEventHandler](core_types_prop_types.md#sigeventhandler)
- [sigFunction](core_types_prop_types.md#sigfunction)

## Type aliases

### ChildCollection

Ƭ **ChildCollection**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `__childCollection` | ``true`` |
| `elements` | `Element`[] |

#### Defined in

[js/source/core/types/prop-types.ts:10](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L10)

___

### Container

Ƭ **Container**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `__typed?` | ``true`` |

#### Defined in

[js/source/core/types/prop-types.ts:15](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L15)

___

### ElementRefs

Ƭ **ElementRefs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `refs` | `HTMLElement`[] |

#### Defined in

[js/source/core/types/prop-types.ts:6](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L6)

## Variables

### sigDate

• `Const` **sigDate**: `Date`

#### Defined in

[js/source/core/types/prop-types.ts:1](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L1)

___

### sigElementRefs

• `Const` **sigElementRefs**: [`ElementRefs`](core_types_prop_types.md#elementrefs)

#### Defined in

[js/source/core/types/prop-types.ts:2](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L2)

## Functions

### m

▸ **m**<`T`\>(`v`): `T` & [`Container`](core_types_prop_types.md#container)

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `T` |

#### Returns

`T` & [`Container`](core_types_prop_types.md#container)

#### Defined in

[js/source/core/types/prop-types.ts:57](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L57)

___

### mArray

▸ **mArray**<`T`\>(): `T`[]

#### Type parameters

| Name |
| :------ |
| `T` |

#### Returns

`T`[]

#### Defined in

[js/source/core/types/prop-types.ts:49](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L49)

___

### mBool

▸ **mBool**(): `boolean`

#### Returns

`boolean`

#### Defined in

[js/source/core/types/prop-types.ts:17](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L17)

___

### mChild

▸ **mChild**(): [`ChildCollection`](core_types_prop_types.md#childcollection)

#### Returns

[`ChildCollection`](core_types_prop_types.md#childcollection)

#### Defined in

[js/source/core/types/prop-types.ts:29](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L29)

___

### mDate

▸ **mDate**(): `Date`

#### Returns

`Date`

#### Defined in

[js/source/core/types/prop-types.ts:33](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L33)

___

### mEventHandler

▸ **mEventHandler**(): (`e`: `Event`) => `void`

#### Returns

`fn`

▸ (`e`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `e` | `Event` |

##### Returns

`void`

#### Defined in

[js/source/core/types/prop-types.ts:41](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L41)

___

### mFunction

▸ **mFunction**<`T`\>(): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Function` |

#### Returns

`T`

#### Defined in

[js/source/core/types/prop-types.ts:45](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L45)

___

### mNumber

▸ **mNumber**(): `number`

#### Returns

`number`

#### Defined in

[js/source/core/types/prop-types.ts:25](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L25)

___

### mObj

▸ **mObj**<`T`\>(): `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Returns

`T`

#### Defined in

[js/source/core/types/prop-types.ts:53](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L53)

___

### mRef

▸ **mRef**(): [`ElementRefs`](core_types_prop_types.md#elementrefs)

#### Returns

[`ElementRefs`](core_types_prop_types.md#elementrefs)

#### Defined in

[js/source/core/types/prop-types.ts:37](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L37)

___

### mString

▸ **mString**<`T`\>(): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` |

#### Returns

`T`

#### Defined in

[js/source/core/types/prop-types.ts:21](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L21)

___

### sigEventHandler

▸ `Const` **sigEventHandler**(): `void`

#### Returns

`void`

#### Defined in

[js/source/core/types/prop-types.ts:3](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L3)

___

### sigFunction

▸ `Const` **sigFunction**(): `void`

#### Returns

`void`

#### Defined in

[js/source/core/types/prop-types.ts:4](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/prop-types.ts#L4)

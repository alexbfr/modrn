[modrn](../README.md) / [Exports](../modules.md) / util/immodify

# Module: util/immodify

## Table of contents

### Type aliases

- [DeepPartialOrFull](util_immodify.md#deeppartialorfull)

### Functions

- [immodify](util_immodify.md#immodify)
- [replaceWith](util_immodify.md#replacewith)

## Type aliases

### DeepPartialOrFull

Ƭ **DeepPartialOrFull**<`T`\>: { [P in keyof T]?: DeepPartialOrFull<T[P]\> \| Full<T[P]\>}

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[js/source/util/immodify.ts:8](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/util/immodify.ts#L8)

## Functions

### immodify

▸ **immodify**<`T`\>(`on`, `modifier`): `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `on` | `T` |
| `modifier` | [`DeepPartialOrFull`](util_immodify.md#deeppartialorfull)<`T`\> |

#### Returns

`T`

#### Defined in

[js/source/util/immodify.ts:20](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/util/immodify.ts#L20)

___

### replaceWith

▸ **replaceWith**<`T`\>(`val`): `Full`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `T` |

#### Returns

`Full`<`T`\>

#### Defined in

[js/source/util/immodify.ts:16](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/util/immodify.ts#L16)

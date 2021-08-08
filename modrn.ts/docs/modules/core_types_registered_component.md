[modrn](../README.md) / [Exports](../modules.md) / core/types/registered-component

# Module: core/types/registered-component

## Table of contents

### Type aliases

- [AllProps](core_types_registered_component.md#allprops)
- [Filters](core_types_registered_component.md#filters)
- [Module](core_types_registered_component.md#module)
- [ModuleResult](core_types_registered_component.md#moduleresult)
- [RegisteredComponent](core_types_registered_component.md#registeredcomponent)

### Variables

- [NoProps](core_types_registered_component.md#noprops)

## Type aliases

### AllProps

Ƭ **AllProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `allProps` | () => `Record`<`string`, `unknown`\> |

#### Defined in

[js/source/core/types/registered-component.ts:10](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/registered-component.ts#L10)

___

### Filters

Ƭ **Filters**: `Object`

#### Index signature

▪ [filterName: `string`]: (`val`: `unknown`) => `unknown`

#### Defined in

[js/source/core/types/registered-component.ts:12](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/registered-component.ts#L12)

___

### Module

Ƭ **Module**<`M`, `K`\>: { [tagName in K]: M[K] & RegisteredComponent<unknown, unknown\>}

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | `M` |
| `K` | extends keyof `M` |

#### Defined in

[js/source/core/types/registered-component.ts:26](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/registered-component.ts#L26)

___

### ModuleResult

Ƭ **ModuleResult**<`M`, `K`\>: [`Module`](core_types_registered_component.md#module)<`M`, `K`\> & { `dependsOn`: (...`modules`: [`Module`](core_types_registered_component.md#module)<`never`, `never`\>[]) => [`Module`](core_types_registered_component.md#module)<`M`, `K`\>  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | `M` |
| `K` | extends keyof `M` |

#### Defined in

[js/source/core/types/registered-component.ts:30](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/registered-component.ts#L30)

___

### RegisteredComponent

Ƭ **RegisteredComponent**<`T`, `R`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `T` |
| `R` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `customElementConstructor?` | `CustomElementConstructor` |
| `dynamicChildren` | `boolean` |
| `filters` | [`Filters`](core_types_registered_component.md#filters) |
| `htmlTemplate` | `string` |
| `propTemplate` | `T` |
| `transparent` | `boolean` |
| `renderFunction` | (`props`: `T` & [`AllProps`](core_types_registered_component.md#allprops)) => ``null`` \| `R` |

#### Defined in

[js/source/core/types/registered-component.ts:16](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/registered-component.ts#L16)

## Variables

### NoProps

• `Const` **NoProps**: [`Container`](core_types_prop_types.md#container)

#### Defined in

[js/source/core/types/registered-component.ts:8](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/registered-component.ts#L8)

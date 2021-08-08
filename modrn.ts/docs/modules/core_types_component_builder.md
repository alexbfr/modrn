[modrn](../README.md) / [Exports](../modules.md) / core/types/component-builder

# Module: core/types/component-builder

## Table of contents

### Type aliases

- [ComponentBuilder](core_types_component_builder.md#componentbuilder)
- [ComponentBuilderBase](core_types_component_builder.md#componentbuilderbase)
- [ComponentBuilderDynamicChildren](core_types_component_builder.md#componentbuilderdynamicchildren)
- [ComponentBuilderFilters](core_types_component_builder.md#componentbuilderfilters)
- [ComponentBuilderHtml](core_types_component_builder.md#componentbuilderhtml)
- [ComponentBuilderTransparent](core_types_component_builder.md#componentbuildertransparent)

## Type aliases

### ComponentBuilder

Ƭ **ComponentBuilder**<`T`, `R`\>: { `register`: () => [`RegisteredComponent`](core_types_registered_component.md#registeredcomponent)<`T`, `R`\>  } & [`ComponentBuilderHtml`](core_types_component_builder.md#componentbuilderhtml) & [`ComponentBuilderTransparent`](core_types_component_builder.md#componentbuildertransparent) & [`ComponentBuilderDynamicChildren`](core_types_component_builder.md#componentbuilderdynamicchildren) & [`ComponentBuilderFilters`](core_types_component_builder.md#componentbuilderfilters)

#### Type parameters

| Name |
| :------ |
| `T` |
| `R` |

#### Defined in

[js/source/core/types/component-builder.ts:26](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/component-builder.ts#L26)

___

### ComponentBuilderBase

Ƭ **ComponentBuilderBase**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `register` | () => `void` |

#### Defined in

[js/source/core/types/component-builder.ts:8](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/component-builder.ts#L8)

___

### ComponentBuilderDynamicChildren

Ƭ **ComponentBuilderDynamicChildren**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dynamicChildren` | <T\>() => `Omit`<`T`, ``"dynamicChildren"``\> |

#### Defined in

[js/source/core/types/component-builder.ts:18](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/component-builder.ts#L18)

___

### ComponentBuilderFilters

Ƭ **ComponentBuilderFilters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `withFilters` | <T\>(`filters`: [`Filters`](core_types_registered_component.md#filters)) => `Omit`<`T`, ``"withFilters"``\> |

#### Defined in

[js/source/core/types/component-builder.ts:22](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/component-builder.ts#L22)

___

### ComponentBuilderHtml

Ƭ **ComponentBuilderHtml**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `html` | <T\>(`html`: `string`) => `Omit`<`T`, ``"html"``\> |

#### Defined in

[js/source/core/types/component-builder.ts:10](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/component-builder.ts#L10)

___

### ComponentBuilderTransparent

Ƭ **ComponentBuilderTransparent**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `transparent` | <T\>() => `Omit`<`T`, ``"transparent"``\> |

#### Defined in

[js/source/core/types/component-builder.ts:14](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/component-builder.ts#L14)

[modrn](../README.md) / [Exports](../modules.md) / core/variable-analysis/register-special-attribute

# Module: core/variable-analysis/register-special-attribute

## Table of contents

### Type aliases

- [SpecialAttributeRegistry](core_variable_analysis_register_special_attribute.md#specialattributeregistry)

### Functions

- [getSpecialAttributeRegistry](core_variable_analysis_register_special_attribute.md#getspecialattributeregistry)
- [registerSpecialAttribute](core_variable_analysis_register_special_attribute.md#registerspecialattribute)

## Type aliases

### SpecialAttributeRegistry

Ƭ **SpecialAttributeRegistry**: `Object`

#### Index signature

▪ [attributeName: `string`]: [`SpecialAttributeRegistration`](core_types_variables.md#specialattributeregistration)

#### Defined in

js/source/core/variable-analysis/register-special-attribute.ts:9

## Functions

### getSpecialAttributeRegistry

▸ **getSpecialAttributeRegistry**(): [`SpecialAttributeRegistry`](core_variable_analysis_register_special_attribute.md#specialattributeregistry)

#### Returns

[`SpecialAttributeRegistry`](core_variable_analysis_register_special_attribute.md#specialattributeregistry)

#### Defined in

js/source/core/variable-analysis/register-special-attribute.ts:24

___

### registerSpecialAttribute

▸ **registerSpecialAttribute**(`attributeName`, `handler`, `precedence?`): [`SpecialAttributeRegistration`](core_types_variables.md#specialattributeregistration)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `attributeName` | `string` | `undefined` |
| `handler` | [`SpecialAttributeHandlerFn`](core_types_variables.md#specialattributehandlerfn) | `undefined` |
| `precedence` | `number` | `0` |

#### Returns

[`SpecialAttributeRegistration`](core_types_variables.md#specialattributeregistration)

#### Defined in

js/source/core/variable-analysis/register-special-attribute.ts:15

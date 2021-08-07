[modrn](../README.md) / [Exports](../modules.md) / core/variable-analysis/find-special-attributes

# Module: core/variable-analysis/find-special-attributes

## Table of contents

### Functions

- [findSpecialAttributes](core_variable_analysis_find_special_attributes.md#findspecialattributes)
- [hasSpecialAttributes](core_variable_analysis_find_special_attributes.md#hasspecialattributes)

## Functions

### findSpecialAttributes

▸ **findSpecialAttributes**(`rootElement`, `indexes`): [`SpecialAttributeVariable`](core_types_variables.md#specialattributevariable)[]

Looks for special attributes, that is, attributes which have been registered as such

**`see`** registerSpecialAttribute

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootElement` | `Element` |
| `indexes` | `number`[] |

#### Returns

[`SpecialAttributeVariable`](core_types_variables.md#specialattributevariable)[]

#### Defined in

js/source/core/variable-analysis/find-special-attributes.ts:18

___

### hasSpecialAttributes

▸ **hasSpecialAttributes**(`rootElement`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootElement` | `HTMLElement` |

#### Returns

`boolean`

#### Defined in

js/source/core/variable-analysis/find-special-attributes.ts:44

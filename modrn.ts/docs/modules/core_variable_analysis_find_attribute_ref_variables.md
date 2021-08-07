[modrn](../README.md) / [Exports](../modules.md) / core/variable-analysis/find-attribute-ref-variables

# Module: core/variable-analysis/find-attribute-ref-variables

## Table of contents

### Functions

- [findAttributeRefVariables](core_variable_analysis_find_attribute_ref_variables.md#findattributerefvariables)

## Functions

### findAttributeRefVariables

▸ **findAttributeRefVariables**(`rootElement`, `indexes`): [`AttributeRefVariable`](core_types_variables.md#attributerefvariable)[]

Searches for ref attributes

**`example`**
<span ref="{{myRef}}">...</span>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootElement` | `Element` |
| `indexes` | `number`[] |

#### Returns

[`AttributeRefVariable`](core_types_variables.md#attributerefvariable)[]

#### Defined in

js/source/core/variable-analysis/find-attribute-ref-variables.ts:19

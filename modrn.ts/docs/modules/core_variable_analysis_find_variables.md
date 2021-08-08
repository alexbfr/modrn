[modrn](../README.md) / [Exports](../modules.md) / core/variable-analysis/find-variables

# Module: core/variable-analysis/find-variables

## Table of contents

### Functions

- [findVariables](core_variable_analysis_find_variables.md#findvariables)

## Functions

### findVariables

▸ **findVariables**(`rootElement`): [`FoundVariables`](core_types_variables.md#foundvariables)

Finds variable references in the provided element.
This function inspects all children recursively. If a ModrnHTMLElement is encountered,
recursion stops there (a ModrnHTMLElement will have done the same process for its own content already).

Also, there is specific handling for special attributes which wrap their element (like m-if or m-for).

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootElement` | `Element` |

#### Returns

[`FoundVariables`](core_types_variables.md#foundvariables)

#### Defined in

[js/source/core/variable-analysis/find-variables.ts:38](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/variable-analysis/find-variables.ts#L38)

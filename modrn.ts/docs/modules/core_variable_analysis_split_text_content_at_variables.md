[modrn](../README.md) / [Exports](../modules.md) / core/variable-analysis/split-text-content-at-variables

# Module: core/variable-analysis/split-text-content-at-variables

## Table of contents

### Functions

- [splitTextContentAtVariables](core_variable_analysis_split_text_content_at_variables.md#splittextcontentatvariables)

## Functions

### splitTextContentAtVariables

▸ **splitTextContentAtVariables**(`rootElement`): `void`

Splits the text content of the provided element around variable references like {{x}}
It does this by cutting off text before and/or after a variable reference and puts the variable reference
in its own text node.

The text node is later upgraded to a element, if required {@see substituteVariables}

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootElement` | `Element` |

#### Returns

`void`

#### Defined in

[js/source/core/variable-analysis/split-text-content-at-variables.ts:18](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/variable-analysis/split-text-content-at-variables.ts#L18)

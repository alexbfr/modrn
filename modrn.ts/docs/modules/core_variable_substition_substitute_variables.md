[modrn](../README.md) / [Exports](../modules.md) / core/variable-substition/substitute-variables

# Module: core/variable-substition/substitute-variables

## Table of contents

### Type aliases

- [VarOptions](core_variable_substition_substitute_variables.md#varoptions)
- [Vars](core_variable_substition_substitute_variables.md#vars)

### Functions

- [substituteVariables](core_variable_substition_substitute_variables.md#substitutevariables)
- [varsWithOptions](core_variable_substition_substitute_variables.md#varswithoptions)

## Type aliases

### VarOptions

Ƭ **VarOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hideByDefault?` | `boolean` |

#### Defined in

js/source/core/variable-substition/substitute-variables.ts:234

___

### Vars

Ƭ **Vars**: `Record`<`string`, `unknown`\> & { `__options?`: [`VarOptions`](core_variable_substition_substitute_variables.md#varoptions)  }

#### Defined in

js/source/core/variable-substition/substitute-variables.ts:238

## Functions

### substituteVariables

▸ **substituteVariables**(`self`, `root`, `varsProvided`, `variableDefinitionsProvided?`, `suppressReRender?`): `void`

Substitute variables in the children of the provided ModrnHTMLElement.

It is important to keep in mind that the variable definition's ".sorted" contains a list of referenced variables sorted by child node
in ascending depth order.

The process outlined is:
     - For each child node in the template which is referencing variables,
       - Check if constants must be applied
       - For all variables *defined in the varsProvided* parameter, check if this childnode uses that variable at all; if not, skip
       - Then iterate all variable references using the current variable from varsProvided
       - If it is a complex expression (i.e. potentially referencing more than just one variable from varsProvided), check if it was already calculated
       - Set the value to the variable value or expression result
     - Repeat

Initially the process was to just iterate over varsProvided, but this has proven not as effective since it meant searching a child node
multiple times, and potentially updating it also multiple times (instead of one time, then queueing a re-render after being finished)

For now this is good enough; maybe i'Ll revert it to the previous algorithm with kind of in-place-node-ordering/caching, but the gain does not outweigh
the cost right now. Should this ever be used with large(ish) apps, it shouldn't pose a problem to optimize according to the then-real world scenario.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `self` | [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md) | `undefined` |
| `root` | `Element` | `undefined` |
| `varsProvided` | [`Vars`](core_variable_substition_substitute_variables.md#vars) | `undefined` |
| `variableDefinitionsProvided?` | [`VariableMappings`](core_types_variables.md#variablemappings) | `undefined` |
| `suppressReRender` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

js/source/core/variable-substition/substitute-variables.ts:59

___

### varsWithOptions

▸ **varsWithOptions**(`vars`, `options`): [`Vars`](core_variable_substition_substitute_variables.md#vars)

#### Parameters

| Name | Type |
| :------ | :------ |
| `vars` | `Record`<`string`, `unknown`\> |
| `options` | [`VarOptions`](core_variable_substition_substitute_variables.md#varoptions) |

#### Returns

[`Vars`](core_variable_substition_substitute_variables.md#vars)

#### Defined in

js/source/core/variable-substition/substitute-variables.ts:240

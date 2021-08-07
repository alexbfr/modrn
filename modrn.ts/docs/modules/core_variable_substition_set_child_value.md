[modrn](../README.md) / [Exports](../modules.md) / core/variable-substition/set-child-value

# Module: core/variable-substition/set-child-value

## Table of contents

### Functions

- [getChildValue](core_variable_substition_set_child_value.md#getchildvalue)
- [nodeInfo](core_variable_substition_set_child_value.md#nodeinfo)
- [setChildValue](core_variable_substition_set_child_value.md#setchildvalue)

## Functions

### getChildValue

▸ **getChildValue**(`self`, `node`): `unknown`

Gets the child value of the node

#### Parameters

| Name | Type |
| :------ | :------ |
| `self` | [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md) |
| `node` | `Node` |

#### Returns

`unknown`

#### Defined in

js/source/core/variable-substition/set-child-value.ts:18

___

### nodeInfo

▸ **nodeInfo**(`node`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Node` |

#### Returns

`string`

#### Defined in

js/source/core/variable-substition/set-child-value.ts:190

___

### setChildValue

▸ **setChildValue**(`self`, `node`, `match`, `valueProvided`): `unknown`

Sets the child value of the provided node. This is a bit lengthy (see the individual functions below),
since several cases have to be taken care of. There will be bugs here waiting to be fixed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `self` | [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md) |
| `node` | `Node` |
| `match` | [`VariableMapping`](core_types_variables.md#variablemapping) |
| `valueProvided` | `unknown` |

#### Returns

`unknown`

#### Defined in

js/source/core/variable-substition/set-child-value.ts:37

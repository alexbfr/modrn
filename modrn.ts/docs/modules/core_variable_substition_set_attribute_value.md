[modrn](../README.md) / [Exports](../modules.md) / core/variable-substition/set-attribute-value

# Module: core/variable-substition/set-attribute-value

## Table of contents

### Functions

- [getAttributeValue](core_variable_substition_set_attribute_value.md#getattributevalue)
- [setAttributeValue](core_variable_substition_set_attribute_value.md#setattributevalue)

## Functions

### getAttributeValue

▸ **getAttributeValue**(`self`, `node`, `attributeNameOriginal`): `unknown`

Gets the value of an attribute for a specific node (with the rendering context of "self" i.e. the containing ModrnHTMLElement)

#### Parameters

| Name | Type |
| :------ | :------ |
| `self` | [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md) |
| `node` | `Element` |
| `attributeNameOriginal` | `string` |

#### Returns

`unknown`

#### Defined in

[js/source/core/variable-substition/set-attribute-value.ts:19](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/variable-substition/set-attribute-value.ts#L19)

___

### setAttributeValue

▸ **setAttributeValue**(`self`, `node`, `attributeName`, `value`, `hidden`): `void`

Sets the value of an attribute/prop

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `self` | [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md) | the ModrnHTMLElement providing the context |
| `node` | `Element` | the node to set the attribute/prop on |
| `attributeName` | `string` | the name of the attribute/prop |
| `value` | `unknown` | the value |
| `hidden` | `boolean` | if true, hides a html-visible counterpart for a ModrnHTMLElement node |

#### Returns

`void`

#### Defined in

[js/source/core/variable-substition/set-attribute-value.ts:56](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/variable-substition/set-attribute-value.ts#L56)

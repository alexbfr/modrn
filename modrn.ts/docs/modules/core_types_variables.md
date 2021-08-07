[modrn](../README.md) / [Exports](../modules.md) / core/types/variables

# Module: core/types/variables

## Table of contents

### Enumerations

- [MappingType](../enums/core_types_variables.MappingType.md)

### Type aliases

- [AttributeRefVariable](core_types_variables.md#attributerefvariable)
- [AttributeVariable](core_types_variables.md#attributevariable)
- [ChildVariable](core_types_variables.md#childvariable)
- [FoundVariables](core_types_variables.md#foundvariables)
- [SpecialAttributeHandlerFn](core_types_variables.md#specialattributehandlerfn)
- [SpecialAttributeHandlerFnResult](core_types_variables.md#specialattributehandlerfnresult)
- [SpecialAttributeRegistration](core_types_variables.md#specialattributeregistration)
- [SpecialAttributeValueTransformerFn](core_types_variables.md#specialattributevaluetransformerfn)
- [SpecialAttributeVariable](core_types_variables.md#specialattributevariable)
- [ValueTransformerFn](core_types_variables.md#valuetransformerfn)
- [VariableMapping](core_types_variables.md#variablemapping)
- [VariableMappingBase](core_types_variables.md#variablemappingbase)
- [VariableMappings](core_types_variables.md#variablemappings)
- [VariablesByNodeIndex](core_types_variables.md#variablesbynodeindex)

## Type aliases

### AttributeRefVariable

Ƭ **AttributeRefVariable**: [`VariableMappingBase`](core_types_variables.md#variablemappingbase)<[`attributeRef`](../enums/core_types_variables.MappingType.md#attributeref)\>

#### Defined in

js/source/core/types/variables.ts:33

___

### AttributeVariable

Ƭ **AttributeVariable**: { `attributeName`: `string` ; `hidden?`: `boolean`  } & [`VariableMappingBase`](core_types_variables.md#variablemappingbase)<[`attribute`](../enums/core_types_variables.MappingType.md#attribute)\>

#### Defined in

js/source/core/types/variables.ts:28

___

### ChildVariable

Ƭ **ChildVariable**: [`VariableMappingBase`](core_types_variables.md#variablemappingbase)<[`childVariable`](../enums/core_types_variables.MappingType.md#childvariable)\>

#### Defined in

js/source/core/types/variables.ts:26

___

### FoundVariables

Ƭ **FoundVariables**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `newRootElement` | `Element` |
| `variables` | [`VariableMappings`](core_types_variables.md#variablemappings) |

#### Defined in

js/source/core/types/variables.ts:75

___

### SpecialAttributeHandlerFn

Ƭ **SpecialAttributeHandlerFn**: (`elem`: `Element`) => [`SpecialAttributeHandlerFnResult`](core_types_variables.md#specialattributehandlerfnresult)

#### Type declaration

▸ (`elem`): [`SpecialAttributeHandlerFnResult`](core_types_variables.md#specialattributehandlerfnresult)

##### Parameters

| Name | Type |
| :------ | :------ |
| `elem` | `Element` |

##### Returns

[`SpecialAttributeHandlerFnResult`](core_types_variables.md#specialattributehandlerfnresult)

#### Defined in

js/source/core/types/variables.ts:57

___

### SpecialAttributeHandlerFnResult

Ƭ **SpecialAttributeHandlerFnResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `transformedElement?` | `HTMLElement` |
| `valueTransformer?` | [`SpecialAttributeValueTransformerFn`](core_types_variables.md#specialattributevaluetransformerfn) |
| `remapAttributeName?` | (`attributeNameProvided`: `string`) => `string` |

#### Defined in

js/source/core/types/variables.ts:51

___

### SpecialAttributeRegistration

Ƭ **SpecialAttributeRegistration**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `attributeName` | `string` |
| `handler` | [`SpecialAttributeHandlerFn`](core_types_variables.md#specialattributehandlerfn) |
| `hidden?` | `boolean` |
| `id` | `string` |
| `precedence` | `number` |

#### Defined in

js/source/core/types/variables.ts:59

___

### SpecialAttributeValueTransformerFn

Ƭ **SpecialAttributeValueTransformerFn**: (`element`: `Element`, `valuesBySlot`: `Record`<`string`, `unknown`\>) => `unknown`

#### Type declaration

▸ (`element`, `valuesBySlot`): `unknown`

##### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `Element` |
| `valuesBySlot` | `Record`<`string`, `unknown`\> |

##### Returns

`unknown`

#### Defined in

js/source/core/types/variables.ts:49

___

### SpecialAttributeVariable

Ƭ **SpecialAttributeVariable**: { `attributeName`: `string` ; `hidden?`: `boolean` ; `specialAttributeRegistration`: [`SpecialAttributeRegistration`](core_types_variables.md#specialattributeregistration)  } & [`VariableMappingBase`](core_types_variables.md#variablemappingbase)<[`specialAttribute`](../enums/core_types_variables.MappingType.md#specialattribute)\>

#### Defined in

js/source/core/types/variables.ts:35

___

### ValueTransformerFn

Ƭ **ValueTransformerFn**: <T\>(`node`: `Node`, `value`: `T`) => `T`

#### Type declaration

▸ <`T`\>(`node`, `value`): `T`

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Node` |
| `value` | `T` |

##### Returns

`T`

#### Defined in

js/source/core/types/variables.ts:15

___

### VariableMapping

Ƭ **VariableMapping**: [`VariableMappingBase`](core_types_variables.md#variablemappingbase)<[`MappingType`](../enums/core_types_variables.MappingType.md)\>

#### Defined in

js/source/core/types/variables.ts:24

___

### VariableMappingBase

Ƭ **VariableMappingBase**<`T`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`MappingType`](../enums/core_types_variables.MappingType.md) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expression` | [`BaseExpression`](core_types_expression_types.md#baseexpression) |
| `indexes` | `number`[] |
| `type` | `T` |
| `valueTransformer?` | [`ValueTransformerFn`](core_types_variables.md#valuetransformerfn) \| [`SpecialAttributeValueTransformerFn`](core_types_variables.md#specialattributevaluetransformerfn) |

#### Defined in

js/source/core/types/variables.ts:17

___

### VariableMappings

Ƭ **VariableMappings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `all` | `Object` |
| `all.__constants` | [`VariableMapping`](core_types_variables.md#variablemapping)[] |
| `sorted` | [`VariablesByNodeIndex`](core_types_variables.md#variablesbynodeindex)[] |

#### Defined in

js/source/core/types/variables.ts:67

___

### VariablesByNodeIndex

Ƭ **VariablesByNodeIndex**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `indexes` | `number`[] |
| `mappings` | `Object` |
| `mappings.__constants` | [`VariableMapping`](core_types_variables.md#variablemapping)[] |

#### Defined in

js/source/core/types/variables.ts:41

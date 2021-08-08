[modrn](../README.md) / [Exports](../modules.md) / core/types/modrn-html-element

# Module: core/types/modrn-html-element

## Table of contents

### Classes

- [ModrnHTMLElement](../classes/core_types_modrn_html_element.ModrnHTMLElement.md)

### Interfaces

- [ComponentState](../interfaces/core_types_modrn_html_element.ComponentState.md)
- [Stateful](../interfaces/core_types_modrn_html_element.Stateful.md)

### Type aliases

- [ComponentInfo](core_types_modrn_html_element.md#componentinfo)
- [Fragment](core_types_modrn_html_element.md#fragment)

## Type aliases

### ComponentInfo

Ƭ **ComponentInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `componentName` | `string` |
| `content` | [`Fragment`](core_types_modrn_html_element.md#fragment) \| ``null`` |
| `isSpecialAttribute` | `boolean` |
| `registeredComponent` | [`RegisteredComponent`](core_types_registered_component.md#registeredcomponent)<`unknown`, `unknown`\> |
| `tagName` | `string` |

#### Defined in

[js/source/core/types/modrn-html-element.ts:11](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/modrn-html-element.ts#L11)

___

### Fragment

Ƭ **Fragment**: `Object`

A fragment is the encapsulation of a html template analyzed for contained variables.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `childElement` | `Element` \| ``null`` |
| `variableDefinitions` | [`VariableMappings`](core_types_variables.md#variablemappings) \| ``null`` |

#### Defined in

[js/source/core/types/modrn-html-element.ts:39](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/modrn-html-element.ts#L39)

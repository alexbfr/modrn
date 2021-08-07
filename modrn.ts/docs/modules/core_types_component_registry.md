[modrn](../README.md) / [Exports](../modules.md) / core/types/component-registry

# Module: core/types/component-registry

## Table of contents

### Type aliases

- [ComponentRegistry](core_types_component_registry.md#componentregistry)
- [DisconnectedFunction](core_types_component_registry.md#disconnectedfunction)
- [HasConnectedFunction](core_types_component_registry.md#hasconnectedfunction)
- [NotifyChildrenChangedFunction](core_types_component_registry.md#notifychildrenchangedfunction)

### Functions

- [addToComponentRegistry](core_types_component_registry.md#addtocomponentregistry)
- [getAndResetComponentsToRegister](core_types_component_registry.md#getandresetcomponentstoregister)
- [getComponentInfoOf](core_types_component_registry.md#getcomponentinfoof)
- [getComponentRegistry](core_types_component_registry.md#getcomponentregistry)
- [isRegisteredTagName](core_types_component_registry.md#isregisteredtagname)

## Type aliases

### ComponentRegistry

Ƭ **ComponentRegistry**: `Object`

#### Index signature

▪ [componentName: `string`]: [`ComponentInfo`](core_types_modrn_html_element.md#componentinfo)

#### Defined in

js/source/core/types/component-registry.ts:10

___

### DisconnectedFunction

Ƭ **DisconnectedFunction**: (`self`: [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md), `componentInfo`: [`ComponentInfo`](core_types_modrn_html_element.md#componentinfo)) => `void`

#### Type declaration

▸ (`self`, `componentInfo`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `self` | [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md) |
| `componentInfo` | [`ComponentInfo`](core_types_modrn_html_element.md#componentinfo) |

##### Returns

`void`

#### Defined in

js/source/core/types/component-registry.ts:16

___

### HasConnectedFunction

Ƭ **HasConnectedFunction**: (`self`: [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md), `componentInfo`: [`ComponentInfo`](core_types_modrn_html_element.md#componentinfo)) => `void`

#### Type declaration

▸ (`self`, `componentInfo`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `self` | [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md) |
| `componentInfo` | [`ComponentInfo`](core_types_modrn_html_element.md#componentinfo) |

##### Returns

`void`

#### Defined in

js/source/core/types/component-registry.ts:14

___

### NotifyChildrenChangedFunction

Ƭ **NotifyChildrenChangedFunction**: (`self`: [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md), `componentInfo`: [`ComponentInfo`](core_types_modrn_html_element.md#componentinfo), `childFragment`: [`Fragment`](core_types_modrn_html_element.md#fragment)) => `void`

#### Type declaration

▸ (`self`, `componentInfo`, `childFragment`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `self` | [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md) |
| `componentInfo` | [`ComponentInfo`](core_types_modrn_html_element.md#componentinfo) |
| `childFragment` | [`Fragment`](core_types_modrn_html_element.md#fragment) |

##### Returns

`void`

#### Defined in

js/source/core/types/component-registry.ts:15

## Functions

### addToComponentRegistry

▸ **addToComponentRegistry**(`componentName`, `component`): [`ComponentInfo`](core_types_modrn_html_element.md#componentinfo)

Adds a component to the global registry without directly registering it as custom element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `componentName` | `string` | the js-name of the new component (i.e. without dashes) |
| `component` | [`RegisteredComponent`](core_types_registered_component.md#registeredcomponent)<`unknown`, `unknown`\> | the component to register |

#### Returns

[`ComponentInfo`](core_types_modrn_html_element.md#componentinfo)

#### Defined in

js/source/core/types/component-registry.ts:43

___

### getAndResetComponentsToRegister

▸ **getAndResetComponentsToRegister**(): [`ComponentInfo`](core_types_modrn_html_element.md#componentinfo)[]

#### Returns

[`ComponentInfo`](core_types_modrn_html_element.md#componentinfo)[]

#### Defined in

js/source/core/types/component-registry.ts:58

___

### getComponentInfoOf

▸ **getComponentInfoOf**(`registeredComponent`): [`ComponentInfo`](core_types_modrn_html_element.md#componentinfo) \| `undefined`

Returns the component info for a certain registered component

#### Parameters

| Name | Type |
| :------ | :------ |
| `registeredComponent` | [`RegisteredComponent`](core_types_registered_component.md#registeredcomponent)<`unknown`, `unknown`\> |

#### Returns

[`ComponentInfo`](core_types_modrn_html_element.md#componentinfo) \| `undefined`

#### Defined in

js/source/core/types/component-registry.ts:68

___

### getComponentRegistry

▸ **getComponentRegistry**(): [`ComponentRegistry`](core_types_component_registry.md#componentregistry)

Returns a copy of the component registry

#### Returns

[`ComponentRegistry`](core_types_component_registry.md#componentregistry)

#### Defined in

js/source/core/types/component-registry.ts:30

___

### isRegisteredTagName

▸ **isRegisteredTagName**(`tagName`): `boolean`

Checks if the provided tagName (html-named) is already registered

#### Parameters

| Name | Type |
| :------ | :------ |
| `tagName` | `string` |

#### Returns

`boolean`

#### Defined in

js/source/core/types/component-registry.ts:22

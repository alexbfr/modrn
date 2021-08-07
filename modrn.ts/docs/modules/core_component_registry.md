[modrn](../README.md) / [Exports](../modules.md) / core/component-registry

# Module: core/component-registry

## Table of contents

### Functions

- [register](core_component_registry.md#register)
- [registerAll](core_component_registry.md#registerall)
- [registerModule](core_component_registry.md#registermodule)
- [setStaticInitializationResultForComponent](core_component_registry.md#setstaticinitializationresultforcomponent)

## Functions

### register

▸ **register**(`componentInfo`, `hasConnectedFn`, `notifyChildrenChangedFn`, `disconnectedFn`): `CustomElementConstructor`

Registers the component and creates a custom element for it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `componentInfo` | [`ComponentInfo`](core_types_modrn_html_element.md#componentinfo) | the component |
| `hasConnectedFn` | [`HasConnectedFunction`](core_types_component_registry.md#hasconnectedfunction) | the connected callback function (called when mounted) |
| `notifyChildrenChangedFn` | [`NotifyChildrenChangedFunction`](core_types_component_registry.md#notifychildrenchangedfunction) | the (custom) callback function when dynamic children change |
| `disconnectedFn` | [`DisconnectedFunction`](core_types_component_registry.md#disconnectedfunction) | the disconnected callback function (called when unmounted) |

#### Returns

`CustomElementConstructor`

#### Defined in

js/source/core/component-registry.ts:48

___

### registerAll

▸ **registerAll**(`hasConnectedFn`, `notifyChildrenChangedFn`, `disconnectedFn`): `void`

Register all components in the component registry at once.

**`see`** register

#### Parameters

| Name | Type |
| :------ | :------ |
| `hasConnectedFn` | [`HasConnectedFunction`](core_types_component_registry.md#hasconnectedfunction) |
| `notifyChildrenChangedFn` | [`NotifyChildrenChangedFunction`](core_types_component_registry.md#notifychildrenchangedfunction) |
| `disconnectedFn` | [`DisconnectedFunction`](core_types_component_registry.md#disconnectedfunction) |

#### Returns

`void`

#### Defined in

js/source/core/component-registry.ts:106

___

### registerModule

▸ **registerModule**<`M`, `K`\>(`module`): `void`

Adds a module to the global registry by adding each individual registered component.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | `M` |
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `module` | [`Module`](core_types_registered_component.md#module)<`M`, `K`\> |

#### Returns

`void`

#### Defined in

js/source/core/component-registry.ts:25

___

### setStaticInitializationResultForComponent

▸ **setStaticInitializationResultForComponent**(`componentName`, `content`): `void`

Updates the component registry with the static initialization result of the component (js-named, i.e.
without dashes)

#### Parameters

| Name | Type |
| :------ | :------ |
| `componentName` | `string` |
| `content` | [`Fragment`](core_types_modrn_html_element.md#fragment) |

#### Returns

`void`

#### Defined in

js/source/core/component-registry.ts:37

[modrn](../README.md) / [Exports](../modules.md) / core/component-static-initialize

# Module: core/component-static-initialize

## Table of contents

### Functions

- [componentStaticInitialize](core_component_static_initialize.md#componentstaticinitialize)
- [initializeAll](core_component_static_initialize.md#initializeall)

## Functions

### componentStaticInitialize

▸ **componentStaticInitialize**(`componentName`, `component`): `void`

Performs the static (one-time) initialization for the provided component.

#### Parameters

| Name | Type |
| :------ | :------ |
| `componentName` | `string` |
| `component` | [`RegisteredComponent`](core_types_registered_component.md#registeredcomponent)<`unknown`, `unknown`\> |

#### Returns

`void`

#### Defined in

[js/source/core/component-static-initialize.ts:29](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/component-static-initialize.ts#L29)

___

### initializeAll

▸ **initializeAll**(`componentRegistry`): `void`

Statically initialize all components currently registered

#### Parameters

| Name | Type |
| :------ | :------ |
| `componentRegistry` | [`ComponentRegistry`](core_types_component_registry.md#componentregistry) |

#### Returns

`void`

#### Defined in

[js/source/core/component-static-initialize.ts:46](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/component-static-initialize.ts#L46)

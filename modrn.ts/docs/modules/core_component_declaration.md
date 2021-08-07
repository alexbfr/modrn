[modrn](../README.md) / [Exports](../modules.md) / core/component-declaration

# Module: core/component-declaration

## Table of contents

### Functions

- [declare](core_component_declaration.md#declare)
- [makeComponent](core_component_declaration.md#makecomponent)

## Functions

### declare

▸ **declare**<`M`, `K`\>(`module`): [`ModuleResult`](core_types_registered_component.md#moduleresult)<`M`, `K`\>

Declares a module consisting of the provided registered components. Modules will later be registered by calling
start with the list of modules. The declaration is global, since web components are globally registered.

**`see`** modrn

**`example`**
const myComponent = makeComponent().html(`<h1>Hello world</h1>`).register();
const myModule = declare({myComponent});

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | `M` |
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `module` | [`Module`](core_types_registered_component.md#module)<`M`, `K`\> | the Module consisting of registered components to declare |

#### Returns

[`ModuleResult`](core_types_registered_component.md#moduleresult)<`M`, `K`\>

#### Defined in

js/source/core/component-declaration.ts:29

___

### makeComponent

▸ **makeComponent**<`T`, `R`\>(`propsType?`, `renderFn?`): [`ComponentBuilder`](core_types_component_builder.md#componentbuilder)<`T`, `R`\>

Creates a component, having a defined set of props (optional) and a render function (also optional). If the render function
is omitted, the props are passed directly to the template as variables. If props are omitted, the component does not have any props.

The return value is a builder, which allows to further configure the component {@see ComponentBuilder} like for example making the
component transparent (i.e. passing all incoming props to the resulting template variables, even if not returned) or declaring
the component expects dynamic children (commonly named "slots").

#### Type parameters

| Name |
| :------ |
| `T` |
| `R` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `propsType?` | [`Container`](core_types_prop_types.md#container) & `T` | The expected props (optional) |
| `renderFn?` | (`props`: `T` & [`AllProps`](core_types_registered_component.md#allprops)) => `R` \| ``null`` | The render function (optional) |

#### Returns

[`ComponentBuilder`](core_types_component_builder.md#componentbuilder)<`T`, `R`\>

#### Defined in

js/source/core/component-declaration.ts:55

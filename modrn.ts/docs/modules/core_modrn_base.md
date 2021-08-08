[modrn](../README.md) / [Exports](../modules.md) / core/modrn-base

# Module: core/modrn-base

## Table of contents

### Functions

- [childrenChanged](core_modrn_base.md#childrenchanged)
- [componentHasConnected](core_modrn_base.md#componenthasconnected)
- [componentHasDisconnected](core_modrn_base.md#componenthasdisconnected)
- [only](core_modrn_base.md#only)

## Functions

### childrenChanged

▸ **childrenChanged**(`self`, `componentInfo`, `childFragment`): `void`

Called when the dynamic children change. Does not implicitly re-render, since this is usually happening
inside a render cycle.

#### Parameters

| Name | Type |
| :------ | :------ |
| `self` | [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md) |
| `componentInfo` | [`ComponentInfo`](core_types_modrn_html_element.md#componentinfo) |
| `childFragment` | [`Fragment`](core_types_modrn_html_element.md#fragment) |

#### Returns

`void`

#### Defined in

[js/source/core/modrn-base.ts:149](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/modrn-base.ts#L149)

___

### componentHasConnected

▸ **componentHasConnected**(`self`, `componentInfo`): `void`

Component has connected callback function. This function may be called multiple times and guards itself against that.

#### Parameters

| Name | Type |
| :------ | :------ |
| `self` | [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md) |
| `componentInfo` | [`ComponentInfo`](core_types_modrn_html_element.md#componentinfo) |

#### Returns

`void`

#### Defined in

[js/source/core/modrn-base.ts:109](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/modrn-base.ts#L109)

___

### componentHasDisconnected

▸ **componentHasDisconnected**(`self`): `void`

Called when the component unmounts. Calls disconnect functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `self` | [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md) |

#### Returns

`void`

#### Defined in

[js/source/core/modrn-base.ts:134](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/modrn-base.ts#L134)

___

### only

▸ **only**(`componentName`, `component`): [`ComponentInfo`](core_types_modrn_html_element.md#componentinfo)

Mostly to help tests: this method registers *and* initializes the provided component in one go.

#### Parameters

| Name | Type |
| :------ | :------ |
| `componentName` | `string` |
| `component` | [`RegisteredComponent`](core_types_registered_component.md#registeredcomponent)<`unknown`, `unknown`\> |

#### Returns

[`ComponentInfo`](core_types_modrn_html_element.md#componentinfo)

#### Defined in

[js/source/core/modrn-base.ts:162](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/modrn-base.ts#L162)

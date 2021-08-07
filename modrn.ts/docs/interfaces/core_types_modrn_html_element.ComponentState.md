[modrn](../README.md) / [Exports](../modules.md) / [core/types/modrn-html-element](../modules/core_types_modrn_html_element.md) / ComponentState

# Interface: ComponentState

[core/types/modrn-html-element](../modules/core_types_modrn_html_element.md).ComponentState

## Hierarchy

- [`Stateful`](core_types_modrn_html_element.Stateful.md)

  ↳ **`ComponentState`**

## Table of contents

### Properties

- [addedChildElements](core_types_modrn_html_element.ComponentState.md#addedchildelements)
- [customProps](core_types_modrn_html_element.ComponentState.md#customprops)
- [disconnected](core_types_modrn_html_element.ComponentState.md#disconnected)
- [previousChild](core_types_modrn_html_element.ComponentState.md#previouschild)
- [state](core_types_modrn_html_element.ComponentState.md#state)

### Methods

- [getOwner](core_types_modrn_html_element.ComponentState.md#getowner)
- [update](core_types_modrn_html_element.ComponentState.md#update)

## Properties

### addedChildElements

• **addedChildElements**: `WeakSet`<`ChildNode`\>

#### Defined in

js/source/core/types/modrn-html-element.ts:20

___

### customProps

• **customProps**: `Record`<`string`, `unknown`\>

#### Defined in

js/source/core/types/modrn-html-element.ts:22

___

### disconnected

• **disconnected**: () => `void`[]

#### Inherited from

[Stateful](core_types_modrn_html_element.Stateful.md).[disconnected](core_types_modrn_html_element.Stateful.md#disconnected)

#### Defined in

js/source/core/types/modrn-html-element.ts:8

___

### previousChild

• **previousChild**: ``null`` \| [`Fragment`](../modules/core_types_modrn_html_element.md#fragment)

#### Defined in

js/source/core/types/modrn-html-element.ts:21

___

### state

• **state**: `Object`

#### Index signature

▪ [name: `string`]: `unknown`

#### Inherited from

[Stateful](core_types_modrn_html_element.Stateful.md).[state](core_types_modrn_html_element.Stateful.md#state)

#### Defined in

js/source/core/types/modrn-html-element.ts:6

## Methods

### getOwner

▸ **getOwner**(): [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md)

#### Returns

[`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md)

#### Overrides

[Stateful](core_types_modrn_html_element.Stateful.md).[getOwner](core_types_modrn_html_element.Stateful.md#getowner)

#### Defined in

js/source/core/types/modrn-html-element.ts:23

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Inherited from

[Stateful](core_types_modrn_html_element.Stateful.md).[update](core_types_modrn_html_element.Stateful.md#update)

#### Defined in

js/source/core/types/modrn-html-element.ts:7

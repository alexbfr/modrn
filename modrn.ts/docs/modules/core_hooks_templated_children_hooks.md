[modrn](../README.md) / [Exports](../modules.md) / core/hooks/templated-children-hooks

# Module: core/hooks/templated-children-hooks

## Table of contents

### Type aliases

- [ChildrenStateToken](core_hooks_templated_children_hooks.md#childrenstatetoken)
- [TemplatedChildrenStateToken](core_hooks_templated_children_hooks.md#templatedchildrenstatetoken)

### Functions

- [createChildrenState](core_hooks_templated_children_hooks.md#createchildrenstate)
- [createTemplatedChildrenState](core_hooks_templated_children_hooks.md#createtemplatedchildrenstate)
- [useChild](core_hooks_templated_children_hooks.md#usechild)
- [useChildren](core_hooks_templated_children_hooks.md#usechildren)
- [useModrnChild](core_hooks_templated_children_hooks.md#usemodrnchild)
- [useModrnChildren](core_hooks_templated_children_hooks.md#usemodrnchildren)
- [useTemplate](core_hooks_templated_children_hooks.md#usetemplate)
- [useTemplatedChildren](core_hooks_templated_children_hooks.md#usetemplatedchildren)

## Type aliases

### ChildrenStateToken

Ƭ **ChildrenStateToken**: [`StateToken`](util_state.md#statetoken)<`ChildrenByKey`\>

#### Defined in

[js/source/core/hooks/templated-children-hooks.ts:150](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/hooks/templated-children-hooks.ts#L150)

___

### TemplatedChildrenStateToken

Ƭ **TemplatedChildrenStateToken**: [`StateToken`](util_state.md#statetoken)<`TemplatedChildrenByKey`\>

#### Defined in

[js/source/core/hooks/templated-children-hooks.ts:156](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/hooks/templated-children-hooks.ts#L156)

## Functions

### createChildrenState

▸ **createChildrenState**(): [`ChildrenStateToken`](core_hooks_templated_children_hooks.md#childrenstatetoken)

#### Returns

[`ChildrenStateToken`](core_hooks_templated_children_hooks.md#childrenstatetoken)

#### Defined in

[js/source/core/hooks/templated-children-hooks.ts:152](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/hooks/templated-children-hooks.ts#L152)

___

### createTemplatedChildrenState

▸ **createTemplatedChildrenState**(): [`TemplatedChildrenStateToken`](core_hooks_templated_children_hooks.md#templatedchildrenstatetoken)

#### Returns

[`TemplatedChildrenStateToken`](core_hooks_templated_children_hooks.md#templatedchildrenstatetoken)

#### Defined in

[js/source/core/hooks/templated-children-hooks.ts:158](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/hooks/templated-children-hooks.ts#L158)

___

### useChild

▸ **useChild**(`childProps`, `childStateToken?`): [`ChildCollection`](core_types_prop_types.md#childcollection)

#### Parameters

| Name | Type |
| :------ | :------ |
| `childProps` | `Record`<`string`, `unknown`\> \| ``null`` |
| `childStateToken` | [`ChildrenStateToken`](core_hooks_templated_children_hooks.md#childrenstatetoken) |

#### Returns

[`ChildCollection`](core_types_prop_types.md#childcollection)

#### Defined in

[js/source/core/hooks/templated-children-hooks.ts:240](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/hooks/templated-children-hooks.ts#L240)

___

### useChildren

▸ **useChildren**<`T`\>(`iterateOver`, `basicChildProps`, `itemAs?`, `indexAs?`, `childStateToken?`): [`ChildCollection`](core_types_prop_types.md#childcollection)

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `iterateOver` | `T`[] | `undefined` |
| `basicChildProps` | `Record`<`string`, `unknown`\> | `undefined` |
| `itemAs` | `string` | `"item"` |
| `indexAs` | `string` | `"index"` |
| `childStateToken` | [`ChildrenStateToken`](core_hooks_templated_children_hooks.md#childrenstatetoken) | `undefined` |

#### Returns

[`ChildCollection`](core_types_prop_types.md#childcollection)

#### Defined in

[js/source/core/hooks/templated-children-hooks.ts:282](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/hooks/templated-children-hooks.ts#L282)

___

### useModrnChild

▸ **useModrnChild**<`T`, `R`\>(`childStateToken`, `component`, `props`): [`ChildCollection`](core_types_prop_types.md#childcollection)

#### Type parameters

| Name |
| :------ |
| `T` |
| `R` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `childStateToken` | [`ChildrenStateToken`](core_hooks_templated_children_hooks.md#childrenstatetoken) |
| `component` | [`RegisteredComponent`](core_types_registered_component.md#registeredcomponent)<`T`, `R`\> |
| `props` | `T` & `Record`<`string`, `unknown`\> \| ``null`` |

#### Returns

[`ChildCollection`](core_types_prop_types.md#childcollection)

#### Defined in

[js/source/core/hooks/templated-children-hooks.ts:248](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/hooks/templated-children-hooks.ts#L248)

___

### useModrnChildren

▸ **useModrnChildren**<`T`, `R`\>(`childStateToken`, `component`, `props`): [`ChildCollection`](core_types_prop_types.md#childcollection)

#### Type parameters

| Name |
| :------ |
| `T` |
| `R` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `childStateToken` | [`ChildrenStateToken`](core_hooks_templated_children_hooks.md#childrenstatetoken) |
| `component` | [`RegisteredComponent`](core_types_registered_component.md#registeredcomponent)<`T`, `R`\> |
| `props` | `T` & `Record`<`string`, `unknown`\>[] |

#### Returns

[`ChildCollection`](core_types_prop_types.md#childcollection)

#### Defined in

[js/source/core/hooks/templated-children-hooks.ts:266](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/hooks/templated-children-hooks.ts#L266)

___

### useTemplate

▸ **useTemplate**(`sourceProvided`, `childProps?`, `childStateToken?`): [`ChildCollection`](core_types_prop_types.md#childcollection)

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceProvided` | `HTMLElement` \| `string` \| [`RegisteredComponent`](core_types_registered_component.md#registeredcomponent)<`unknown`, `unknown`\> |
| `childProps?` | `Record`<`string`, `unknown`\> |
| `childStateToken` | [`ChildrenStateToken`](core_hooks_templated_children_hooks.md#childrenstatetoken) |

#### Returns

[`ChildCollection`](core_types_prop_types.md#childcollection)

#### Defined in

[js/source/core/hooks/templated-children-hooks.ts:199](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/hooks/templated-children-hooks.ts#L199)

___

### useTemplatedChildren

▸ **useTemplatedChildren**<`T`, `P`\>(`stateToken`, `items`, `configFn`, `templateIfMissing?`): [`ChildCollection`](core_types_prop_types.md#childcollection)

This is the main function of the children handling. There are other variants following in this file, but this is the
central function.

The basic process is to store the previously existing children in a state, and to compare each render cycle if props,
template or number of children change, and if so, to re-render those accordingly.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `P` | extends `Record`<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateToken` | [`ChildrenStateToken`](core_hooks_templated_children_hooks.md#childrenstatetoken) |
| `items` | `T`[] |
| `configFn` | `ChildConfigurationFunction`<`T`, `P`\> |
| `templateIfMissing?` | [`Fragment`](core_types_modrn_html_element.md#fragment) |

#### Returns

[`ChildCollection`](core_types_prop_types.md#childcollection)

#### Defined in

[js/source/core/hooks/templated-children-hooks.ts:30](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/hooks/templated-children-hooks.ts#L30)

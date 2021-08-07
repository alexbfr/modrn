[modrn](../README.md) / [Exports](../modules.md) / core/hooks/ref-hooks

# Module: core/hooks/ref-hooks

## Table of contents

### Type aliases

- [Ref](core_hooks_ref_hooks.md#ref)
- [RefInternal](core_hooks_ref_hooks.md#refinternal)
- [RefMap](core_hooks_ref_hooks.md#refmap)
- [RefState](core_hooks_ref_hooks.md#refstate)

### Functions

- [createRef](core_hooks_ref_hooks.md#createref)
- [useRef](core_hooks_ref_hooks.md#useref)

## Type aliases

### Ref

Ƭ **Ref**: `HTMLElement`[]

#### Defined in

js/source/core/hooks/ref-hooks.ts:37

___

### RefInternal

Ƭ **RefInternal**: [`Ref`](core_hooks_ref_hooks.md#ref) & { `__addRef`: (`htmlElement`: `HTMLElement`) => `void` ; `__update`: () => `void`  }

#### Defined in

js/source/core/hooks/ref-hooks.ts:39

___

### RefMap

Ƭ **RefMap**: `Object`

#### Index signature

▪ [refId: `string`]: `WeakRef`<`HTMLElement`\>

#### Defined in

js/source/core/hooks/ref-hooks.ts:13

___

### RefState

Ƭ **RefState**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `refs` | [`RefMap`](core_hooks_ref_hooks.md#refmap) |

#### Defined in

js/source/core/hooks/ref-hooks.ts:17

## Functions

### createRef

▸ **createRef**(): `RefStateToken`

#### Returns

`RefStateToken`

#### Defined in

js/source/core/hooks/ref-hooks.ts:33

___

### useRef

▸ **useRef**(`stateToken`): [`Ref`](core_hooks_ref_hooks.md#ref)

Create a ref given the state token. Refs are always lists of elements which are returned from the rendering function
and which are recognized by the variable substitution process by updating the ref'ed elements then on the fly.
That means that to have access to refs, another render cycle needs to follow. The variable substitution process
informs the ref container by calling 'addRef' or 'update' on it.

All refs are held as WeakRef; this should avoid garbage collection load. Refs are also checked for dom-containment,
so if a ref is not in the dom anymore, the ref is automatically dropped.

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateToken` | `RefStateToken` |

#### Returns

[`Ref`](core_hooks_ref_hooks.md#ref)

#### Defined in

js/source/core/hooks/ref-hooks.ts:55

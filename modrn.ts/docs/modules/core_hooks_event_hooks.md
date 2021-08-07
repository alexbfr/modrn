[modrn](../README.md) / [Exports](../modules.md) / core/hooks/event-hooks

# Module: core/hooks/event-hooks

## Table of contents

### Functions

- [createEventListener](core_hooks_event_hooks.md#createeventlistener)
- [useEventListener](core_hooks_event_hooks.md#useeventlistener)

## Functions

### createEventListener

▸ **createEventListener**(): `EventListenerStateToken`

#### Returns

`EventListenerStateToken`

#### Defined in

js/source/core/hooks/event-hooks.ts:22

___

### useEventListener

▸ **useEventListener**<`T`, `W`\>(`token`, `on`, `type`, `listener`): `void`

#### Type parameters

| Name |
| :------ |
| `T` |
| `W` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `EventListenerStateToken` |
| `on` | `EventListener`<`T`, `W`\> |
| `type` | `T` |
| `listener` | (`this`: `W`, `ev`: `never`) => `any` |

#### Returns

`void`

#### Defined in

js/source/core/hooks/event-hooks.ts:28

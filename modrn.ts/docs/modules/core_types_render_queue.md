[modrn](../README.md) / [Exports](../modules.md) / core/types/render-queue

# Module: core/types/render-queue

## Table of contents

### Type aliases

- [RenderQueueElement](core_types_render_queue.md#renderqueueelement)

### Functions

- [cancelUpdate](core_types_render_queue.md#cancelupdate)
- [getAndResetRenderQueue](core_types_render_queue.md#getandresetrenderqueue)
- [getRenderQueueLength](core_types_render_queue.md#getrenderqueuelength)
- [isTestingModeActive](core_types_render_queue.md#istestingmodeactive)
- [requestRender](core_types_render_queue.md#requestrender)
- [requestUpdate](core_types_render_queue.md#requestupdate)
- [setFrameRequestCallback](core_types_render_queue.md#setframerequestcallback)
- [setTestingModeActive](core_types_render_queue.md#settestingmodeactive)

## Type aliases

### RenderQueueElement

Ƭ **RenderQueueElement**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `element` | `WeakRef`<[`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md)\> |

#### Defined in

[js/source/core/types/render-queue.ts:8](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/render-queue.ts#L8)

## Functions

### cancelUpdate

▸ **cancelUpdate**(): `void`

#### Returns

`void`

#### Defined in

[js/source/core/types/render-queue.ts:57](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/render-queue.ts#L57)

___

### getAndResetRenderQueue

▸ **getAndResetRenderQueue**(): [`RenderQueueElement`](core_types_render_queue.md#renderqueueelement)[]

#### Returns

[`RenderQueueElement`](core_types_render_queue.md#renderqueueelement)[]

#### Defined in

[js/source/core/types/render-queue.ts:16](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/render-queue.ts#L16)

___

### getRenderQueueLength

▸ **getRenderQueueLength**(): `number`

#### Returns

`number`

#### Defined in

[js/source/core/types/render-queue.ts:36](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/render-queue.ts#L36)

___

### isTestingModeActive

▸ **isTestingModeActive**(): `boolean`

#### Returns

`boolean`

#### Defined in

[js/source/core/types/render-queue.ts:43](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/render-queue.ts#L43)

___

### requestRender

▸ **requestRender**(`selfProvided`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `selfProvided` | [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md) \| `string` |

#### Returns

`void`

#### Defined in

[js/source/core/types/render-queue.ts:23](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/render-queue.ts#L23)

___

### requestUpdate

▸ **requestUpdate**(): `void`

#### Returns

`void`

#### Defined in

[js/source/core/types/render-queue.ts:51](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/render-queue.ts#L51)

___

### setFrameRequestCallback

▸ **setFrameRequestCallback**(`_frameRequestCallback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_frameRequestCallback` | `FrameRequestCallback` |

#### Returns

`void`

#### Defined in

[js/source/core/types/render-queue.ts:64](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/render-queue.ts#L64)

___

### setTestingModeActive

▸ **setTestingModeActive**(): `void`

#### Returns

`void`

#### Defined in

[js/source/core/types/render-queue.ts:47](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/types/render-queue.ts#L47)

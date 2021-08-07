[modrn](../README.md) / [Exports](../modules.md) / core/change-detection/has-changed

# Module: core/change-detection/has-changed

## Table of contents

### Functions

- [hasArrayChanged](core_change_detection_has_changed.md#hasarraychanged)
- [hasChanged](core_change_detection_has_changed.md#haschanged)
- [hasObjectChanged](core_change_detection_has_changed.md#hasobjectchanged)

## Functions

### hasArrayChanged

▸ **hasArrayChanged**(`previousArr`, `nowArr`, `depth`): `boolean`

Checks if an array has changed up to a maximum recursion depth

#### Parameters

| Name | Type |
| :------ | :------ |
| `previousArr` | `unknown`[] |
| `nowArr` | `unknown`[] |
| `depth` | `number` |

#### Returns

`boolean`

#### Defined in

js/source/core/change-detection/has-changed.ts:38

___

### hasChanged

▸ **hasChanged**(`previous`, `now`, `depth`): `boolean`

Checks if an object has changed up to a maximum recursion depth

#### Parameters

| Name | Type |
| :------ | :------ |
| `previous` | `unknown` |
| `now` | `unknown` |
| `depth` | `number` |

#### Returns

`boolean`

#### Defined in

js/source/core/change-detection/has-changed.ts:14

___

### hasObjectChanged

▸ **hasObjectChanged**(`previous`, `value`, `depth`): `boolean`

Checks if an object has changed up to a maximum recursion depth

#### Parameters

| Name | Type |
| :------ | :------ |
| `previous` | `Record`<`string`, `unknown`\> |
| `value` | `Record`<`string`, `unknown`\> |
| `depth` | `number` |

#### Returns

`boolean`

#### Defined in

js/source/core/change-detection/has-changed.ts:65

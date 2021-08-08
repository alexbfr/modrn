[modrn](../README.md) / [Exports](../modules.md) / core/change-detection/has-function-changes

# Module: core/change-detection/has-function-changes

## Table of contents

### Functions

- [hasFunctionChanged](core_change_detection_has_function_changes.md#hasfunctionchanged)

## Functions

### hasFunctionChanged

▸ **hasFunctionChanged**(`previous`, `valueToSet`): `boolean`

Checks if a function has changed. If the function is dynamic {@see dynamic}, it is strictly compared for equality,
which means it changes during each re-render. If the function is state-bound {@see purify}, it is considered
inequal only if the state has changed in between. @TODO this is probably not even necessary, write test

#### Parameters

| Name | Type |
| :------ | :------ |
| `previous` | `unknown` |
| `valueToSet` | `unknown` |

#### Returns

`boolean`

#### Defined in

[js/source/core/change-detection/has-function-changes.ts:24](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/change-detection/has-function-changes.ts#L24)

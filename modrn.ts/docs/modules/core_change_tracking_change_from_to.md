[modrn](../README.md) / [Exports](../modules.md) / core/change-tracking/change-from-to

# Module: core/change-tracking/change-from-to

## Table of contents

### Functions

- [changeFromTo](core_change_tracking_change_from_to.md#changefromto)

## Functions

### changeFromTo

▸ **changeFromTo**(`previous`, `now`, `forConsumer`): [`ApplyResult`](../interfaces/core_change_tracking_change_types.ApplyResult.md)

Called after a variable has been applied with the previous and current value.
This is not a simple copy of {@see hasChanged} but a specific implementation to deal with the specifics of the
underlying DOM data model.

#### Parameters

| Name | Type |
| :------ | :------ |
| `previous` | `unknown` |
| `now` | `unknown` |
| `forConsumer` | [`ModrnHTMLElement`](../classes/core_types_modrn_html_element.ModrnHTMLElement.md) |

#### Returns

[`ApplyResult`](../interfaces/core_change_tracking_change_types.ApplyResult.md)

#### Defined in

[js/source/core/change-tracking/change-from-to.ts:24](https://github.com/alexbfr/modrn/blob/e23b9e9/modrn.ts/js/source/core/change-tracking/change-from-to.ts#L24)

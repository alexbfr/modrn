[modrn](../README.md) / [Exports](../modules.md) / [test-utils/test-utils](../modules/test_utils_test_utils.md) / TestUtils

# Class: TestUtils

[test-utils/test-utils](../modules/test_utils_test_utils.md).TestUtils

## Table of contents

### Constructors

- [constructor](test_utils_test_utils.TestUtils.md#constructor)

### Methods

- [\_mapObjectToHTMLAttributes](test_utils_test_utils.TestUtils.md#_mapobjecttohtmlattributes)
- [\_renderToDocument](test_utils_test_utils.TestUtils.md#_rendertodocument)
- [\_waitForComponentToRender](test_utils_test_utils.TestUtils.md#_waitforcomponenttorender)
- [render](test_utils_test_utils.TestUtils.md#render)

## Constructors

### constructor

• **new TestUtils**()

## Methods

### \_mapObjectToHTMLAttributes

▸ `Static` **_mapObjectToHTMLAttributes**(`attributes`): `string`

Converts an object to HTML string representation of attributes.

For example: `{ foo: "bar", baz: "foo" }`
becomes `foo="bar" baz="foo"`

#### Parameters

| Name | Type |
| :------ | :------ |
| `attributes` | `any` |

#### Returns

`string`

#### Defined in

js/source/test-utils/test-utils.ts:50

___

### \_renderToDocument

▸ `Static` **_renderToDocument**(`tag`, `attributes`): `void`

Replaces document's body with provided element
including given attributes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tag` | `string` |
| `attributes` | `any` |

#### Returns

`void`

#### Defined in

js/source/test-utils/test-utils.ts:36

___

### \_waitForComponentToRender

▸ `Static` **_waitForComponentToRender**(`tag`): `Promise`<`unknown`\>

Returns a promise which resolves as soon as
requested element becomes available.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tag` | `string` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

js/source/test-utils/test-utils.ts:62

___

### render

▸ `Static` **render**(`tag`, `attributes?`): `Promise`<`unknown`\>

Renders a given element with provided attributes
and returns a promise which resolves as soon as
rendered element becomes available.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tag` | `string` |
| `attributes` | `any` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

js/source/test-utils/test-utils.ts:19

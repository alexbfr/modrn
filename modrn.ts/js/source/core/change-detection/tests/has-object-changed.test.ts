/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {hasObjectChanged} from "../has-changed";

it("Treats two empty objects as equal", () => {
    const actual = hasObjectChanged({}, {}, 0);
    expect(actual).toBeFalse();
});

it("Treats two objects with same key and value as equal", () => {
    const actual = hasObjectChanged({value: 123},  {value: 123}, 0);
    expect(actual).toBeFalse();
});

it("Treats two objects with same key and different value as not equal", () => {
    const actual = hasObjectChanged({value: 123},  {value: 124}, 0);
    expect(actual).toBeTrue();
});

it("Treats two objects with different key as not equal", () => {
    const actual = hasObjectChanged({value: 123},  {value2: 124}, 0);
    expect(actual).toBeTrue();
});

it("Treats two objects with previous being a subset of now as not equal", () => {
    const actual = hasObjectChanged({value1: 123, value2: "foo", bar: true},  {value1: 123, value2: "foo", bar: true, quux: {}}, 0);
    expect(actual).toBeTrue();
});

it("Treats two objects with now being a subset of previous as not equal", () => {
    const actual = hasObjectChanged({value1: 123, value2: "foo", bar: true, quux: {}}, {value1: 123, value2: "foo", bar: true}, 0);
    expect(actual).toBeTrue();
});

it("Treats two objects with same keys and values but different order as equal", () => {
    const quux = {};
    const actual = hasObjectChanged({value1: 123, value2: "foo", bar: true, quux}, {value1: 123, quux, value2: "foo", bar: true}, 0);
    expect(actual).toBeFalse();
});

it("Treats two objects with same keys and values except one value is null and one is undefined as not equal", () => {
    const actual = hasObjectChanged({value1: 123, value2: "foo", bar: true, quux: null}, {value1: 123, value2: "foo", bar: true, quux: undefined}, 0);
    expect(actual).toBeTrue();
});

it("Treats two objects with same keys and values except one different empty object instance as not equal", () => {
    const actual = hasObjectChanged({value1: 123, value2: "foo", bar: true, quux: {}}, {value1: 123, value2: "foo", bar: true, quux: {}}, 0);
    expect(actual).toBeTrue();
});

it("Treats two objects with same keys and values except one different empty object instance as equal with depth 1", () => {
    const actual = hasObjectChanged({value1: 123, value2: "foo", bar: true, quux: {}}, {value1: 123, value2: "foo", bar: true, quux: {}}, 1);
    expect(actual).toBeFalse();
});

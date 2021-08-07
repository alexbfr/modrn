/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {hasArrayChanged} from "../has-changed";

it("Treats two empty arrays as equal", () => {
    const actual = hasArrayChanged([], [], 0);
    expect(actual).toBeFalse();
});

it("Treats two arrays of one same primitive value as equal", () => {
    const actual = hasArrayChanged(["foo"], ["foo"], 0);
    expect(actual).toBeFalse();
});

it("Treats two arrays of one same object value as equal", () => {
    const quux = {};
    const actual = hasArrayChanged([quux], [quux], 0);
    expect(actual).toBeFalse();
});

it("Treats two arrays of one null value as equal", () => {
    const actual = hasArrayChanged([null], [null], 0);
    expect(actual).toBeFalse();
});

it("Treats two arrays of one undefined value as equal", () => {
    const actual = hasArrayChanged([undefined], [undefined], 0);
    expect(actual).toBeFalse();
});

it("Treats two arrays of one undefined value vs one null value as not equal", () => {
    const actual = hasArrayChanged([undefined], [null], 0);
    expect(actual).toBeTrue();
});

it("Treats two arrays of unequal size as not equal", () => {
    const actual = hasArrayChanged([1, 2, 3], [1, 2, 3, 4], 0);
    expect(actual).toBeTrue();
});

it("Treats two arrays of unequal size as not equal (2)", () => {
    const actual = hasArrayChanged([1, 2, 3, 4], [1, 2, 3], 0);
    expect(actual).toBeTrue();
});

it("Treats two arrays of equal size but different value somewhere as not equal", () => {
    const actual = hasArrayChanged([1, 2, 3, 4], [1, 2, 5, 4], 0);
    expect(actual).toBeTrue();
});

it("Treats two arrays with one different object instance as not equal", () => {
    const actual = hasArrayChanged([1, 2, {}, 4], [1, 2, {}, 4], 0);
    expect(actual).toBeTrue();
});

it("Treats two arrays with one different object instance as equal with depth 1", () => {
    const actual = hasArrayChanged([1, 2, {}, 4], [1, 2, {}, 4], 1);
    expect(actual).toBeFalse();
});

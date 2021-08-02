/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {immodify, replaceWith} from "../immodify";

it("Works for one string property", () => {
    const previous = {someData: "someValue"};
    const actual = immodify(previous, {someData: "someOtherValue"});

    expect(previous).toEqual({someData: "someValue"});
    expect(actual).toEqual({someData: "someOtherValue"});
});

it("Works for one number property", () => {
    const previous = {someData: 123};
    const actual = immodify(previous, {someData: 234});

    expect(previous).toEqual({someData: 123});
    expect(actual).toEqual({someData: 234});
});

it("Works for an array property", () => {
    const previous = {someData: [1,2,3]};
    const actual = immodify(previous, {someData: [2,3,4]});

    expect(previous).toEqual({someData: [1,2,3]});
    expect(actual).toEqual({someData: [2,3,4]});
});

it("Replaces one string property and leaves others intact", () => {
    const previous = {someData: "someValue", someOtherValue: 123, someArray: [1,2,3]};
    const actual = immodify(previous, {someData: "someOtherValue"});

    expect(previous).toEqual({someData: "someValue", someOtherValue: 123, someArray: [1,2,3]});
    expect(actual).toEqual({someData: "someOtherValue", someOtherValue: 123, someArray: [1,2,3]});
});

it("Replaces one number property and leaves others intact", () => {
    const previous = {someData: "someValue", someOtherValue: 123, someArray: [1,2,3]};
    const actual = immodify(previous, {someOtherValue: 234});

    expect(previous).toEqual({someData: "someValue", someOtherValue: 123, someArray: [1,2,3]});
    expect(actual).toEqual({someData: "someValue", someOtherValue: 234, someArray: [1,2,3]});
});

it("Replaces one array property and leaves others intact", () => {
    const previous = {someData: "someValue", someOtherValue: 123, someArray: [1,2,3]};
    const actual = immodify(previous, {someArray: [2,3,4]});

    expect(previous).toEqual({someData: "someValue", someOtherValue: 123, someArray: [1,2,3]});
    expect(actual).toEqual({someData: "someValue", someOtherValue: 123, someArray: [2,3,4]});
});

it("Replaces a property in a nested object and leaves others intact", () => {
    const previous = {someData: "someValue", someOtherValue: 123, someArray: [1,2,3], someObj: {a: 123, b: "string"}};
    const actual = immodify(previous, {someObj: {a: 234}});

    expect(previous).toEqual({someData: "someValue", someOtherValue: 123, someArray: [1,2,3], someObj: {a: 123, b: "string"}});
    expect(actual).toEqual({someData: "someValue", someOtherValue: 123, someArray: [1,2,3], someObj: {a: 234, b: "string"}});
});

it("Replaces an object property with null and leaves others intact", () => {
    interface TheType {
        someData: string;
        someOtherValue: number;
        someArray: number[];
        someObj: {
            a: number;
            b: string;
        } | null;
    }
    const previous: TheType = {someData: "someValue", someOtherValue: 123, someArray: [1,2,3], someObj: {a: 123, b: "string"}};
    const actual = immodify(previous, {someObj: null});

    expect(previous).toEqual({someData: "someValue", someOtherValue: 123, someArray: [1,2,3], someObj: {a: 123, b: "string"}});
    expect(actual).toEqual({someData: "someValue", someOtherValue: 123, someArray: [1,2,3], someObj: null});
});

it("Replaces an object property with undefined and leaves others intact", () => {
    interface TheType {
        someData: string;
        someOtherValue: number;
        someArray: number[];
        someObj: {
            a: number;
            b: string;
        } | undefined;
    }
    const previous: TheType = {someData: "someValue", someOtherValue: 123, someArray: [1,2,3], someObj: {a: 123, b: "string"}};
    const actual = immodify(previous, {someObj: undefined});

    expect(previous).toEqual({someData: "someValue", someOtherValue: 123, someArray: [1,2,3], someObj: {a: 123, b: "string"}});
    expect(actual).toEqual({someData: "someValue", someOtherValue: 123, someArray: [1,2,3], someObj: undefined});
});

it("Replaces an object property completely when requested and leaves others intact", () => {
    interface TheType {
        someData: string;
        someOtherValue: number;
        someArray: number[];
        someObj: {
            a?: number;
            b?: string;
        };
    }
    const previous: TheType = {someData: "someValue", someOtherValue: 123, someArray: [1,2,3], someObj: {a: 123, b: "string"}};
    const actual = immodify(previous, {someObj: replaceWith(  {a: 123})});

    expect(previous).toEqual({someData: "someValue", someOtherValue: 123, someArray: [1,2,3], someObj: {a: 123, b: "string"}});
    expect(actual).toEqual({someData: "someValue", someOtherValue: 123, someArray: [1,2,3], someObj: {a: 123}});
});

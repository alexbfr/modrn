/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {tagify, unTagify} from "../tagify";

const words = [
    "helloWorld",
    "aFishNamedWanda",
    "a",
    "aa",
    "aaa",
    "aaA",
    "aAa",
    "aAaA"
];

it("Correctly tagifies and back", () => {

    for (const word of words) {
        const tagified = tagify(word);
        const untagified = unTagify(tagified, true);
        expect(untagified).toBe(word);
    }

});
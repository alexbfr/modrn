/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {tagify} from "../tagify";

describe("Create valid html tag names from strings", function () {

    it("Converts just one char to lower case", () => {
        const actual = tagify("E");
        expect(actual).toBe("e");
    });

    it("Leaves one lower case char as is", () => {
        const actual = tagify("e");
        expect(actual).toBe("e");
    });

    it("Converts two upper case chars to lower case", () => {
        const actual = tagify("EE");
        expect(actual).toBe("ee");
    });

    it("Converts EeE to ee-e", () => {
        const actual = tagify("EeE");
        expect(actual).toBe("ee-e");
    });

    it("Converts E1E to e1-e", () => {
        const actual = tagify("E1E");
        expect(actual).toBe("e1-e");
    });

    it("Converts EeEe to ee-ee", () => {
        const actual = tagify("EeEe");
        expect(actual).toBe("ee-ee");
    });

    it("Converts Ee to ee", () => {
        const actual = tagify("Ee");
        expect(actual).toBe("ee");
    });

});
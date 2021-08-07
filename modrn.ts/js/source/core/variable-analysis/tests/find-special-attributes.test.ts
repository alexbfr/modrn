/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {registerSpecialAttribute} from "../register-special-attribute";
import {findAttributeVariables} from "../find-attribute-variables";
import {MappingType} from "../../types/variables";
import {varUsageExpression} from "./find-child-variables.test";
import {nextId} from "../../../util/next-id";
import {findSpecialAttributes} from "../find-special-attributes";

it("Finds only special attribute, not regular attribute", () => {

    const specialAttributeName = "x-" + nextId();

    const specialAttributeRegistration = registerSpecialAttribute(specialAttributeName, () => {
        return {
            remapAttributeName: () => {
                throw new Error("should not be called");
            }
        };
    });

    const elem = document.createElement("div");
    elem.innerHTML = `<an-undefined-object ${specialAttributeName}:suffix="{{variable}}"></an-undefined-object>`;
    const elemToTest = elem.firstElementChild as HTMLElement;

    const specialAttributesResult = findSpecialAttributes(elemToTest, []);

    expect(specialAttributesResult).toEqual([{
        type: MappingType.specialAttribute,
        attributeName: `${specialAttributeName}:suffix`,
        specialAttributeRegistration,
        indexes: [],
        hidden: undefined,
        expression: varUsageExpression("variable")
    }]);

    const attributesResult = findAttributeVariables(elemToTest, []);
    expect(attributesResult.length).toBe(0);
});
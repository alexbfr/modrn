/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {Fragment} from "../types/modrn-html-element";
import {findVariables} from "./find-variables";
import {cloneDeep} from "../../util/cloneDeep";

/**
 * Analyzes the provided root element to a fragment.
 * @see Fragment
 *
 * @param rootElement
 */
export function analyzeToFragment(rootElement: Element): Fragment {
    const variables = findVariables(rootElement);
    const childElement = cloneDeep(rootElement);

    return {childElement, variableDefinitions: variables.variables};
}

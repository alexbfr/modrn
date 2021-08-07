/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {registerSpecialAttribute} from "../core/variable-analysis/register-special-attribute";
import {SpecialAttributeHandlerFnResult} from "../core/types/variables";

export const showSpecialAttributeRegistration = registerSpecialAttribute("m-show", showSpecialAttributeHandler).hidden = true;

function showSpecialAttributeHandler(): SpecialAttributeHandlerFnResult {

    function valueTransformer(elem: HTMLElement, value: Record<string, unknown>): unknown {
        if (value["m-show"] === "false" || !value["m-show"]) {
            elem.style.display = "none";
        } else {
            elem.style.display = "";
        }
        return undefined;
    }

    return {
        valueTransformer
    };
}


/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {registerSpecialAttribute} from "../core/variable-analysis/register-special-attribute";
import {makeComponent} from "../core/component-declaration";
import {useChild} from "../core/hooks/templated-children-hooks";
import {varsWithOptions} from "../core/variable-substition/substitute-variables";
import {only} from "../core/modrn-base";
import {m, mBool} from "../core/types/prop-types";
import {SpecialAttributeHandlerFnResult} from "../core/types/variables";
import {ModrnHTMLElement} from "../core/types/modrn-html-element";

const IF_PRECEDENCE = -2;

const ifComponent = makeComponent(m({"mIf": mBool()}), props => {
    const vars = props.allProps();
    const child = useChild(props["mIf"] ? varsWithOptions(vars, {hideByDefault: true}) : null);
    return {child};
}).html(`{{child}}`).transparent().register();

only("modrn-if", ifComponent).isSpecialAttribute = true;

export const ifSpecialAttributeRegistration = registerSpecialAttribute("m-if", ifSpecialAttributeHandler, IF_PRECEDENCE);

function ifSpecialAttributeHandler(): SpecialAttributeHandlerFnResult {
    if (!ifComponent.customElementConstructor) {
        throw new Error("Constructor missing for if component");
    }
    return {
        transformedElement: new ifComponent.customElementConstructor() as ModrnHTMLElement
    };
}


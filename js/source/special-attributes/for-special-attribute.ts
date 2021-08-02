/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {registerSpecialAttribute} from "../core/variable-analysis/register-special-attribute";
import {makeComponent} from "../core/component-declaration";
import {useChildren} from "../core/hooks/templated-children-hooks";
import {only} from "../core/modrn-base";
import {m, mArray, mObj} from "../core/types/prop-types";
import {SpecialAttributeHandlerFnResult} from "../core/types/variables";
import {ModrnHTMLElement} from "../core/types/component-registry";

const FOR_PRECEDENCE = -1;
const AS_PRECEDENCE = -100;

const forComponent = makeComponent(m({mFor: mArray<unknown>(), mAs: mObj<Record<string, unknown>>(), mIndexAs: mObj<Record<string, unknown>>()}), ({mFor, mAs, mIndexAs, ...rest}) => {
    const allProps = {...rest.allProps()};
    delete allProps.mFor;
    delete allProps.mAs;
    delete allProps.mIndexAs;
    const children = useChildren(mFor || [], allProps,
        (mAs && mAs["m-as"]) as string || "item",
        (mIndexAs && mIndexAs["m-index-as"]) as string || "index");
    return {children};
}).html(`{{children}}`).transparent().register();

only("modrn-for", forComponent).isSpecialAttribute = true;

export const forSpecialAttributeRegistration = registerSpecialAttribute("m-for", forSpecialAttributeHandler, FOR_PRECEDENCE);
export const asSpecialAttributeRegistration = registerSpecialAttribute("m-as", asSpecialAttributeHandler, AS_PRECEDENCE);
export const indexAsSpecialAttributeRegistration = registerSpecialAttribute("m-index-as", asSpecialAttributeHandler, AS_PRECEDENCE);

function forSpecialAttributeHandler(): SpecialAttributeHandlerFnResult {
    if (!forComponent.customElementConstructor) {
        throw new Error("Constructor missing for 'for' component");
    }
    return {
        transformedElement: new forComponent.customElementConstructor() as ModrnHTMLElement
    };
}

function asSpecialAttributeHandler(): SpecialAttributeHandlerFnResult {
    return {
        valueTransformer: (element, value) => value
    };
}


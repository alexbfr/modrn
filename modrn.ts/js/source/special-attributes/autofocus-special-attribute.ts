/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {registerSpecialAttribute} from "../core/variable-analysis/register-special-attribute";
import {getOrCreateElementAttachedState} from "../util/state";
import {useState} from "../core/hooks/state-hooks";
import {SpecialAttributeHandlerFnResult} from "../core/types/variables";
import {useDisconnect} from "../core/hooks/disconnect-hook";

export const autofocusSpecialAttributeRegistration = registerSpecialAttribute("m-autofocus", autofocusSpecialAttributeHandler, 1000000).hidden = true;

type FocusState = {
    hasGrabbed: boolean;
};

function autofocusSpecialAttributeHandler(): SpecialAttributeHandlerFnResult {

    function setFocus(weakRef: WeakRef<HTMLElement>) {
        const elem = weakRef.deref();
        if (elem) {
            if (elem.offsetParent) {
                elem.focus();
            } else {
                setTimeout(() => setFocus(weakRef));
            }
        }
    }

    function valueTransformer(elem: HTMLElement, value: Record<string, unknown>): unknown {

        const focusState = getOrCreateElementAttachedState<FocusState>("autofocus-special-attribute", elem);
        const [state, setState] = useState(focusState, {hasGrabbed: false});
        useDisconnect(() => setState({hasGrabbed: false}));

        const focusRequested = value["m-autofocus"];

        if (!state.hasGrabbed && focusRequested) {
            const weakRef = new WeakRef<HTMLElement>(elem);
            setFocus(weakRef);
            setState({hasGrabbed: true}, true);
        } else if (state.hasGrabbed && !focusRequested) {
            setState({hasGrabbed: false}, true);
        }
        if (focusRequested) {
            elem.setAttribute("m-autofocus", "");
        } else {
            elem.removeAttribute("m-autofocus");
        }
        return undefined;
    }

    return {
        valueTransformer
    };
}


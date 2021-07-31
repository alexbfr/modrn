import {registerSpecialAttribute} from "../variable-analysis/register-special-attribute";
import {SpecialAttributeHandlerFnResult} from "../component-registry";

export const showSpecialAttributeRegistration = registerSpecialAttribute("m-show", showSpecialAttributeHandler).hidden = true;

function showSpecialAttributeHandler(): SpecialAttributeHandlerFnResult {

    function valueTransformer(elem: HTMLElement, value: unknown): unknown {
        if (value === "false" || !value) {
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


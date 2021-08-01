import {registerSpecialAttribute} from "../core/variable-analysis/register-special-attribute";
import {SpecialAttributeHandlerFnResult} from "../core/component-registry";

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


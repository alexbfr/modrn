import {registerSpecialAttribute} from "../variable-analysis/register-special-attribute";
import {SpecialAttributeHandlerFnResult} from "../component-registry";

export const classSpecialAttributeRegistration = registerSpecialAttribute("m-class", classSpecialAttributeHandler).hidden = true;

function classSpecialAttributeHandler(): SpecialAttributeHandlerFnResult {

    function valueTransformer(elem: HTMLElement, value: unknown): unknown {
        if (!value) {
            elem.className = "";
            return undefined;
        } if (typeof value === "string") {
            elem.className = value;
            return undefined;
        } else if (Array.isArray(value)) {
            elem.className = (value as string[]).filter(value => !!value).join(" ");
            return undefined;
        }
        throw new Error(`Cannot map ${value} to class names`);
    }

    return {
        valueTransformer
    };
}


import {registerSpecialAttribute} from "../core/variable-analysis/register-special-attribute";
import {SpecialAttributeHandlerFnResult} from "../core/component-registry";

export const classSpecialAttributeRegistration = registerSpecialAttribute("m-class", classSpecialAttributeHandler).hidden = true;

function classSpecialAttributeHandler(): SpecialAttributeHandlerFnResult {

    function valueTransformer(elem: HTMLElement, valueMap: Record<string, unknown>): unknown {
        const value = valueMap["m-class"];
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


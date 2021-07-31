import {registerSpecialAttribute} from "../variable-analysis/register-special-attribute";
import {SpecialAttributeHandlerFnResult} from "../component-registry";
import {createState} from "../../util/state";
import {useState} from "../state-hooks";
import {useDisconnect} from "../event-hooks";

export const autofocusSpecialAttributeRegistration = registerSpecialAttribute("m-autofocus", autofocusSpecialAttributeHandler, 1000000).hidden = true;

type FocusState = {
    hasGrabbed: boolean;
};

const focusState = createState<FocusState>();

function autofocusSpecialAttributeHandler(): SpecialAttributeHandlerFnResult {

    function valueTransformer(elem: HTMLElement, value: unknown): unknown {
        const [state, setState] = useState(focusState, {hasGrabbed: false});
        useDisconnect(() => setState({hasGrabbed: false}));
        if (value && !state.hasGrabbed) {
            setTimeout(() => elem.focus());
            setState({hasGrabbed: true}, true);
        }
        if (value) {
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


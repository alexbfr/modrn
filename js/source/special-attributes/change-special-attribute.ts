import {registerSpecialAttribute} from "../core/variable-analysis/register-special-attribute";
import {SpecialAttributeHandlerFnResult, SpecialAttributeRegistration} from "../core/component-registry";
import {createState, getOrCreateAttachedState} from "../util/state";
import {useState} from "../core/state-hooks";
import {useDisconnect} from "../core/event-hooks";
import {createChangeHook, getOrCreateAttachedChangeHook, useChange} from "../core/change-hooks";
import {logWarn} from "../util/logging";

export const changeSpecialAttributeRegistration = makeChangeHandler("m-change", "change");
export const inputSpecialAttributeRegistration = makeChangeHandler("m-input", "input");

type AttachState = {
    hasAttached: boolean;
    oldEventListener?: EventListener;
};

export function makeChangeHandler(attributeName: string, eventName: string): SpecialAttributeRegistration {

    function changeSpecialAttributeHandler(): SpecialAttributeHandlerFnResult {

        function valueTransformer(elem: HTMLElement, value: Record<string, unknown>): unknown {

            const attachState = getOrCreateAttachedState<AttachState>(attributeName + "-attach", elem);
            const changeState = getOrCreateAttachedChangeHook(attributeName + "-state", elem, 1);

            const [state, setState] = useState(attachState, {hasAttached: false});

            function eventListener(evt: Event) {
                const action = value[""];
                if (typeof action === "function") {
                    (action as (newValue: string | undefined) => void)((evt?.target as HTMLInputElement)?.value);
                } else if (action) {
                    logWarn(`Not a function: ${action}`);
                }
            }

            if (useChange(changeState, value) || !state.hasAttached) {
                if (state.oldEventListener) {
                    elem.removeEventListener(eventName, state.oldEventListener);
                }
                elem.addEventListener(eventName, eventListener);
                setState({hasAttached: true, oldEventListener: eventListener}, true);
            }

            useDisconnect(() => {
                if (state.oldEventListener) {
                    elem.removeEventListener(eventName, state.oldEventListener);
                }
                setState({hasAttached: false}, true);
            });
            return undefined;
        }

        function remapAttributeName(attributeName: string) {
            const indexOfColon = attributeName.indexOf(":");
            if (indexOfColon >= 0) {
                throw new Error(`No specialization possible for ${attributeName} attribute`);
            }
            return "";
        }

        return {
            valueTransformer,
            remapAttributeName
        };
    }

    const result = registerSpecialAttribute(attributeName, changeSpecialAttributeHandler, 1000000);
    result.hidden = true;
    return result;
}


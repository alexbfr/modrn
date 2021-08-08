/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {registerSpecialAttribute} from "../core/variable-analysis/register-special-attribute";
import {getOrCreateElementAttachedState} from "../util/state";
import {useState} from "../core/hooks/state-hooks";
import {getOrCreateElementAttachedChangeHook, useChange} from "../core/hooks/change-hooks";
import {logWarn} from "../util/logging";
import {SpecialAttributeHandlerFnResult} from "../core/types/variables";
import {useDisconnect} from "../core/hooks/disconnect-hook";

export const keyupSpecialAttributeRegistration = registerSpecialAttribute("m-keyup", keyupSpecialAttributeHandler, 1000000).hidden = true;

type AttachState = {
    hasAttached: boolean;
    oldEventListener?: EventListener;
};


function keyupSpecialAttributeHandler(): SpecialAttributeHandlerFnResult {

    function valueTransformer(elem: HTMLElement, value: Record<string, unknown>): unknown {

        const attachState = getOrCreateElementAttachedState<AttachState>("keyup-special-handler-as", elem);
        const changeState = getOrCreateElementAttachedChangeHook("keyup-special-handler-cs", elem,1);
        const [state, setState] = useState(attachState, {hasAttached: false});

        function eventListener(evt: KeyboardEvent) {
            const action = value[evt.code] || value[evt.key] || value[""];
            if (typeof action === "function") {
                (action as (evt: KeyboardEvent) => void)(evt);
            } else if (action) {
                logWarn(`Not a function: ${action} for key/code ${evt.key}/${evt.code}`);
            }
        }

        if (useChange(changeState, value) || !state.hasAttached) {
            if (state.oldEventListener) {
                elem.removeEventListener("keyup", state.oldEventListener);
            }
            elem.addEventListener("keyup", eventListener);
            setState({hasAttached: true, oldEventListener: eventListener}, true);
        }

        useDisconnect(() => {
            if (state.oldEventListener) {
                elem.removeEventListener("keyup", state.oldEventListener);
            }
            setState({hasAttached: false}, true);
        });
        return undefined;
    }

    function remapAttributeName(attributeName: string) {
        const indexOfColon = attributeName.indexOf(":");
        if (indexOfColon >= 0) {
            const keyOrKeycode = attributeName.substring(indexOfColon + 1).toLowerCase();
            const result = keys[keyOrKeycode as keyof typeof keys] || keyCodes[keyOrKeycode as keyof typeof keyCodes];
            if (!result) {
                throw new Error(`Unknown key or keycode ${keyOrKeycode}`);
            }
            return result;
        }
        return "";
    }

    return {
        valueTransformer,
        remapAttributeName
    };
}



const keyCodes = {
    "space": " ",
    "backspace": "Backspace",
    "tab": "Tab",
    "enter": "Enter",
    "shiftleft": "ShiftLeft",
    "shiftright": "ShiftRight",
    "controlleft": "ControlLeft",
    "controlright": "ControlRight",
    "altleft": "AltLeft",
    "altright": "AltRight",
    "pause": "Pause",
    "capslock": "CapsLock",
    "escape": "Escape",
    "pageup": "PageUp",
    "pagedown": "PageDown",
    "end": "End",
    "home": "Home",
    "arrowleft": "ArrowLeft",
    "arrowup": "ArrowUp",
    "arrowright": "ArrowRight",
    "arrowdown": "ArrowDown",
    "printscreen": "PrintScreen",
    "insert": "Insert",
    "delete": "Delete",
    "keya": "KeyA",
    "keyb": "KeyB",
    "keyc": "KeyC",
    "keyd": "KeyD",
    "keye": "KeyE",
    "keyf": "KeyF",
    "keyg": "KeyG",
    "keyh": "KeyH",
    "keyi": "KeyI",
    "keyj": "KeyJ",
    "keyk": "KeyK",
    "keyl": "KeyL",
    "keym": "KeyM",
    "keyn": "KeyN",
    "keyo": "KeyO",
    "keyp": "KeyP",
    "keyq": "KeyQ",
    "keyr": "KeyR",
    "keys": "KeyS",
    "keyt": "KeyT",
    "keyu": "KeyU",
    "keyv": "KeyV",
    "keyw": "KeyW",
    "keyx": "KeyX",
    "keyy": "KeyY",
    "keyz": "KeyZ",
    "metaleft": "MetaLeft",
    "metaright": "MetaRight",
    "contextmenu": "ContextMenu",
    "f1": "F1",
    "f2": "F2",
    "f3": "F3",
    "f4": "F4",
    "f5": "F5",
    "f6": "F6",
    "f7": "F7",
    "f8": "F8",
    "f9": "F9",
    "f10": "F10",
    "f11": "F11",
    "f12": "F12",
    "numlock": "NumLock",
    "scrolllock": "ScrollLock",
    "digit0": "Digit0",
    "digit1": "Digit1",
    "digit2": "Digit2",
    "digit3": "Digit3",
    "digit4": "Digit4",
    "digit5": "Digit5",
    "digit6": "Digit6",
    "digit7": "Digit7",
    "digit8": "Digit8",
    "digit9": "Digit9",
    "numpad0": "Numpad0",
    "numpad1": "Numpad1",
    "numpad2": "Numpad2",
    "numpad3": "Numpad3",
    "numpad4": "Numpad4",
    "numpad5": "Numpad5",
    "numpad6": "Numpad6",
    "numpad7": "Numpad7",
    "numpad8": "Numpad8",
    "numpad9": "Numpad9",
    "numpadmultiply": "NumpadMultiply",
    "numpadadd": "NumpadAdd",
    "numpadsubtract": "NumpadSubtract",
    "numpaddecimal": "NumpadDecimal",
    "numpaddivide": "NumpadDivide",
    "audiovolumemute": "AudioVolumeMute",
    "audiovolumedown": "AudioVolumeDown",
    "audiovolumeup": "AudioVolumeUp",
    "launchmediaplayer": "LaunchMediaPlayer",
    "launchapplication1": "LaunchApplication1",
    "launchapplication2": "LaunchApplication2",
    "semicolon": "Semicolon",
    "equal": "Equal",
    "comma": "Comma",
    "minus": "Minus",
    "period": "Period",
    "slash": "Slash",
    "backquote": "Backquote",
    "bracketleft": "BracketLeft",
    "backslash": "Backslash",
    "bracketright": "BracketRight",
    "quote": "Quote",
};

const keys = {
    "backspace": "Backspace",
    "tab": "Tab",
    "enter": "Enter",
    "shift": "Shift",
    "control": "Control",
    "alt": "Alt",
    "pause": "Pause",
    "capslock": "CapsLock",
    "escape": "Escape",
    "space": "Space",
    "pageup": "PageUp",
    "pagedown": "PageDown",
    "end": "End",
    "home": "Home",
    "arrowleft": "ArrowLeft",
    "arrowup": "ArrowUp",
    "arrowright": "ArrowRight",
    "arrowdown": "ArrowDown",
    "printscreen": "PrintScreen",
    "insert": "Insert",
    "delete": "Delete",
    "a": "a",
    "b": "b",
    "c": "c",
    "d": "d",
    "e": "e",
    "f": "f",
    "g": "g",
    "h": "h",
    "i": "i",
    "j": "j",
    "k": "k",
    "l": "l",
    "m": "m",
    "n": "n",
    "o": "o",
    "p": "p",
    "q": "q",
    "r": "r",
    "s": "s",
    "t": "t",
    "u": "u",
    "v": "v",
    "w": "w",
    "x": "x",
    "y": "y",
    "z": "z",
    "meta": "Meta",
    "contextmenu": "ContextMenu",
    "f1": "F1",
    "f2": "F2",
    "f3": "F3",
    "f4": "F4",
    "f5": "F5",
    "f6": "F6",
    "f7": "F7",
    "f8": "F8",
    "f9": "F9",
    "f10": "F10",
    "f11": "F11",
    "f12": "F12",
    "numlock": "NumLock",
    "scrolllock": "ScrollLock",
};
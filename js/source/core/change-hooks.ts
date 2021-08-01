import {createState, getOrCreateAttachedState, StateToken} from "../util/state";
import {useState} from "./state-hooks";
import {hasFunctionChanged} from "./change-tracking/change-from-to";

export type ChangeHookState = {
    previous: unknown;
    initial: boolean;
};

export type ChangeHookStateToken = StateToken<ChangeHookState> & {deepness: number};

export type ChangeHandlerFn<T> = (previous: T, now: T) => void;

export function createChangeHook(deepness = 0): ChangeHookStateToken {
    return {...createState<ChangeHookState>(), deepness};
}

export function getOrCreateAttachedChangeHook(prefix: string, element: Element, deepness = 0): ChangeHookStateToken {
    return {...getOrCreateAttachedState<ChangeHookState>(prefix, element), deepness};
}

export function useChange<T>(stateToken: ChangeHookStateToken, value: NonNullable<T>, changeHandlerFn?: ChangeHandlerFn<T>): boolean {
    const [state, setState] = useState(stateToken, {previous: value, initial: true});
    const previous = state.previous;
    let changed = false;
    if (state.initial) {
        setState({...state, initial: false});
    } else {
        if (Array.isArray(value)) {
            if (!Array.isArray(previous)) {
                throw new Error("Array must not change type");
            }
            const previousArr = previous as unknown[];
            const nowArr = value as unknown[];
            changed = hasArrayChanged(previousArr, nowArr, stateToken.deepness);
            if (changed) {
                setState({previous: [...nowArr], initial: false}, true);
            }
        } else if (typeof value !== "object") {
            if (previous === "object") {
                throw new Error("Value must not change from object to primitive");
            }
            changed = value !== previous;
            if (changed) {
                setState({previous: value, initial: false}, true);
            }
        } else if (typeof value === "object") {
            if (typeof previous !== "object") {
                throw new Error("Value must not change from primitive to object");
            }
            changed = hasObjectChanged(previous as Record<string, unknown>, value as unknown as Record<string, unknown>, stateToken.deepness);
            if (changed) {
                setState({previous: {...value}, initial: false}, true);
            }
        } else if (typeof value !== typeof previous) {
            if (changed) {
                setState({previous: value, initial: false}, true);
            }
        }
    }

    if (changed && changeHandlerFn) {
        changeHandlerFn(previous as T, value);
    }

    return changed;
}

export function hasObjectChanged(previous: Record<string, unknown>, value: Record<string, unknown>, deepness: number): boolean {
    const previousEntries = Object.entries(previous);
    const nowEntries = Object.keys(value);
    if (previousEntries.length !== nowEntries.length) {
        return true;
    } else {
        const now = value as unknown as Record<string, unknown>;
        for (const [name, val] of previousEntries) {
            if (!(name in now)) {
                return true;
            }
            if (now[name] !== val) {
                if (deepness > 0) {
                    if (hasChanged(val, now[name], deepness - 1)) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
    }
    return false;
}

export function hasArrayChanged(previousArr: unknown[], nowArr: unknown[], deepness: number): boolean {
    if (previousArr.length !== nowArr.length) {
        return true;
    } else {
        for (let idx = 0; idx < nowArr.length; idx++) {
            const now = nowArr[idx];
            const previous = previousArr[idx];
            if (now !== previous) {
                if (deepness > 0) {
                    if (hasChanged(previous, now, deepness - 1)) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
    }
    return false;
}

function hasChanged(previous: unknown, now: unknown, deepness: number) {
    if (!now || !previous) {
        return true;
    }
    if (Array.isArray(now) && Array.isArray(previous)) {
        if (hasArrayChanged(previous as unknown[], now as unknown[], deepness - 1)) {
            return true;
        }
    } else if (typeof now === "object" && typeof previous === "object") {
        if (hasObjectChanged(previous as Record<string, unknown>, now as Record<string, unknown>, deepness - 1)) {
            return true;
        }
    } else if (typeof now === "function" && typeof previous === "function") {
        return hasFunctionChanged(previous, now);
    }
    return false;
}
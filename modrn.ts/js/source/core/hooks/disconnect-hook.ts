/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {bindToStateContext, getCurrentStateContext} from "../component-state";
import {createState} from "../../util/state";
import {useState} from "./state-hooks";

type DisconnectState = {
    hasHooked: boolean;
};

const disconnectState = createState<DisconnectState>();

export function useDisconnect(fn: () => void): void {
    const [state, setState] = useState(disconnectState, {hasHooked: false});
    if (!state.hasHooked) {
        getCurrentStateContext().disconnected.push(bindToStateContext(fn));
        setState({hasHooked: true}, true);
    }
}


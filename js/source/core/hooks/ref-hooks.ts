/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {createState, StateToken} from "../../util/state";
import {useState} from "./state-hooks";
import {nextId} from "../../util/next-id";
import {checkIsShown} from "../../util/check-is-shown";
import {requestFrameUpdate} from "../render-queue";
import {getCurrentStateContext} from "../component-state";

export type RefMap = {
    [refId: string]: WeakRef<HTMLElement>
};

export type RefState = {
    refs: RefMap;
};

type RefStateToken = StateToken<RefState>;

function getRefId(child: HTMLElement) {
    const existingRefId = child.getAttribute("ref-id");
    if (!existingRefId) {
        const refId = nextId();
        child.setAttribute("ref-id", refId);
        return refId;
    }
    return existingRefId;
}

export function createRef(): RefStateToken {
    return createState<RefState>();
}

export type Ref = HTMLElement[];

export type RefInternal = Ref & {
    "__addRef": (htmlElement: HTMLElement) => void;
    "__update": () => void;
};

/**
 * Create a ref given the state token. Refs are always lists of elements which are returned from the rendering function
 * and which are recognized by the variable substitution process by updating the ref'ed elements then on the fly.
 * That means that to have access to refs, another render cycle needs to follow. The variable substitution process
 * informs the ref container by calling 'addRef' or 'update' on it.
 *
 * All refs are held as WeakRef; this should avoid garbage collection load. Refs are also checked for dom-containment,
 * so if a ref is not in the dom anymore, the ref is automatically dropped.
 *
 * @param stateToken
 */
export function useRef(stateToken: RefStateToken): Ref {
    const [currentRefState] = useState(stateToken, {refs: {}});
    const update = getCurrentStateContext().update;

    function addRef(htmlElement: HTMLElement) {
        const refId = getRefId(htmlElement);
        if (!currentRefState.refs[refId]) {
            currentRefState.refs[refId] = new WeakRef(htmlElement);
            update();
        }
    }

    const allRefs = Object.entries(currentRefState.refs);

    function checkForRemovedRefs() {
        let result = false;
        allRefs.forEach(([refId, elemRef]) => {
            const elem = elemRef.deref();
            if (!elem || !checkIsShown(elem)) {
                delete currentRefState.refs[refId];
                result = true;
            }
        });
        if (result) {
            update();
        }
    }

    requestFrameUpdate(checkForRemovedRefs);

    const results: Ref = [];
    allRefs.forEach(([refId, elemRef]) => {
        const elem = elemRef.deref();
        if (!elem || !checkIsShown(elem)) {
            delete currentRefState.refs[refId];
        } else {
            results.push(elem);
        }
    });

    const resultInternal: RefInternal = results as RefInternal;
    resultInternal.__addRef = addRef;
    resultInternal.__update = update;
    return resultInternal;
}
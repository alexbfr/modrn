import {createState, StateToken} from "../util/state";
import {useState} from "./state-hooks";
import {getCurrentStateContext} from "./component-registry";
import {nextId} from "../util/next-id";
import {checkIsShown} from "../util/check-is-shown";
import {requestFrameUpdate} from "./render-queue";

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
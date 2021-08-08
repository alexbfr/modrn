import { StateToken } from "../../util/state";
export declare type RefMap = {
    [refId: string]: WeakRef<HTMLElement>;
};
export declare type RefState = {
    refs: RefMap;
};
declare type RefStateToken = StateToken<RefState>;
export declare function createRef(): RefStateToken;
export declare type Ref = HTMLElement[];
export declare type RefInternal = Ref & {
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
export declare function useRef(stateToken: RefStateToken): Ref;
export {};

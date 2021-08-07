import { VariableMappings } from "./variables";
import { RegisteredComponent } from "./registered-component";
export interface Stateful {
    getOwner: () => ModrnHTMLElement;
    state: {
        [name: string]: unknown;
    };
    update: () => void;
    disconnected: (() => void)[];
}
export declare type ComponentInfo = {
    isSpecialAttribute: boolean;
    tagName: string;
    componentName: string;
    registeredComponent: RegisteredComponent<unknown, unknown>;
    content: Fragment | null;
};
export interface ComponentState extends Stateful {
    addedChildElements: WeakSet<ChildNode>;
    previousChild: Fragment | null;
    customProps: Record<string, unknown>;
    getOwner: () => ModrnHTMLElement;
}
export declare abstract class ModrnHTMLElement extends HTMLElement {
    componentInfo?: ComponentInfo;
    state?: ComponentState;
    initialPreviousChild?: Fragment;
    initialCustomProps?: Record<string, unknown>;
    abstract update(): void;
    abstract notifyChildrenChanged(childFragment: Fragment): void;
    abstract copyTo(other: ModrnHTMLElement): void;
}
/**
 * A fragment is the encapsulation of a html template analyzed for contained variables.
 */
export declare type Fragment = {
    childElement: Element | null;
    variableDefinitions: VariableMappings | null;
};

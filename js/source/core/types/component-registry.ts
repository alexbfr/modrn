/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {Stateful} from "../../util/state";
import {RegisteredComponent} from "./registered-component";
import {VariableMappings} from "./variables";

export interface ComponentState extends Stateful {
    addedChildElements: WeakSet<ChildNode>;
    previousChild: Fragment | null;
    customProps: Record<string, unknown>;
    getOwner: () => ModrnHTMLElement;
}

export abstract class ModrnHTMLElement extends HTMLElement {
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
export type Fragment = {
    childElement: Element | null;
    variableDefinitions: VariableMappings | null;
}

export type ComponentInfo = {
    isSpecialAttribute: boolean;
    tagName: string;
    componentName: string;
    registeredComponent: RegisteredComponent<unknown, unknown>;
    content: Fragment | null;
};

export type ComponentRegistry = {
    [componentName: string]: ComponentInfo;
}

export type HasConnectedFunction = (self: ModrnHTMLElement, componentInfo: ComponentInfo) => void;
export type NotifyChildrenChangedFunction = (self: ModrnHTMLElement, componentInfo: ComponentInfo, childFragment: Fragment) => void;
export type DisconnectedFunction = (self: ModrnHTMLElement, componentInfo: ComponentInfo) => void;


/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {RegisteredComponent} from "./registered-component";
import {tagify} from "../../util/tagify";
import {ComponentInfo, Fragment, ModrnHTMLElement} from "./modrn-html-element";

export type ComponentRegistry = {
    [componentName: string]: ComponentInfo;
}

export type HasConnectedFunction = (self: ModrnHTMLElement, componentInfo: ComponentInfo) => void;
export type NotifyChildrenChangedFunction = (self: ModrnHTMLElement, componentInfo: ComponentInfo, childFragment: Fragment) => void;
export type DisconnectedFunction = (self: ModrnHTMLElement, componentInfo: ComponentInfo) => void;

/**
 * Checks if the provided tagName (html-named) is already registered
 * @param tagName
 */
export function isRegisteredTagName(tagName: string): boolean {
    const componentName = tagName.toLowerCase();
    return componentName in componentRegistry;
}

/**
 * Returns a copy of the component registry
 */
export function getComponentRegistry(): ComponentRegistry {
    return {...componentRegistry};
}

const componentByRegisteredComponent = new WeakMap<RegisteredComponent<unknown, unknown>, ComponentInfo>();
const componentRegistry: ComponentRegistry = {};
const componentsToRegister: ComponentInfo[] = [];

/**
 * Adds a component to the global registry without directly registering it as custom element.
 * @param componentName the js-name of the new component (i.e. without dashes)
 * @param component the component to register
 */
export function addToComponentRegistry(componentName: string, component: RegisteredComponent<unknown, unknown>): ComponentInfo {
    const tagName = tagify(componentName).toLowerCase();
    const componentInfo: ComponentInfo = {
        isSpecialAttribute: false,
        tagName,
        componentName,
        registeredComponent: component,
        content: null
    };
    componentsToRegister.push(componentInfo);
    componentRegistry[tagName] = componentInfo;
    componentByRegisteredComponent.set(component, componentInfo);
    return componentInfo;
}

export function getAndResetComponentsToRegister(): ComponentInfo[] {
    const componentsToRegisterCopy = [...componentsToRegister];
    componentsToRegister.splice(0, componentsToRegisterCopy.length);
    return componentsToRegisterCopy;
}

/**
 * Returns the component info for a certain registered component
 * @param registeredComponent
 */
export function getComponentInfoOf(registeredComponent: RegisteredComponent<unknown, unknown>): ComponentInfo | undefined {
    return componentByRegisteredComponent.get(registeredComponent);
}


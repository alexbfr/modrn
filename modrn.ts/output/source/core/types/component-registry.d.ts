import { RegisteredComponent } from "./registered-component";
import { ComponentInfo, Fragment, ModrnHTMLElement } from "./modrn-html-element";
export declare type ComponentRegistry = {
    [componentName: string]: ComponentInfo;
};
export declare type HasConnectedFunction = (self: ModrnHTMLElement, componentInfo: ComponentInfo) => void;
export declare type NotifyChildrenChangedFunction = (self: ModrnHTMLElement, componentInfo: ComponentInfo, childFragment: Fragment) => void;
export declare type DisconnectedFunction = (self: ModrnHTMLElement, componentInfo: ComponentInfo) => void;
/**
 * Checks if the provided tagName (html-named) is already registered
 * @param tagName
 */
export declare function isRegisteredTagName(tagName: string): boolean;
/**
 * Returns a copy of the component registry
 */
export declare function getComponentRegistry(): ComponentRegistry;
/**
 * Adds a component to the global registry without directly registering it as custom element.
 * @param componentName the js-name of the new component (i.e. without dashes)
 * @param component the component to register
 */
export declare function addToComponentRegistry(componentName: string, component: RegisteredComponent<unknown, unknown>): ComponentInfo;
export declare function getAndResetComponentsToRegister(): ComponentInfo[];
/**
 * Returns the component info for a certain registered component
 * @param registeredComponent
 */
export declare function getComponentInfoOf(registeredComponent: RegisteredComponent<unknown, unknown>): ComponentInfo | undefined;

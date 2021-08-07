import { Module } from "./types/registered-component";
import { DisconnectedFunction, HasConnectedFunction, NotifyChildrenChangedFunction } from "./types/component-registry";
import { ComponentInfo, Fragment } from "./types/modrn-html-element";
/**
 * Adds a module to the global registry by adding each individual registered component.
 *
 * @param module
 */
export declare function registerModule<M, K extends keyof M>(module: Module<M, K>): void;
/**
 * Updates the component registry with the static initialization result of the component (js-named, i.e.
 * without dashes)
 * @param componentName
 * @param content
 */
export declare function setStaticInitializationResultForComponent(componentName: string, content: Fragment): void;
/**
 * Registers the component and creates a custom element for it.
 * @param componentInfo - the component
 * @param hasConnectedFn - the connected callback function (called when mounted)
 * @param notifyChildrenChangedFn - the (custom) callback function when dynamic children change
 * @param disconnectedFn - the disconnected callback function (called when unmounted)
 */
export declare function register(componentInfo: ComponentInfo, hasConnectedFn: HasConnectedFunction, notifyChildrenChangedFn: NotifyChildrenChangedFunction, disconnectedFn: DisconnectedFunction): CustomElementConstructor;
/**
 * Register all components in the component registry at once.
 * @see register
 *
 * @param hasConnectedFn
 * @param notifyChildrenChangedFn
 * @param disconnectedFn
 */
export declare function registerAll(hasConnectedFn: HasConnectedFunction, notifyChildrenChangedFn: NotifyChildrenChangedFunction, disconnectedFn: DisconnectedFunction): void;

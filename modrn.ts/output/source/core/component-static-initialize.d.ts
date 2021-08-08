import { RegisteredComponent } from "./types/registered-component";
import { ComponentRegistry } from "./types/component-registry";
/**
 * Performs the static (one-time) initialization for the provided component.
 * @param componentName
 * @param component
 */
export declare function componentStaticInitialize(componentName: string, component: RegisteredComponent<unknown, unknown>): void;
/**
 * Statically initialize all components currently registered
 * @param componentRegistry
 */
export declare function initializeAll(componentRegistry: ComponentRegistry): void;

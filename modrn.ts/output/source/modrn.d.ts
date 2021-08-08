import { ModuleResult } from "./core/types/registered-component";
/**
 * Perform the global initialization of all components contained in the provided module list.
 * This creates a custom element (aka web component) for each of them.
 *
 * @param modules
 */
export declare function modrn(...modules: ModuleResult<never, never>[]): void;

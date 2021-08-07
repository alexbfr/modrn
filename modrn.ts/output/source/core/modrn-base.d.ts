import { RegisteredComponent } from "./types/registered-component";
import { ComponentInfo, Fragment, ModrnHTMLElement } from "./types/modrn-html-element";
/**
 * Component has connected callback function. This function may be called multiple times and guards itself against that.
 * @param self
 * @param componentInfo
 */
export declare function componentHasConnected(self: ModrnHTMLElement, componentInfo: ComponentInfo): void;
/**
 * Called when the component unmounts. Calls disconnect functions
 * @param self
 */
export declare function componentHasDisconnected(self: ModrnHTMLElement): void;
/**
 * Called when the dynamic children change. Does not implicitly re-render, since this is usually happening
 * inside a render cycle.
 *
 * @param self
 * @param componentInfo
 * @param childFragment
 */
export declare function childrenChanged(self: ModrnHTMLElement, componentInfo: ComponentInfo, childFragment: Fragment): void;
/**
 * Mostly to help tests: this method registers *and* initializes the provided component in one go.
 * @param componentName
 * @param component
 */
export declare function only(componentName: string, component: RegisteredComponent<unknown, unknown>): ComponentInfo;

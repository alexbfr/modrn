import { ComponentBuilder } from "./types/component-builder";
import { Container } from "./types/prop-types";
import { AllProps, Module, ModuleResult } from "./types/registered-component";
/**
 * Declares a module consisting of the provided registered components. Modules will later be registered by calling
 * start with the list of modules. The declaration is global, since web components are globally registered.
 * @see modrn
 *
 * @example
 * const myComponent = makeComponent().html(`<h1>Hello world</h1>`).register();
 * const myModule = declare({myComponent});
 *
 * @param module the Module consisting of registered components to declare
 */
export declare function declare<M, K extends keyof M>(module: Module<M, K>): ModuleResult<M, K>;
/**
 * Creates a component, having a defined set of props (optional) and a render function (also optional). If the render function
 * is omitted, the props are passed directly to the template as variables. If props are omitted, the component does not have any props.
 *
 * The return value is a builder, which allows to further configure the component {@see ComponentBuilder} like for example making the
 * component transparent (i.e. passing all incoming props to the resulting template variables, even if not returned) or declaring
 * the component expects dynamic children (commonly named "slots").
 *
 * @param propsType - The expected props (optional)
 * @param renderFn - The render function (optional)
 */
export declare function makeComponent<T, R>(propsType?: Container & T, renderFn?: (props: T & AllProps) => R | null): ComponentBuilder<T, R>;

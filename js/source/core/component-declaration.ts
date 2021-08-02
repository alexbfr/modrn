/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {registerModule} from "./component-registry";
import {
    ComponentBuilder,
    ComponentBuilderBase,
    ComponentBuilderDynamicChildren,
    ComponentBuilderFilters,
    ComponentBuilderHtml,
    ComponentBuilderTransparent
} from "./types/component-builder";
import {Container, m} from "./types/prop-types";
import {AllProps, Filters, Module, ModuleResult, RegisteredComponent} from "./types/registered-component";

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
export function declare<M, K extends keyof M>(module: Module<M, K>): ModuleResult<M, K> {

    const result = {
        ...module,
        dependsOn
    } as ModuleResult<M, K>;

    function dependsOn(...unused: Module<never, never>[]) { // eslint-disable-line
        return result;
    }

    registerModule(module);
    return result;
}

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
export function makeComponent<T, R>(propsType?: Container & T, renderFn?: (props: T & AllProps) => R | null): ComponentBuilder<T, R> {

    const result: ComponentBuilder<T, R> = {html, register, transparent, dynamicChildren, withFilters};
    let htmlTemplate: string | null;
    let isTransparent = false;
    let hasDynamicChildren = false;
    let filters: Filters = {};

    function html<T extends ComponentBuilderHtml & ComponentBuilderBase>(this: T, htmlText: string): Omit<T, "html"> {
        htmlTemplate = htmlText;
        return result as ComponentBuilderBase as Omit<T, "html">;
    }

    function transparent<T extends ComponentBuilderTransparent & ComponentBuilderBase>(this: T): Omit<T, "transparent"> {
        isTransparent = true;
        return result as ComponentBuilderBase as Omit<T, "transparent">;
    }

    function dynamicChildren<T extends ComponentBuilderDynamicChildren & ComponentBuilderBase>(this: T): Omit<T, "dynamicChildren"> {
        hasDynamicChildren = true;
        return result as ComponentBuilderBase as Omit<T, "dynamicChildren">;
    }

    function withFilters<T extends ComponentBuilderFilters & ComponentBuilderBase>(this: T, filtersProvided: Filters): Omit<T, "withFilters"> {
        filters = {...filters, ...filtersProvided};
        return result as ComponentBuilderBase as Omit<T, "withFilters">;
    }

    function register(): RegisteredComponent<T, R> {
        return {
            transparent: isTransparent,
            dynamicChildren: hasDynamicChildren,
            propTemplate: (propsType || m({})) as never,
            renderFunction: renderFn || (() => null),
            filters,
            htmlTemplate
        } as RegisteredComponent<T, R>;
    }

    return result;
}

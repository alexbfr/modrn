/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {Filters, RegisteredComponent} from "./registered-component";

export type ComponentBuilderBase = {register: () => void};

export type ComponentBuilderHtml = {
    html: <T extends ComponentBuilderHtml & ComponentBuilderBase>(this: T, html: string) => Omit<T, "html">
}

export type ComponentBuilderTransparent = {
    transparent: <T extends ComponentBuilderTransparent & ComponentBuilderBase>(this: T) => Omit<T, "transparent">
}

export type ComponentBuilderDynamicChildren = {
    dynamicChildren: <T extends ComponentBuilderDynamicChildren & ComponentBuilderBase>(this: T) => Omit<T, "dynamicChildren">
}

export type ComponentBuilderFilters = {
    withFilters: <T extends ComponentBuilderFilters & ComponentBuilderBase>(this: T, filters: Filters) => Omit<T, "withFilters">
}

export type ComponentBuilder<T, R> = {
    register: () => RegisteredComponent<T, R>;
} & ComponentBuilderHtml & ComponentBuilderTransparent & ComponentBuilderDynamicChildren & ComponentBuilderFilters;


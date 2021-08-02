/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {m} from "./prop-types";

export const NoProps = m({});

export type AllProps = {allProps: () => Record<string, unknown>};

export type Filters = {
    [filterName: string]: (val: unknown) => unknown;
}

export type RegisteredComponent<T, R> = {
    transparent: boolean;
    dynamicChildren: boolean;
    customElementConstructor?: CustomElementConstructor;
    propTemplate: T;
    renderFunction: (props: T & AllProps) => R | null;
    filters: Filters;
    htmlTemplate: string;
}

export type Module<M, K extends keyof M> = {
    [tagName in K]: (M[K] & RegisteredComponent<unknown, unknown>)
};

export type ModuleResult<M, K extends keyof M> = Module<M, K>  & {
    dependsOn: (...modules: Module<never, never>[]) => Module<M, K>;
};


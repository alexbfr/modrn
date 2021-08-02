/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {tagify} from "../util/tagify";
import {setStaticInitializationResultForComponent} from "./component-registry";
import {logDiagnostic} from "../util/logging";
import {findVariables} from "./variable-analysis/find-variables";
import {cloneDeep} from "../util/cloneDeep";
import {ComponentRegistry, Fragment} from "./types/component-registry";
import {RegisteredComponent} from "./types/registered-component";

/**
 * Analyzes the provided root element to a fragment.
 * @see Fragment
 *
 * @param rootElement
 */
export function analyzeToFragment(rootElement: Element): Fragment {
    const variables = findVariables(rootElement);
    const childElement = cloneDeep(rootElement);

    return {childElement, variableDefinitions: variables.variables};
}

/**
 * Creates the root element for the provided custom element
 * @param component
 * @param tagName
 */
function createRootElement(component: RegisteredComponent<unknown, unknown>, tagName: string) {
    const result = document.createElement("div", {is: tagName});
    result.style.display = "contents";
    return result;
}

/**
 * Performs the static (one-time) initialization for the provided component.
 * @param componentName
 * @param component
 */
export function componentStaticInitialize(componentName: string, component: RegisteredComponent<unknown, unknown>): void {

    logDiagnostic(`Statically initializing ${componentName}`);
    const tagName = tagify(componentName);
    const rootElement = createRootElement(component, tagName);

    rootElement.innerHTML = component.htmlTemplate;

    const fragment = analyzeToFragment(rootElement);
    logDiagnostic(`Element ${componentName} analyzed to`, fragment.variableDefinitions);
    setStaticInitializationResultForComponent(componentName, fragment);
}

/**
 * Statically initialize all components currently registered
 * @param componentRegistry
 */
export function initializeAll(componentRegistry: ComponentRegistry): void {
    Object.entries(componentRegistry).forEach(([, componentInfo]) => {
        componentStaticInitialize(componentInfo.componentName, componentInfo.registeredComponent);
    });
}

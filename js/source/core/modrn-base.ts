/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {addToComponentRegistry, register} from "./component-registry";
import {analyzeToFragment, componentStaticInitialize} from "./component-static-initialize";
import {childNodesToArray} from "../util/childnodes-to-array";
import {ELEMENT_NODE} from "./variable-analysis/variable-types";
import {logDiagnostic} from "../util/logging";
import {isDomContentLoaded, waitUntilDomContentLoaded} from "../util/wait-until-dom-content-loaded";
import {requestRender} from "./render-queue";
import {cloneDeep} from "../util/cloneDeep";
import {renderComponent} from "./render-component";
import {ComponentInfo, Fragment, ModrnHTMLElement} from "./types/component-registry";
import {getStateOf} from "./component-state";
import {RegisteredComponent} from "./types/registered-component";

/**
 * Extracts dynamic child content (commonly named "slot"). Since the component may have been upgraded,
 * children which belong to the component itself are being excluded, the rest is detached from the component
 * and stored in state.previousChild.
 *
 * @param self
 */
function extractDynamicChildContent(self: ModrnHTMLElement) {
    const state = getStateOf(self);
    const childNodes = childNodesToArray(self).filter(cn => !state.addedChildElements.has(cn));
    if (childNodes.length === 1 && childNodes[0].nodeType === ELEMENT_NODE) {
        logDiagnostic("Extracting previous single child", self);
        state.previousChild = analyzeToFragment(self.firstElementChild as HTMLElement);
        self.removeChild(self.firstElementChild as HTMLElement);
        logDiagnostic("Done extracting previous single child", self, state.previousChild.childElement);
    } else if (childNodes.length > 0) {
        logDiagnostic("Extracting previous children", self);
        const container = document.createElement("div");
        container.style.display = "contents";
        for (const childNode of childNodes) {
            container.appendChild(childNode);
        }
        state.previousChild = analyzeToFragment(container);
        logDiagnostic("Done extracting previous children", self, state.previousChild.childElement);
    }
}

/**
 * During initial rendering the dynamic children are not yet available.
 * IMPORTANT: This occurs only if the component is marked as dynamic {@see ComponentBuilderDynamicChildren} to avoid
 * the overhead of re-checking for all components not expecting dynamic children.
 *
 * @param weakSelf
 */
function waitForDynamicChildContentInitialization(weakSelf: WeakRef<ModrnHTMLElement>) {
    waitUntilDomContentLoaded().then(() => {
        const self = weakSelf.deref();
        if (self) {
            extractDynamicChildContent(self);
            requestRender(self);
        }
    });
}

/**
 * Tries to extract the dynamic children if required and possible, and returns true otherwise if we have to wait
 * for a re-render.
 * @see waitForDynamicChildContentInitialization
 *
 * @param self
 */
function extractDynamicChildContentIfPossible(self: ModrnHTMLElement) {
    if (!self.componentInfo?.registeredComponent.dynamicChildren) {
        logDiagnostic(`Not parsing dynamic children for ${self.nodeName}, since dynamicChildren attribute is not set`);
        return false;
    }
    if (isDomContentLoaded()) {
        extractDynamicChildContent(self);
    }
    return !isDomContentLoaded();
}

/**
 * Appends the static child content of the element (i.e. the template used during registration)
 *
 * @param componentInfo
 * @param self
 */
function appendStaticChildContent(componentInfo: ComponentInfo, self: ModrnHTMLElement) {
    if (componentInfo.content?.childElement) {
        const state = getStateOf(self);
        const cloned = cloneDeep(componentInfo.content?.childElement);
        renderComponent(self, cloned, true);
        const childNodes = childNodesToArray(cloned);
        for (const childNode of childNodes) {
            self.appendChild(childNode);
            state.addedChildElements.add(childNode);
        }
    }
}

/**
 * Component has connected callback function. This function may be called multiple times and guards itself against that.
 * @param self
 * @param componentInfo
 */
export function componentHasConnected(self: ModrnHTMLElement, componentInfo: ComponentInfo): void {
    const what = self.nodeName + "#" + self.id;
    logDiagnostic("Connecting: ", what);
    if (self.parentNode && !self.state) {
        self.style.display = "contents";
        let requireObserverForChildContent;
        if (self.initialPreviousChild) {
            getStateOf(self).previousChild = self.initialPreviousChild;
            requireObserverForChildContent = false;
        } else {
            requireObserverForChildContent = extractDynamicChildContentIfPossible(self);
        }
        logDiagnostic(`Appending: `, what);
        appendStaticChildContent(componentInfo, self);
        if (requireObserverForChildContent) {
            waitForDynamicChildContentInitialization(new WeakRef(self));
        }
        logDiagnostic(`Done appending: `, what);
    }
}

/**
 * Called when the component unmounts. Calls disconnect functions
 * @param self
 */
export function componentHasDisconnected(self: ModrnHTMLElement): void {
    if (self.state?.disconnected) {
        (self.state.disconnected || []).forEach(fn => fn());
        self.state.disconnected = [];
    }
}

/**
 * Called when the dynamic children change. Does not implicitly re-render, since this is usually happening
 * inside a render cycle.
 *
 * @param self
 * @param componentInfo
 * @param childFragment
 */
export function childrenChanged(self: ModrnHTMLElement, componentInfo: ComponentInfo, childFragment: Fragment): void {
    if (!self.state) {
        self.initialPreviousChild = childFragment;
    } else {
        self.state.previousChild = childFragment;
    }
}

/**
 * Mostly to help tests: this method registers *and* initializes the provided component in one go.
 * @param componentName
 * @param component
 */
export function only(componentName: string, component: RegisteredComponent<unknown, unknown>): ComponentInfo {

    const componentInfo = addToComponentRegistry(componentName, component);
    register(componentInfo, componentHasConnected, childrenChanged, componentHasDisconnected);
    componentStaticInitialize(componentInfo.componentName, componentInfo.registeredComponent);
    return componentInfo;
}

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {tagify} from "../util/tagify";
import {logDiagnostic} from "../util/logging";
import {Module, RegisteredComponent} from "./types/registered-component";
import {
    addToComponentRegistry,
    DisconnectedFunction,
    getAndResetComponentsToRegister,
    getComponentRegistry,
    HasConnectedFunction,
    NotifyChildrenChangedFunction
} from "./types/component-registry";
import {ComponentInfo, Fragment, ModrnHTMLElement} from "./types/modrn-html-element";
import {requestRender} from "./types/render-queue";

/**
 * Adds a module to the global registry by adding each individual registered component.
 *
 * @param module
 */
export function registerModule<M, K extends keyof M>(module: Module<M, K>): void {
    Object.entries(module).forEach(([componentName, component]) => {
        addToComponentRegistry(componentName, component as RegisteredComponent<unknown, unknown>);
    });
}

/**
 * Updates the component registry with the static initialization result of the component (js-named, i.e.
 * without dashes)
 * @param componentName
 * @param content
 */
export function setStaticInitializationResultForComponent(componentName: string, content: Fragment): void {
    getComponentRegistry()[tagify(componentName).toLowerCase()].content = content;
}

/**
 * Registers the component and creates a custom element for it.
 * @param componentInfo - the component
 * @param hasConnectedFn - the connected callback function (called when mounted)
 * @param notifyChildrenChangedFn - the (custom) callback function when dynamic children change
 * @param disconnectedFn - the disconnected callback function (called when unmounted)
 */
export function register(componentInfo: ComponentInfo,
    hasConnectedFn: HasConnectedFunction,
    notifyChildrenChangedFn: NotifyChildrenChangedFunction,
    disconnectedFn: DisconnectedFunction): CustomElementConstructor {
    const tagName = componentInfo.tagName;
    if (getComponentRegistry()[tagName]?.registeredComponent === componentInfo.registeredComponent && componentInfo.registeredComponent.customElementConstructor) {
        return componentInfo.registeredComponent.customElementConstructor;
    }
    logDiagnostic(`Registering component ${tagName}`);
    const customElementConstructor = class extends ModrnHTMLElement {
        constructor() {
            super();
            this.componentInfo = componentInfo;
        }

        connectedCallback() {
            if (this.isConnected) {
                hasConnectedFn(this, componentInfo);
            }
        }

        disconnectedCallback() {
            disconnectedFn(this, componentInfo);
        }

        notifyChildrenChanged(childFragment: Fragment) {
            notifyChildrenChangedFn(this, componentInfo, childFragment);
        }

        update() {
            requestRender(this);
        }

        copyTo(other: ModrnHTMLElement) {
            other.initialPreviousChild = this.initialPreviousChild;
            other.initialCustomProps = this.initialCustomProps;
            other.componentInfo = this.componentInfo;
            other.state = this.state ? {...this.state} : undefined;
        }

        static get observedAttributes() {
            return Object.keys((componentInfo.registeredComponent.propTemplate as Record<string, unknown>) || {});
        }

    };
    customElements.define(tagName, customElementConstructor);
    componentInfo.registeredComponent.customElementConstructor = customElementConstructor;
    return customElementConstructor;
}

/**
 * Register all components in the component registry at once.
 * @see register
 *
 * @param hasConnectedFn
 * @param notifyChildrenChangedFn
 * @param disconnectedFn
 */
export function registerAll(hasConnectedFn: HasConnectedFunction, notifyChildrenChangedFn: NotifyChildrenChangedFunction, disconnectedFn: DisconnectedFunction): void {
    getAndResetComponentsToRegister().forEach(componentInfo => {
        register(componentInfo, hasConnectedFn, notifyChildrenChangedFn, disconnectedFn);
    });
}


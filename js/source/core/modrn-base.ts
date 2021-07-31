import {RegisteredComponent} from "./component-declaration";
import {
    addToComponentRegistry,
    ComponentInfo,
    ComponentRegistry,
    Fragment,
    getStateOf,
    ModrnHTMLElement,
    register
} from "./component-registry";
import {analyzeToFragment, componentStaticInitialize} from "./component-static-initialize";
import {childNodesToArray} from "../util/childnodes-to-array";
import {ELEMENT_NODE} from "./variable-analysis/variable-types";
import {logDiagnostic} from "../util/logging";
import {isDomContentLoaded, waitUntilDomContentLoaded} from "../util/wait-until-dom-content-loaded";
import {requestRender} from "./render-queue";
import {cloneDeep} from "../util/cloneDeep";
import {renderComponent} from "./render-component";

export function initializeAll(componentRegistry: ComponentRegistry): void {
    Object.entries(componentRegistry).forEach(([, componentInfo]) => {
        componentStaticInitialize(componentInfo.componentName, componentInfo.registeredComponent);
    });
}

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

function waitForDynamicChildContentInitialization(weakSelf: WeakRef<ModrnHTMLElement>) {
    waitUntilDomContentLoaded().then(() => {
        const self = weakSelf.deref();
        if (self) {
            extractDynamicChildContent(self);
            requestRender(self);
        }
    });
}

function extractDynamicChildContentIfPossible(self: ModrnHTMLElement) {
    if (isDomContentLoaded()) {
        extractDynamicChildContent(self);
    }
    return !isDomContentLoaded();
}

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

export function childrenChanged(self: ModrnHTMLElement, componentInfo: ComponentInfo, childFragment: Fragment): void {
    if (!self.state) {
        self.initialPreviousChild = childFragment;
    } else {
        self.state.previousChild = childFragment;
    }
}

export function only(componentName: string, component: RegisteredComponent<unknown, unknown>): ComponentInfo {

    const componentInfo = addToComponentRegistry(componentName, component);
    register(componentInfo, componentHasConnected, childrenChanged);
    componentStaticInitialize(componentInfo.componentName, componentInfo.registeredComponent);
    return componentInfo;
}

import {
    addToComponentRegistry,
    ComponentInfo,
    ComponentRegistry, Fragment,
    getComponentRegistry, getStateOf,
    ModrnHTMLElement, register,
    registerAll
} from "./component-registry";
import {ModuleResult, RegisteredComponent} from "./component-declaration";
import {analyzeToFragment, componentStaticInitialize} from "./component-static-initialize";
import {requestRender} from "./render-queue";
import {logDiagnostic} from "../util/logging";
import {childNodesToArray} from "../util/childnodes-to-array";
import {renderComponent} from "./render-component";
import {isDomContentLoaded, waitUntilDomContentLoaded} from "../util/wait-until-dom-content-loaded";
import {ELEMENT_NODE} from "./variable-analysis/variable-types";
import {cloneDeep} from "../util/cloneDeep";

function initializeAll(componentRegistry: ComponentRegistry) {
    Object.entries(componentRegistry).forEach(([, componentInfo]) => {
        componentStaticInitialize(componentInfo.componentName, componentInfo.registeredComponent);
    });
}

function extractDynamicChildContent(self: ModrnHTMLElement) {
    const state = getStateOf(self);
    const childNodes = childNodesToArray(self).filter(cn => !state.addedChildElements.has(cn));
    if (childNodes.length === 1 && childNodes[0].nodeType === ELEMENT_NODE) {
        logDiagnostic("Extracting previous single child", self);
        state.previousChild = analyzeToFragment(self.firstElementChild as HTMLElement).fragment;
        self.removeChild(self.firstElementChild as HTMLElement);
        logDiagnostic("Done extracting previous single child", self, state.previousChild.childElement);
    } else if (childNodes.length > 0) {
        logDiagnostic("Extracting previous children", self);
        const container = document.createElement("div");
        container.style.display = "contents";
        for (const childNode of childNodes) {
            container.appendChild(childNode);
        }
        state.previousChild = analyzeToFragment(container).fragment;
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

function componentHasConnected(self: ModrnHTMLElement, componentInfo: ComponentInfo) {
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

function childrenChanged(self: ModrnHTMLElement, componentInfo: ComponentInfo, childFragment: Fragment) {
    if (!self.state) {
        self.initialPreviousChild = childFragment;
    } else {
        self.state.previousChild = childFragment;
    }
}

export function start(...modules: ModuleResult<never, never>[]): void { // eslint-disable-line
    registerAll(componentHasConnected, childrenChanged);
    initializeAll(getComponentRegistry());
}

export function only(componentName: string, component: RegisteredComponent<unknown, unknown>): ComponentInfo {

    const componentInfo = addToComponentRegistry(componentName, component);
    register(componentInfo, componentHasConnected, childrenChanged);
    componentStaticInitialize(componentInfo.componentName, componentInfo.registeredComponent);
    return componentInfo;
}

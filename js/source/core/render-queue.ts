/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {logDiagnostic, logWarn} from "../util/logging";
import {renderComponent} from "./render-component";
import {isTestingModeActive} from "../util/wait-until-dom-content-loaded";
import {clearTainted} from "./change-tracking/mark-changed";
import {ModrnHTMLElement} from "./types/component-registry";

type RenderQueueElement = {
    element: WeakRef<ModrnHTMLElement>;
}

const frameUpdateQueue: (() => void)[] = [];
const renderQueue: RenderQueueElement[] = [];
let alreadyRendered: WeakSet<ModrnHTMLElement> = new WeakSet<ModrnHTMLElement>();
let alreadyRequested: WeakSet<ModrnHTMLElement> = new WeakSet<ModrnHTMLElement>();

let requestedFrameUpdateNumber: number | null = null;

function requestUpdate() {
    if (!isTestingModeActive() && !requestedFrameUpdateNumber) {
        requestedFrameUpdateNumber = requestAnimationFrame(renderElements);
    }
}

function cancelUpdate() {
    if (requestedFrameUpdateNumber !== null) {
        cancelAnimationFrame(requestedFrameUpdateNumber);
        requestedFrameUpdateNumber = null;
    }
}

export function requestFrameUpdate(callback: () => void): void {
    frameUpdateQueue.push(callback);
    requestUpdate();
}

export function requestRender(selfProvided: ModrnHTMLElement | string): void {
    const self = (typeof selfProvided === "string") ? document.getElementById(selfProvided) as ModrnHTMLElement : selfProvided;
    if (!self.componentInfo) {
        throw new Error(`${selfProvided} could not be resolved to a ModrnHTMLElement`);
    }
    if (alreadyRequested.has(self)) {
        return;
    }
    alreadyRequested.add(self);
    renderQueue.push({element: new WeakRef(self)});
    requestUpdate();
}

function render(element: ModrnHTMLElement) {
    if (alreadyRendered.has(element)) {
        return;
    }
    alreadyRendered.add(element);
    logDiagnostic("Rendering: ", element.nodeName + "#" + element.id);
    renderComponent(element);
}

export function clearRenderQueue(): void {
    frameUpdateQueue.splice(0, frameUpdateQueue.length);
    renderQueue.splice(0, renderQueue.length);
}

let frameCount = 0;
function justRender() {
    console.info("FRAME", frameCount++);
    alreadyRendered = new WeakSet<ModrnHTMLElement>();
    alreadyRequested = new WeakSet<ModrnHTMLElement>();
    const toRender = [...renderQueue];
    renderQueue.splice(0, toRender.length);
    const elementsToRender = toRender.map(item => item.element.deref()).filter(item => item !== undefined);
    elementsToRender.forEach(element => render(element!)); // eslint-disable-line
}

export function renderElements(): void {

    cancelUpdate();

    const frameUpdate = [...frameUpdateQueue];
    frameUpdateQueue.splice(0, frameUpdate.length);
    frameUpdate.forEach(callback => callback());

    let count = 0;
    while (renderQueue.length > 0) {
        justRender();
        if ((count++) > 10) {
            logWarn("Renderqueue not empty after 10 retries");
        }
    }
    clearTainted();
}

export function getRenderQueueLength(): number {
    return renderQueue.length;
}

export function getFrameUpdateQueueLength(): number {
    return frameUpdateQueue.length;
}
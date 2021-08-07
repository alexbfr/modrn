/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {logDiagnostic, logWarn} from "../util/logging";
import {renderComponent} from "./render-component";
import {clearTainted} from "./change-tracking/mark-changed";
import {ModrnHTMLElement} from "./types/modrn-html-element";
import {
    cancelUpdate,
    getAndResetRenderQueue,
    getRenderQueueLength,
    requestUpdate,
    setFrameRequestCallback
} from "./types/render-queue";

const frameUpdateQueue: (() => void)[] = [];
let alreadyRendered: WeakSet<ModrnHTMLElement> = new WeakSet<ModrnHTMLElement>();

export function requestFrameUpdate(callback: () => void): void {
    frameUpdateQueue.push(callback);
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
    getAndResetRenderQueue();
}

let frameCount = 0;
function justRender() {
    console.info("FRAME", frameCount++);
    alreadyRendered = new WeakSet<ModrnHTMLElement>();
    const toRender = getAndResetRenderQueue();
    const elementsToRender = toRender.map(item => item.element.deref()).filter(item => item !== undefined);
    elementsToRender.forEach(element => render(element!)); // eslint-disable-line
}

export function renderElements(): void {

    cancelUpdate();

    const frameUpdate = [...frameUpdateQueue];
    frameUpdateQueue.splice(0, frameUpdate.length);
    frameUpdate.forEach(callback => callback());

    let count = 0;
    while (getRenderQueueLength() > 0) {
        justRender();
        if ((count++) > 10) {
            logWarn("Renderqueue not empty after 10 retries");
        }
    }
    clearTainted();
}

export function getFrameUpdateQueueLength(): number {
    return frameUpdateQueue.length;
}

setFrameRequestCallback(renderElements);

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {ModrnHTMLElement} from "./modrn-html-element";

export type RenderQueueElement = {
    element: WeakRef<ModrnHTMLElement>;
}

let alreadyRequested: WeakSet<ModrnHTMLElement> = new WeakSet<ModrnHTMLElement>();
const renderQueue: RenderQueueElement[] = [];
let frameRequestCallback: FrameRequestCallback | undefined;

export function getAndResetRenderQueue(): RenderQueueElement[] {
    const renderQueueCopy = [...renderQueue];
    alreadyRequested = new WeakSet<ModrnHTMLElement>();
    renderQueue.splice(0, renderQueueCopy.length);
    return renderQueueCopy;
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

export function getRenderQueueLength(): number {
    return renderQueue.length;
}

let testingModeActive = false;
let requestedFrameUpdateNumber: number | null = null;

export function isTestingModeActive(): boolean {
    return testingModeActive;
}

export function setTestingModeActive(): void {
    testingModeActive = true;
}

export function requestUpdate(): void {
    if (!isTestingModeActive() && !requestedFrameUpdateNumber && frameRequestCallback) {
        requestedFrameUpdateNumber = requestAnimationFrame(frameRequestCallback);
    }
}

export function cancelUpdate(): void {
    if (requestedFrameUpdateNumber !== null) {
        cancelAnimationFrame(requestedFrameUpdateNumber);
        requestedFrameUpdateNumber = null;
    }
}

export function setFrameRequestCallback(_frameRequestCallback: FrameRequestCallback): void {
    frameRequestCallback = _frameRequestCallback;
}
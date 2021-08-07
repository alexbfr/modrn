/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {setTestingModeActive} from "../core/types/render-queue";

let domContentIsLoaded = document.readyState === "complete";
let domContentLoadedPromise: Promise<void> | undefined;
let domContentLoadedResolver: () => void = () => void 0;

export function isDomContentLoaded(): boolean {
    return domContentIsLoaded;
}

export function __testing__setDomContentLoaded(): void {
    domContentIsLoaded = true;
    setTestingModeActive();
    if (domContentLoadedResolver) {
        domContentLoadedResolver();
    }
}

export async function waitUntilDomContentLoaded(): Promise<void> {
    if (domContentIsLoaded) {
        return Promise.resolve();
    }
    if (domContentLoadedPromise) {
        return domContentLoadedPromise;
    }
    let resolver: (value: unknown) => void = () => void 0;

    function hasLoadedFn() {
        domContentIsLoaded = true;
        document.removeEventListener("DOMContentLoaded", hasLoadedFn);
        resolver(null);
    }

    domContentLoadedPromise = new Promise(resolve => resolver = resolve);
    domContentLoadedResolver = hasLoadedFn;
    document.addEventListener("DOMContentLoaded", hasLoadedFn);
    return domContentLoadedPromise;
}


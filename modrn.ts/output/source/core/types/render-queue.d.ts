import { ModrnHTMLElement } from "./modrn-html-element";
export declare type RenderQueueElement = {
    element: WeakRef<ModrnHTMLElement>;
};
export declare function getAndResetRenderQueue(): RenderQueueElement[];
export declare function requestRender(selfProvided: ModrnHTMLElement | string): void;
export declare function getRenderQueueLength(): number;
export declare function isTestingModeActive(): boolean;
export declare function setTestingModeActive(): void;
export declare function requestUpdate(): void;
export declare function cancelUpdate(): void;
export declare function setFrameRequestCallback(_frameRequestCallback: FrameRequestCallback): void;

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {makeComponent} from "../component-declaration";
import {registerAnonymous} from "./anon";
import {TestUtils} from "../../test-utils/test-utils";
import {clearRenderQueue, getFrameUpdateQueueLength, getRenderQueueLength, renderElements} from "../render-queue";
import {createRef, useRef} from "../hooks/ref-hooks";
import {useChildren} from "../hooks/templated-children-hooks";
import {NoProps} from "../types/registered-component";
import {ModrnHTMLElement} from "../types/component-registry";

beforeEach(() => clearRenderQueue());

it("Returns a single ref correctly", async () => {

    const singleRefState = createRef();
    let resultingRefs: HTMLElement[] = [];

    const component1 = makeComponent(NoProps, () => {
        const singleRef = useRef(singleRefState);
        resultingRefs = singleRef;
        return {singleRef};
    }).html(`<p id="the-ref" ref="{{singleRef}}">foobaz</p>`).register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(getRenderQueueLength()).toBe(1);
    expect(resultingRefs.length).toEqual(0);

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain(`foobaz`);

    renderElements();
    expect(getRenderQueueLength()).toBe(0);
    expect(resultingRefs.length).toBe(1);
    expect(resultingRefs[0].getAttribute("id")).toBe("the-ref");
});

it("Returns multiple refs correctly", async () => {

    const singleRefState = createRef();
    let resultingRefs: HTMLElement[] = [];

    const component1 = makeComponent(NoProps, () => {
        const singleRef = useRef(singleRefState);
        resultingRefs = singleRef;
        return {singleRef};
    }).html(`
<p id="the-ref1" ref="{{singleRef}}">foobaz</p>
<p id="the-ref2" ref="{{singleRef}}">barfoo</p>
`).register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(getRenderQueueLength()).toBe(1);
    expect(resultingRefs.length).toEqual(0);

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain(`foobaz`);
    expect(container.innerHTML).toContain(`barfoo`);

    renderElements();
    expect(getRenderQueueLength()).toBe(0);
    expect(resultingRefs.length).toBe(2);
    expect(resultingRefs[0].getAttribute("id")).toBe("the-ref1");
    expect(resultingRefs[1].getAttribute("id")).toBe("the-ref2");
});

it("Reacts on dynamic amount of referenced elements", async () => {

    const singleRefState = createRef();
    let resultingRefs: HTMLElement[] = [];
    let items = [1, 2, 3];

    const component1 = makeComponent(NoProps, () => {
        const singleRef = useRef(singleRefState);
        resultingRefs = singleRef;
        const children = useChildren(items, {ref: singleRef});
        return {children};
    }).html(`
<div id="host">{{children}}</div>
`).dynamicChildren().register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;

    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen("id = 'tag1'")}<p id="{{item}}" ref="{{ref}}">Dynamic {{item}}</p>${tag1.tagClose}<p>Epilogue</p>`;

    expect(getRenderQueueLength()).toBe(1); // 3 refs added
    expect(resultingRefs.length).toEqual(0);

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    items.forEach(item => expect(container.innerHTML).toContain(`Dynamic ${item}</p>`));

    renderElements();
    expect(getRenderQueueLength()).toBe(0); // all refs processed
    expect(resultingRefs.length).toEqual(3); // 3 refs should result

    const element = document.getElementById("tag1") as ModrnHTMLElement;
    items.push(4); // add one more item to list
    element.update();

    renderElements();
    expect(getRenderQueueLength()).toBe(0);
    expect(resultingRefs.length).toEqual(4);

    items = []; // clear
    element.update();

    renderElements();
    expect(getRenderQueueLength()).toBe(0); // no re-renders, since nothing was added
    expect(getFrameUpdateQueueLength()).toBe(1); // but the frame update queue should have one element (since the refs request another check)
    expect(resultingRefs.length).toEqual(4); // the resulting refs still are at 4

    renderElements();
    expect(getRenderQueueLength()).toBe(0); // no further re-render
    expect(getFrameUpdateQueueLength()).toBe(1); // frame update queue still 1, since refs should have changed
    expect(resultingRefs.length).toEqual(0); // but refs resolved to empty now

    renderElements();
    expect(getRenderQueueLength()).toBe(0); // no further re-render
    expect(getFrameUpdateQueueLength()).toBe(0); // no further frame update, since refs didn't change
    expect(resultingRefs.length).toEqual(0); // refs are still empty
});


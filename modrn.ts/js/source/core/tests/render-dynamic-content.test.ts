/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {TestUtils} from "../../test-utils/test-utils";
import {makeComponent} from "../component-declaration";
import {registerAnonymous} from "./anon";
import {useChild, useChildren, useTemplate} from "../hooks/templated-children-hooks";
import {clearRenderQueue, renderElements} from "../render-queue";
import {NoProps} from "../types/registered-component";
import {ModrnHTMLElement} from "../types/modrn-html-element";
import {getRenderQueueLength, requestRender} from "../types/render-queue";

beforeEach(() => clearRenderQueue());

it("Does not render dynamic child content if not explicitly stated", async () => {

    const component1 = makeComponent().html("").dynamicChildren().register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}Text content${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).not.toContain("Text content");
});

it("Renders plain dynamic child content correctly", async () => {

    const component1 = makeComponent(NoProps, () => {
        return {child: useChild({})};
    }).html("{{child}}").dynamicChildren().register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;

    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}Text content${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("Text content");
});

it("Renders plain dynamic child content correctly and returns its ref", async () => {

    const component1 = makeComponent(NoProps, () => {
        return {child: useChild({})};
    }).html("{{child}}").dynamicChildren().register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;

    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}Text content${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("Text content");
});

it("Correctly applies one simple prop in templated dynamic child", async () => {

    const component1 = makeComponent(NoProps, () => {
        return {child: useChild({foo: "bar"})};
    }).html("{{child}}").dynamicChildren().register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;

    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}Prologue {{foo}} epilogue${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("Prologue bar epilogue");
});

it("Correctly applies a collection of templated dynamic children", async () => {

    const iterateOver = [1, 2, 3, 4];

    const component1 = makeComponent(NoProps, () => {
        return {children: useChildren(iterateOver, {})};
    }).html("{{children}}").dynamicChildren().register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;

    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}--{{item}}--${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    iterateOver.forEach(value => expect(container.innerHTML).toContain(`--${value}--`));
});

it("Correctly re-renders a collection of templated dynamic children", async () => {

    const iterateOverOriginal = [1, 2, 3, 4];
    const iterateOver = [...iterateOverOriginal];
    let numberOfRenders = 0;

    const component1 = makeComponent(NoProps, () => {
        numberOfRenders++;
        return {children: useChildren(iterateOver, {})};
    }).html("{{children}}").dynamicChildren().register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen("id='elemId'")}--{{item}}--${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    iterateOver.forEach(value => expect(container.innerHTML).toContain(`--${value}--`));
    expect(getRenderQueueLength()).toBe(0);
    expect(numberOfRenders).toBe(1);

    iterateOver.push(123);

    // Should not have an effect
    renderElements();
    expect(container.innerHTML).not.toContain("--123--");

    requestRender("elemId");
    renderElements();
    expect(numberOfRenders).toBe(2);
    expect(getRenderQueueLength()).toBe(0);
    iterateOver.forEach(value => expect(container.innerHTML).toContain(`--${value}--`));
});

it("Renders a custom template from a html string", async () => {

    let value: string | undefined = "foobar";

    const component = makeComponent(NoProps, () => {
        const templatedChild = useTemplate(`<div>{{prop}}</div>`, value ? {prop: value} : undefined);
        return {templatedChild};
    })
        .html(`<div id="container">{{templatedChild}}</div>`)
        .dynamicChildren()
        .register();

    const tag1 = registerAnonymous(component);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<div>Prologue</div>${tag1.tagOpen(`id="main"`)}${tag1.tagClose}<div>Epilogue</div>`;
    const element = document.getElementById("main") as ModrnHTMLElement;

    expect(container.innerHTML).toContain("Prologue");
    expect(container.innerHTML).toContain("Epilogue");
    expect(container.innerHTML).toContain(`<div id="container">`);
    // foobar should exist
    expect(container.innerHTML).toContain(`foobar`);
    expect(getRenderQueueLength()).toBe(0);

    // remove value, should stop rendering the child
    value = undefined;
    requestRender(element);
    renderElements();

    expect(container.innerHTML).toContain("Prologue");
    expect(container.innerHTML).toContain("Epilogue");
    expect(container.innerHTML).toContain(`<div id="container">`);
    // foobar should not exist anymore
    expect(container.innerHTML).not.toContain(`foobar`);
});

it("Renders a custom template from a template child element", async () => {

    const value = "foobar";

    const component = makeComponent(NoProps, () => {
        const templatedChild = useTemplate("#the-template", value ? {prop: value} : undefined);
        return {templatedChild};
    })
        .html(`
        <div id="container">{{templatedChild}}</div>
        <template id="the-template">quux {{prop}}</template>
`)
        .dynamicChildren()
        .register();

    const tag1 = registerAnonymous(component);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<div>Prologue</div>${tag1.tagOpen(`id="main"`)}${tag1.tagClose}<div>Epilogue</div>`;

    expect(container.innerHTML).toContain("Prologue");
    expect(container.innerHTML).toContain("Epilogue");
    expect(container.innerHTML).toContain(`<div id="container">`);
    // foobar should exist
    expect(container.innerHTML).toContain(value);
    // quux should exist
    expect(container.innerHTML).toContain("quux foobar");
    expect(getRenderQueueLength()).toBe(0);
});
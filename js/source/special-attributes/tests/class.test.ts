/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {clearRenderQueue, renderElements, requestRender} from "../../core/render-queue";
import {makeComponent} from "../../core/component-declaration";
import {registerAnonymous} from "../../core/tests/anon";
import {TestUtils} from "../../test-utils/test-utils";
import {classSpecialAttributeRegistration} from "../class-special-attribute";
import {NoProps} from "../../core/types/registered-component";
import {ModrnHTMLElement} from "../../core/types/component-registry";

classSpecialAttributeRegistration;

beforeEach(clearRenderQueue);

it("Leaves a plain string alone", async () => {

    const value = true;
    const component1 = makeComponent(NoProps, () => ({value})).html(`<span m-class="{{'foo'}}">Hello world</span>`).register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("class=\"foo\"");
});

it("Unrolls list to strings", async () => {

    const value = true;
    const component1 = makeComponent(NoProps, () => ({value})).html(`<span m-class="{{'foo', 'bar'}}">Hello world</span>`).register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("class=\"foo bar\"");
});

it("Calculates conditional", async () => {

    let value = true;
    const component1 = makeComponent(NoProps, () => ({value})).html(`<span m-class="{{ value ? 'foo' : 'quux', 'bar'}}">Hello world</span>`).register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen("id='root'")}${tag1.tagClose}<p>Epilogue</p>`;
    const elem = document.getElementById("root") as ModrnHTMLElement;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("class=\"foo bar\"");

    value = false;
    requestRender(elem);
    renderElements();
    expect(container.innerHTML).toContain("class=\"quux bar\"");
});

it("Calculates conditional with &&", async () => {

    let value = true;
    const component1 = makeComponent(NoProps, () => ({value})).html(`<span m-class="{{ value && 'foo', 'bar'}}">Hello world</span>`).register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen("id='root'")}${tag1.tagClose}<p>Epilogue</p>`;
    const elem = document.getElementById("root") as ModrnHTMLElement;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("class=\"foo bar\"");

    value = false;
    requestRender(elem);
    renderElements();
    expect(container.innerHTML).toContain("class=\"bar\"");
});

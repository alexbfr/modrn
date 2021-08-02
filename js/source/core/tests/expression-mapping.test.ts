/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {clearRenderQueue, renderElements, requestRender} from "../render-queue";
import {makeComponent} from "../component-declaration";
import {registerAnonymous} from "./anon";
import {TestUtils} from "../../test-utils/test-utils";
import {m, mNumber} from "../types/prop-types";
import {NoProps} from "../types/registered-component";
import {ModrnHTMLElement} from "../types/component-registry";

beforeEach(() => clearRenderQueue());

it("Correctly renders constant numerical expression", async () => {

    const component1 = makeComponent().html("1 + 2 = {{1 + 2}}").register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;

    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("1 + 2 = 3");
});

it("Correctly renders constant string expression", async () => {

    const component1 = makeComponent().html("hello world = {{'hello' + 'world'}}").register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;

    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("hello world = helloworld");
});

it("Correctly renders a variable dependent expression", async () => {

    const value = 123;
    const component1 = makeComponent(NoProps, () => ({value}))
        .html("value + 234 = {{value + 234}}").register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;

    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("value + 234 = 357");
});

it("Correctly renders an expression dependent on two variables", async () => {

    const foo = 123;
    const bar = 234;
    const component1 = makeComponent(NoProps, () => ({foo, bar}))
        .html(`${foo} + ${bar} = {{foo + bar}}`).register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;

    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("123 + 234 = 357");
});

it("Correctly re-renders a variable dependant expression", async () => {

    let value = 123;
    const component1 = makeComponent(NoProps, () => ({value}))
        .html("value + 234 = {{value + 234}}").register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;

    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen(`id="root"`)}${tag1.tagClose}<p>Epilogue</p>`;
    const elem = document.getElementById("root") as ModrnHTMLElement;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("value + 234 = 357");

    value = 234;
    requestRender(elem);
    renderElements();

    expect(container.innerHTML).toContain("value + 234 = 468");
});

it("Only re-renders if required", async () => {

    let renderAB = 0, renderBC = 0;
    let a = 1;
    const b = 2;
    const c = 3;

    const componentAB = makeComponent(m({sum: mNumber()}), ({sum}) => {
        ++renderAB;
        return {sum};
    })
        .html("a + b = {{sum}}").register();

    const tagAB = registerAnonymous(componentAB);

    const componentBC = makeComponent(m({sum: mNumber()}), ({sum}) => {
        ++renderBC;
        return {sum};
    })
        .html("b + c = {{sum}}").register();
    const tagBC = registerAnonymous(componentBC);

    const component = makeComponent(NoProps, () => ({a, b, c}))
        .html(`${tagAB.tagOpen("sum=\"{{ a + b }}\"")}${tagAB.tagClose} / ${tagBC.tagOpen("sum=\"{{ b + c }}\"")}${tagBC.tagClose}`)
        .register();
    const tag1 = registerAnonymous(component);

    const container = await TestUtils.render("div") as HTMLElement;

    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen(`id="root"`)}${tag1.tagClose}<p>Epilogue</p>`;
    const elem = document.getElementById("root") as ModrnHTMLElement;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("a + b = 3");
    expect(container.innerHTML).toContain("b + c = 5");
    expect(renderAB).toBe(1);
    expect(renderBC).toBe(1);

    a = 10;
    requestRender(elem);
    renderElements();
    expect(container.innerHTML).toContain("a + b = 12");
    expect(container.innerHTML).toContain("b + c = 5");
    expect(renderAB).toBe(2);
    expect(renderBC).toBe(1);
});

it("Correctly renders the result of a function call", async () => {

    function sum(a: number, b: number) {
        return a + b;
    }

    const component1 = makeComponent(NoProps, () => ({sum, a: 10, b: 20})).html("a + b = {{sum(a, b)}}").register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;

    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen(`id="root"`)}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("a + b = 30");
});

it("Does not re-render unnecessarily", async () => {

    let renders1 = 0;
    let renders2 = 0;
    const component1 = makeComponent(m( {a: mNumber(), b: mNumber()}), props => {
        renders1++;
        return props;
    }).html("a + b = {{a + b}}").register();
    const tag1 = registerAnonymous(component1);

    const component2 = makeComponent(NoProps, () => {
        renders2++;
        return {a: 10, b: 20};
    }).html(`${tag1.tagOpen("a={{a}} b={{b}}")}${tag1.tagClose}`).register();
    const tag2 = registerAnonymous(component2);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag2.tagOpen(`id="root"`)}${tag2.tagClose}<p>Epilogue</p>`;
    const elem = document.getElementById("root") as ModrnHTMLElement;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("a + b = 30");
    expect(renders1).toBe(1);
    expect(renders2).toBe(1);

    requestRender(elem);
    renderElements();

    expect(renders1).toBe(1);
    expect(renders2).toBe(2);

});
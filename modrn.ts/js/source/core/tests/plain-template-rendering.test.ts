/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {TestUtils} from "../../test-utils/test-utils";
import {makeComponent} from "../component-declaration";
import {registerAnonymous} from "./anon";
import {clearRenderQueue} from "../render-queue";
import {NoProps} from "../types/registered-component";

beforeEach(clearRenderQueue);

it("Renders an empty tag correctly", async () => {

    const component1 = makeComponent().html("").register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
});

it("Renders an tag with simple text content correctly", async () => {

    const component1 = makeComponent().html("foobaz").register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain(`foobaz`);
});

it("Renders an tag with text variable correctly", async () => {

    const component1 = makeComponent(NoProps, () => {
        return ({text: "foobaz"});
    }).html("<p>{{text}}</p>").register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain(`foobaz`);
});

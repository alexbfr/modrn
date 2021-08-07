/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {clearRenderQueue} from "../../core/render-queue";
import {makeComponent} from "../../core/component-declaration";
import {registerAnonymous} from "../../core/tests/anon";
import {TestUtils} from "../../test-utils/test-utils";
import {showSpecialAttributeRegistration} from "../show-special-attribute";
import {NoProps} from "../../core/types/registered-component";

showSpecialAttributeRegistration;

beforeEach(clearRenderQueue);

it("Does not hide if true", async () => {

    const value = true;
    const component1 = makeComponent(NoProps, () => ({value})).html(`<span m-show="{{value}}">Hello world</span>`).register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).not.toContain(`style="display: none;"`);
});

it("Does hide if false", async () => {

    const value = false;
    const component1 = makeComponent(NoProps, () => ({value})).html(`<span m-show="{{value}}">Hello world</span>`).register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain(`style="display: none;"`);
});


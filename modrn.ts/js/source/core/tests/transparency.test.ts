/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {makeComponent} from "../component-declaration";
import {registerAnonymous} from "./anon";
import {TestUtils} from "../../test-utils/test-utils";
import {NoProps} from "../types/registered-component";

it("Propagates props transparently in simple case", async () => {

    const innerComponent = makeComponent().html("{{item}}").transparent().register();
    const innerTag = registerAnonymous(innerComponent);
    const outerComponent = makeComponent().html(`${innerTag.tagOpen("item='123'")}${innerTag.tagClose}`).register();
    const outerTag = registerAnonymous(outerComponent);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${outerTag.tagOpen()}${outerTag.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain(">123<");
});

it("Does not propagate props if not transparent in simple case", async () => {

    const innerComponent = makeComponent().html("{{item}}").register();
    const innerTag = registerAnonymous(innerComponent);
    const outerComponent = makeComponent().html(`${innerTag.tagOpen("item='123'")}${innerTag.tagClose}`).register();
    const outerTag = registerAnonymous(outerComponent);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${outerTag.tagOpen()}${outerTag.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).not.toContain(">123<");
});

it("Can replicate transparent behavior by accessing allProps", async () => {

    const innerComponent = makeComponent(NoProps, props => ({item: props.allProps().item})).html("{{item}}").register();
    const innerTag = registerAnonymous(innerComponent);
    const outerComponent = makeComponent().html(`${innerTag.tagOpen("item='123'")}${innerTag.tagClose}`).register();
    const outerTag = registerAnonymous(outerComponent);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${outerTag.tagOpen()}${outerTag.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain(">123<");
});


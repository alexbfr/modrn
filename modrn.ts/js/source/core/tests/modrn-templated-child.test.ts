/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {clearRenderQueue} from "../render-queue";
import {makeComponent} from "../component-declaration";
import {registerAnonymous} from "./anon";
import {TestUtils} from "../../test-utils/test-utils";
import {createChildrenState, useModrnChild} from "../hooks/templated-children-hooks";
import {m, mNumber, mString} from "../types/prop-types";
import {NoProps} from "../types/registered-component";

beforeEach(clearRenderQueue);

it("Renders a modrn templated child with props correctly", async () => {

    const childProps = m({
        foo: mString(),
        bar: mNumber()
    });

    const component1 = makeComponent(childProps, ({foo, bar}) => ({baz: foo, quux: bar}))
        .html("<p>{{baz}}</p><p>{{quux}}</p><p>--{{foo}}--</p><p>--{{bar}}--</p>").register();
    registerAnonymous(component1);

    const childState = createChildrenState();
    const component2 = makeComponent(NoProps, () => {
        const child = useModrnChild(childState, component1, {foo: "123", bar: 234});
        return {child};
    })
        .html("Prologue{{child}}Epilogue")
        .register();
    const tag2 = registerAnonymous(component2);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag2.tagOpen()}${tag2.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("123");
    expect(container.innerHTML).toContain("234");
    expect(container.innerHTML).not.toContain("--123--");
    expect(container.innerHTML).not.toContain("--234--");
});

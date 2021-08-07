/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {clearRenderQueue, renderElements} from "../render-queue";
import {makeComponent} from "../component-declaration";
import {registerAnonymous} from "./anon";
import {NoProps} from "../types/registered-component";
import {createState} from "../../util/state";
import {purify, useState} from "../hooks/state-hooks";
import {createChildrenState, useModrnChildren} from "../hooks/templated-children-hooks";
import {TestUtils} from "../../test-utils/test-utils";
import {getRenderQueueLength} from "../types/render-queue";

beforeEach(() => clearRenderQueue());

it("Does not render dynamic child content if not explicitly stated", async () => {

    type State = {
        items: string[];
    };

    const component1 = makeComponent().html("--{{prop}}--").register();
    registerAnonymous(component1);

    let addItemFn : (add: string) => void = () => void 0;
    const stateToken = createState<State>();
    const childrenState = createChildrenState();
    const component2 = makeComponent(NoProps, () => {
        const [{items}] = useState(stateToken, {items: ["hello"]});
        const children = useModrnChildren(childrenState, component1, items.map(item => ({prop: item})));
        addItemFn = purify(stateToken, (state, add: string) => ({items: [...state.items, add]}));
        return {children};
    })
        .html(`<span>Prologue</span>{{children}}<span>Epilogue</span>`)
        .register();
    const tag2 = registerAnonymous(component2);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `${tag2.tagOpen("id='theElem'")}${tag2.tagClose}`;

    expect(getRenderQueueLength()).toBe(0);
    expect(container.innerHTML).toContain("Prologue");
    expect(container.innerHTML).toContain("Epilogue");
    expect(container.innerHTML).toContain("hello");

    addItemFn("world");
    expect(getRenderQueueLength()).toBe(1);
    renderElements();
    expect(getRenderQueueLength()).toBe(0);
    expect(container.innerHTML).toContain("world");

});
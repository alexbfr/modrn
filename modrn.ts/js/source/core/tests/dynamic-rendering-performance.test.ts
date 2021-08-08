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
import {ModrnHTMLElement} from "../types/modrn-html-element";

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
    expect(container.innerHTML).toContain("--hello--");

    addItemFn("world");
    expect(getRenderQueueLength()).toBe(1);
    renderElements();
    expect(getRenderQueueLength()).toBe(0);
    expect(container.innerHTML).toContain("--world--");

});

beforeEach(() => clearRenderQueue());

it("Only reappends if required with lots of children", async () => {

    type State = {
        items: string[];
    };

    const initialState: State = {items:[]};
    for (let idx = 0; idx < 10000; ++idx) {
        initialState.items.push(`item${idx}`);
    }

    const component1 = makeComponent().html(`<span id='{{"idx-" + key}}'>{{prop}}</span>`).register();
    registerAnonymous(component1);

    let addItemFn: (add: string, atIdx?: number) => void = () => void 0;
    const stateToken = createState<State>();
    const childrenState = createChildrenState();
    const component2 = makeComponent(NoProps, () => {
        const [{items}] = useState(stateToken, initialState);
        const children = useModrnChildren(childrenState, component1, items.map((item, idx) => ({prop: item, key: idx})));
        addItemFn = purify(stateToken, (state, add: string, atIdx: number | undefined) => {
            const items = [...state.items];
            if (atIdx) {
                items.splice(atIdx, 0, add);
            } else {
                items.push(add);
            }
            return {items: [...state.items, add]};
        });
        return {children};
    })
        .html(`<span>Prologue</span>{{children}}<span>Epilogue</span>`)
        .register();
    const tag2 = registerAnonymous(component2);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `${tag2.tagOpen("id='theElem'")}${tag2.tagClose}`;

    const elem = document.getElementById("theElem") as ModrnHTMLElement;
    const childElem9999 = document.getElementById("idx-9999");
    if (!childElem9999) {
        throw new Error("Expected child #9999 to exist");
    }
    const elementToObserve = childElem9999.parentElement?.parentElement;
    if (!elementToObserve) {
        throw new Error("Parent element to observe not found");
    }

    function countRecords(records: MutationRecord[]) {
        return records
            .map(record => ({added: record.addedNodes.length, removed: record.removedNodes.length}))
            .reduce((previousValue, currentValue) =>
                ({added: previousValue.added + currentValue.added, removed: previousValue.removed + currentValue.removed}));
    }
    const muto = new MutationObserver(() => void 0);
    muto.observe(elementToObserve, {childList: true, subtree: true});
    addItemFn("at-the-end");

    expect(getRenderQueueLength()).toBe(1);
    renderElements();
    expect(getRenderQueueLength()).toBe(0);
    let records = muto.takeRecords();
    let results = countRecords(records);
    expect(results.added).toBe(1);
    expect(results.removed).toBe(0);

    const childElem10000 = document.getElementById("idx-10000");
    if (!childElem10000) {
        console.error(elem.innerHTML);
        throw new Error("Expected child #9999 to exist");
    }

    addItemFn("in-the-middle", 5000);
    expect(getRenderQueueLength()).toBe(1);
    renderElements();

    records = muto.takeRecords();
    results = countRecords(records);
    expect(results.added).toBe(1);
    expect(results.removed).toBe(0);
});
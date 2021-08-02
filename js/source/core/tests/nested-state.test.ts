/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {clearRenderQueue, getRenderQueueLength, renderElements} from "../render-queue";
import {makeComponent} from "../component-declaration";
import {registerAnonymous} from "./anon";
import {TestUtils} from "../../test-utils/test-utils";
import {createState} from "../../util/state";
import {useState} from "../hooks/state-hooks";
import {nextId} from "../../util/next-id";
import {m, mObj} from "../types/prop-types";
import {NoProps} from "../types/registered-component";

beforeEach(() => clearRenderQueue());

it("Propagates nested state changes correctly", async () => {

    type State = {
        name: string;
        children: State[];
    };

    const stateToken = createState<State>();

    const initialState: State = {
        name: "1",
        children: [
            {
                name: "1-1",
                children: []
            },
            {
                name: "1-2",
                children: []
            },
            {
                name: "1-3",
                children: [
                    {
                        name: "1-3-1",
                        children: []
                    }
                ]
            }
        ]
    };

    const anonymousNameInner = ("tag" + nextId());
    const componentInner = makeComponent(m({state: mObj<State>()}), ({state}) => {
        return {state};
    })
        .html(`<div id="{{state.name}}">{{state.name}}<${anonymousNameInner} m-if="{{state.children.length}}" m-for="{{state.children}}" state="{{item}}"></${anonymousNameInner}>"`)
        .register();
    const tagInner = registerAnonymous(componentInner, anonymousNameInner);

    let stateModifiedFn: ((newState: State) => State) | undefined = undefined;
    const componentOuter = makeComponent(NoProps, () => {
        const [state, setState] = useState(stateToken, initialState);
        stateModifiedFn = setState;
        return {state};
    }).html(`${tagInner.tagOpen("state='{{state}}'")}${tagInner.tagClose}`).register();
    const tagOuter = registerAnonymous(componentOuter);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tagOuter.tagOpen()}${tagOuter.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("1-3-1");

    const newState = deepCloneUpdate(initialState, initialState.children[1].children, [{
        name: "1-2-1", children: []
    }]);

    expect(getRenderQueueLength()).toBe(0);
    if (stateModifiedFn) {
        (stateModifiedFn as ((newState: State) => State))(newState);
    }
    expect(getRenderQueueLength()).toBe(1);

    renderElements();
    expect(container.innerHTML).toContain("1-2-1");


});


function deepCloneUpdate<T>(obj: T, toReplace: unknown, replaceWith: unknown): T {
    if (obj === toReplace) {
        return replaceWith as T;
    }
    if (typeof obj === "number" || typeof obj === "string" || obj === null) {
        return obj;
    }
    let changed = false;
    if (Array.isArray(obj)) {
        const result = (obj as unknown[]).map(v => {
            const newV = deepCloneUpdate(v, toReplace, replaceWith);
            changed = changed || (newV !== v);
            return newV;
        }) as unknown as T;
        return changed ? result : obj;
    }
    const result: T = {} as T;
    for (const [key, valueOriginal] of Object.entries(obj)) {
        const replaced = deepCloneUpdate(valueOriginal, toReplace, replaceWith);
        if (replaced !== valueOriginal) {
            changed = true;
        }
        result[key as keyof T] = deepCloneUpdate(valueOriginal, toReplace, replaceWith);
    }
    return changed ? result : obj;
}
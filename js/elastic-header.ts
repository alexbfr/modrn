/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {declare, makeComponent} from "./source/core/component-declaration";
import {createState} from "./source/util/state";
import {getState, mutableState, useState} from "./source/core/hooks/state-hooks";
import {createChildrenState, useTemplate} from "./source/core/hooks/templated-children-hooks";
import {m, mChild} from "./source/core/types/prop-types";
import {NoProps} from "./source/core/types/registered-component";

const draggableHeaderInitialState = {
    dragging: false,
    c: {
        x: 160,
        y: 160
    },
    start: {
        x: 0,
        y: 0
    }
};

type DraggableHeaderState = typeof draggableHeaderInitialState;

const draggableHeaderState = createState<DraggableHeaderState>();

function pageFromTouchOrMouseEvent(evt: MouseEvent | TouchEvent) {
    const {
        pageX,
        pageY
    } = (evt as TouchEvent).changedTouches ? ((evt as TouchEvent).changedTouches[0] as Touch) : (evt as MouseEvent);
    return {pageX, pageY};
}

const draggableHeaderView = makeComponent(m({
    header: mChild(),
    content: mChild()
}), ({header, content}) => {
    const [{c}] = useState(draggableHeaderState, draggableHeaderInitialState);

    const headerPath = `M0,0 L320,0 320,160Q${c.x},${c.y} 0,160`;

    const dy = c.y - 160;
    const dampen = dy > 0 ? 2 : 4;
    const contentPosition = `transform: translate3d(0,${dy / dampen}px,0)`;

    function startDrag(evt: MouseEvent | TouchEvent) {
        const [state, setState] = getState(draggableHeaderState);
        const {pageX, pageY} = pageFromTouchOrMouseEvent(evt);
        state.dragging = true;
        state.start = {x: pageX, y: pageY};
        setState(state);
    }

    function onDrag(evt: MouseEvent | TouchEvent) {
        const [state, setState] = getState(draggableHeaderState);
        const {pageX, pageY} = pageFromTouchOrMouseEvent(evt);
        if (state.dragging) {
            // dampen vertical drag by a factor
            const dy = pageY - state.start.y;
            const dampen = dy > 0 ? 1.5 : 4;
            state.c = {x: 160 + (pageX - state.start.x), y: 160 + dy / dampen};
            setState(state);
        }
    }

    function stopDrag() {
        const [state, update] = mutableState(draggableHeaderState);
        if (state.dragging) {
            const dynamics = (window as any).dynamics; // eslint-disable-line @typescript-eslint/no-explicit-any
            state.dragging = false;
            update();
            dynamics.animate(
                state.c,
                {
                    x: 160,
                    y: 160
                },
                {
                    type: dynamics.spring,
                    duration: 700,
                    friction: 280,
                    change: update
                }
            );
        }
    }

    return {header, content, headerPath, contentPosition, startDrag, onDrag, stopDrag};

}).html(`
      <div class="draggable-header-view"
        onmousedown="{{startDrag}}" ontouchstart="{{startDrag}}"
        onmousemove="{{onDrag}}" ontouchmove="{{onDrag}}"
        onmouseup="{{stopDrag}}" ontouchend="{{stopDrag}}"
        onmouseleave="{{stopDrag}}">
        <svg class="bg" width="320" height="560">
          <path :d="{{headerPath}}" fill="#3F51B5"></path>
        </svg>
        <div class="header">
          {{header}}
        </div>
        <div class="content" style="{{contentPosition}}">
          {{content}}
        </div>
      </div>
`)
    .register();

const headerChild = createChildrenState();
const contentChild = createChildrenState();

const elasticHeader = makeComponent(NoProps, () => {
    const header = useTemplate("#header", {}, headerChild);
    const content = useTemplate("#content", {}, contentChild);
    return {header, content};
}).html(`
    <draggable-header-view header="{{header}}" content="{{content}}"></draggable-header-view>
    <template id="header">
        <h1>Elastic Draggable SVG Header</h1>
        <p>
            with <a href="http://modrnts.org">Modrn.ts</a> +
            <a href="http://dynamicsjs.com">dynamics.js</a>
        </p>
    </template>
    <template id="content">
        <p>
            Note this is just an effect demo - there are of course many
            additional details if you want to use this in production, e.g.
            handling responsive sizes, reload threshold and content scrolling.
            Those are out of scope for this quick little hack. However, the idea
            is that you can hide them as internal details of a Vue.js component
            and expose a simple Web-Component-like interface.
        </p>
    </template>
`).register();

export const elasticHeaderModule = declare({
    draggableHeaderView,
    elasticHeader
});

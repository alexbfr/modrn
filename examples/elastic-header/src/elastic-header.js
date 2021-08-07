"use strict";
/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */
exports.__esModule = true;
exports.elasticHeaderModule = void 0;
var state_1 = require("modrn/source/util/state");
var component_declaration_1 = require("modrn/source/core/component-declaration");
var prop_types_1 = require("modrn/source/core/types/prop-types");
var state_hooks_1 = require("modrn/source/core/hooks/state-hooks");
var templated_children_hooks_1 = require("modrn/source/core/hooks/templated-children-hooks");
var registered_component_1 = require("modrn/source/core/types/registered-component");
var draggableHeaderInitialState = {
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
var draggableHeaderState = state_1.createState();
function pageFromTouchOrMouseEvent(evt) {
    var _a = evt.changedTouches ? evt.changedTouches[0] : evt, pageX = _a.pageX, pageY = _a.pageY;
    return { pageX: pageX, pageY: pageY };
}
var draggableHeaderView = component_declaration_1.makeComponent(prop_types_1.m({
    header: prop_types_1.mChild(),
    content: prop_types_1.mChild()
}), function (_a) {
    var header = _a.header, content = _a.content;
    var c = state_hooks_1.useState(draggableHeaderState, draggableHeaderInitialState)[0].c;
    var headerPath = "M0,0 L320,0 320,160Q" + c.x + "," + c.y + " 0,160";
    var dy = c.y - 160;
    var dampen = dy > 0 ? 2 : 4;
    var contentPosition = "transform: translate3d(0," + dy / dampen + "px,0)";
    function startDrag(evt) {
        var _a = state_hooks_1.getState(draggableHeaderState), state = _a[0], setState = _a[1];
        var _b = pageFromTouchOrMouseEvent(evt), pageX = _b.pageX, pageY = _b.pageY;
        state.dragging = true;
        state.start = { x: pageX, y: pageY };
        setState(state);
    }
    function onDrag(evt) {
        var _a = state_hooks_1.getState(draggableHeaderState), state = _a[0], setState = _a[1];
        var _b = pageFromTouchOrMouseEvent(evt), pageX = _b.pageX, pageY = _b.pageY;
        if (state.dragging) {
            // dampen vertical drag by a factor
            var dy_1 = pageY - state.start.y;
            var dampen_1 = dy_1 > 0 ? 1.5 : 4;
            state.c = { x: 160 + (pageX - state.start.x), y: 160 + dy_1 / dampen_1 };
            setState(state);
        }
    }
    function stopDrag() {
        var _a = state_hooks_1.mutableState(draggableHeaderState), state = _a[0], update = _a[1];
        if (state.dragging) {
            var dynamics = window.dynamics; // eslint-disable-line @typescript-eslint/no-explicit-any
            state.dragging = false;
            update();
            dynamics.animate(state.c, {
                x: 160,
                y: 160
            }, {
                type: dynamics.spring,
                duration: 700,
                friction: 280,
                change: update
            });
        }
    }
    return { header: header, content: content, headerPath: headerPath, contentPosition: contentPosition, startDrag: startDrag, onDrag: onDrag, stopDrag: stopDrag };
}).html("\n      <div class=\"draggable-header-view\"\n        onmousedown=\"{{startDrag}}\" ontouchstart=\"{{startDrag}}\"\n        onmousemove=\"{{onDrag}}\" ontouchmove=\"{{onDrag}}\"\n        onmouseup=\"{{stopDrag}}\" ontouchend=\"{{stopDrag}}\"\n        onmouseleave=\"{{stopDrag}}\">\n        <svg class=\"bg\" width=\"320\" height=\"560\">\n          <path :d=\"{{headerPath}}\" fill=\"#3F51B5\"></path>\n        </svg>\n        <div class=\"header\">\n          {{header}}\n        </div>\n        <div class=\"content\" style=\"{{contentPosition}}\">\n          {{content}}\n        </div>\n      </div>\n")
    .register();
var headerChild = templated_children_hooks_1.createChildrenState();
var contentChild = templated_children_hooks_1.createChildrenState();
var elasticHeader = component_declaration_1.makeComponent(registered_component_1.NoProps, function () {
    var header = templated_children_hooks_1.useTemplate("#header", {}, headerChild);
    var content = templated_children_hooks_1.useTemplate("#content", {}, contentChild);
    return { header: header, content: content };
}).html("\n    <draggable-header-view header=\"{{header}}\" content=\"{{content}}\"></draggable-header-view>\n    <template id=\"header\">\n        <h1>Elastic Draggable SVG Header</h1>\n        <p>\n            with <a href=\"http://modrnts.org\">Modrn.ts</a> +\n            <a href=\"http://dynamicsjs.com\">dynamics.js</a>\n        </p>\n    </template>\n    <template id=\"content\">\n        <p>\n            Note this is just an effect demo - there are of course many\n            additional details if you want to use this in production, e.g.\n            handling responsive sizes, reload threshold and content scrolling.\n            Those are out of scope for this quick little hack. However, the idea\n            is that you can hide them as internal details of a Vue.js component\n            and expose a simple Web-Component-like interface.\n        </p>\n    </template>\n").register();
exports.elasticHeaderModule = component_declaration_1.declare({
    draggableHeaderView: draggableHeaderView,
    elasticHeader: elasticHeader
});

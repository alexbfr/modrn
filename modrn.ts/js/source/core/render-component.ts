/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {tagify} from "../util/tagify";
import {substituteVariables} from "./variable-substition/substitute-variables";
import {AllProps} from "./types/registered-component";
import {withState} from "./component-state";
import {ComponentInfo, ModrnHTMLElement} from "./types/modrn-html-element";

/**
 * Builds the props for the element by merging attributes and custom props.
 *
 * @param self
 * @param componentInfo
 */
function buildProps(self: ModrnHTMLElement, componentInfo: ComponentInfo): Record<string, unknown> & AllProps {

    const props: Record<string, unknown> & AllProps = {allProps};

    function allProps() {
        return {...attributesOf(self), ...self.state?.customProps};
    }

    if (componentInfo.registeredComponent.propTemplate) {
        Object.entries(componentInfo.registeredComponent.propTemplate as Record<string, unknown>)
            // TODO: check type
            .forEach(([name, propTypeValue]) => { // eslint-disable-line @typescript-eslint/no-unused-vars
                const value = (self.state?.customProps[name] !== undefined) ? self.state?.customProps[name] : self.getAttribute(tagify(name));
                props[name] = value;
            });
    }

    return props;
}

/**
 * Renders the component. The root node to render may be specified explicitly during the initial rendering (the fully rendered
 * content is then appended at once).
 *
 * @param self
 * @param nodeToRender
 * @param suppressForDirectChildren
 */
export function renderComponent(self: ModrnHTMLElement, nodeToRender?: Element, suppressForDirectChildren = false): void {

    const componentInfo = self.componentInfo;
    const state = self.state;
    if (!state) {
        throw new Error(`Cannot render ${self}: no state exists`);
    }
    if (!componentInfo) {
        throw new Error(`Cannot render ${self}: componentInfo missing`);
    }
    const root = (nodeToRender || self) as Element;
    if (!root) {
        return;
    }
    const props = buildProps(self, componentInfo);
    withState(state, () => {
        let variables = componentInfo.registeredComponent.renderFunction(props) || {};
        if (componentInfo.registeredComponent.transparent) {
            variables = {...attributesOf(self), ...self.state?.customProps, ...(variables as Record<string, unknown>)};
        }
        substituteVariables(self, root, variables as Record<string, unknown>, undefined, suppressForDirectChildren);
    });
}

/**
 * Extract attributes to a more convenient record.
 * @param self
 */
function attributesOf(self: HTMLElement): Record<string, string> {
    const result: Record<string, string> = {};
    const length = self.attributes.length;
    for (let index = 0; index < length; ++index) {
        const {name, value} = self.attributes.item(index) || {};
        if (name && value) {
            result[name] = value;
        }
    }
    return result;
}


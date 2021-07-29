import {ComponentInfo, ModrnHTMLElement, withState} from "./component-registry";
import {tagify} from "../util/tagify";
import {substituteVariables} from "./variable-substition/substitute-variables";
import {AllProps} from "./component-declaration";

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

export function renderComponent(self: ModrnHTMLElement, nodeToRender?: HTMLElement, suppressForDirectChildren = false): void {

    const componentInfo = self.componentInfo;
    const state = self.state;
    if (!state) {
        throw new Error(`Cannot render ${self}: no state exists`);
    }
    if (!componentInfo) {
        throw new Error(`Cannot render ${self}: componentInfo missing`);
    }
    const root = (nodeToRender || self) as HTMLElement;
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
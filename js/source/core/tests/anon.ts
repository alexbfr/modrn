import {RegisteredComponent} from "../component-declaration";
import {nextId} from "../../util/next-id";
import {only} from "../modrn-base";

export function registerAnonymous(component: RegisteredComponent<unknown, unknown>, overrideName?: string): {
    tagOpen: (attributes?: string) => string,
    tagClose: string
} {

    const anonymousName = overrideName || ("tag" + nextId());
    const componentInfo = only(anonymousName, component);

    return {tagOpen: attributes => `<${componentInfo.tagName}${attributes ? " " + attributes : ""}>`, tagClose: `</${componentInfo.tagName}>`};
}
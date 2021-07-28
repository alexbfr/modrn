import {RegisteredComponent} from "../component-declaration";
import {nextId} from "../../util/next-id";
import {only} from "../modrn";

export function registerAnonymous(component: RegisteredComponent<unknown, unknown>): {
    tagOpen: (attributes?: string) => string,
    tagClose: string
} {

    const anonymousName = "tag" + nextId();
    const componentInfo = only(anonymousName, component);

    return {tagOpen: attributes => `<${componentInfo.tagName}${attributes ? " " + attributes : ""}>`, tagClose: `</${componentInfo.tagName}>`};
}
/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {nextId} from "../../util/next-id";
import {only} from "../modrn-base";
import {RegisteredComponent} from "../types/registered-component";

export function registerAnonymous(component: RegisteredComponent<unknown, unknown>, overrideName?: string): {
    tagOpen: (attributes?: string) => string,
    tagClose: string
} {

    const anonymousName = overrideName || ("tag" + nextId());
    const componentInfo = only(anonymousName, component);

    return {tagOpen: attributes => `<${componentInfo.tagName}${attributes ? " " + attributes : ""}>`, tagClose: `</${componentInfo.tagName}>`};
}
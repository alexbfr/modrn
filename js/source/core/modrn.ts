/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {getComponentRegistry, registerAll} from "./component-registry";
import {childrenChanged, componentHasConnected, componentHasDisconnected} from "./modrn-base";
import {ifSpecialAttributeRegistration} from "../special-attributes/if-special-attribute";
import {forSpecialAttributeRegistration} from "../special-attributes/for-special-attribute";
import {classSpecialAttributeRegistration} from "../special-attributes/class-special-attribute";
import {showSpecialAttributeRegistration} from "../special-attributes/show-special-attribute";
import {autofocusSpecialAttributeRegistration} from "../special-attributes/autofocus-special-attribute";
import {keyupSpecialAttributeRegistration} from "../special-attributes/keyup-special-attribute";
import {
    changeSpecialAttributeRegistration,
    inputSpecialAttributeRegistration
} from "../special-attributes/change-special-attribute";
import {ModuleResult} from "./types/registered-component";
import {initializeAll} from "./component-static-initialize";

/**
 * Perform the global initialization of all components contained in the provided module list.
 * This creates a custom element (aka web component) for each of them.
 *
 * @param modules
 */
export function modrn(...modules: ModuleResult<never, never>[]): void { // eslint-disable-line
    registerAll(componentHasConnected, childrenChanged, componentHasDisconnected);
    initializeAll(getComponentRegistry());
}

ifSpecialAttributeRegistration;
forSpecialAttributeRegistration;
classSpecialAttributeRegistration;
showSpecialAttributeRegistration;
autofocusSpecialAttributeRegistration;
keyupSpecialAttributeRegistration;
changeSpecialAttributeRegistration;
inputSpecialAttributeRegistration;
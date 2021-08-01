import {getComponentRegistry, registerAll} from "./component-registry";
import {ModuleResult} from "./component-declaration";
import {childrenChanged, componentHasConnected, componentHasDisconnected, initializeAll} from "./modrn-base";
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

export function start(...modules: ModuleResult<never, never>[]): void { // eslint-disable-line
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
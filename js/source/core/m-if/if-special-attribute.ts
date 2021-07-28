import {registerSpecialAttribute} from "../variable-analysis/register-special-attribute";
import {ModrnHTMLElement, register} from "../component-registry";
import {declare, m, makeComponent, mBool, NoProps} from "../component-declaration";
import {useChild} from "../templated-children-hooks";
import {only} from "../modrn";
import {varsWithOptions} from "../variable-substition/substitute-variables";

const IF_PRECEDENCE = -2;

const ifComponent = makeComponent(m({"m-if": mBool()}), props => {
    const child = useChild(props["m-if"] ? varsWithOptions(props.allProps(), {hideByDefault: true}) : null);
    return {child};
}).html(`{{child}}`).transparent().register();

only("modrn-if", ifComponent).isSpecialAttribute = true;

registerSpecialAttribute("m-if", ifSpecialAttributeHandler, IF_PRECEDENCE);

function ifSpecialAttributeHandler(elem: HTMLElement): ModrnHTMLElement {
    if (!ifComponent.customElementConstructor) {
        throw new Error("Constructor missing for if component");
    }
    return new ifComponent.customElementConstructor() as ModrnHTMLElement;
}


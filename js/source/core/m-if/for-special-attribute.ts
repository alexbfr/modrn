import {registerSpecialAttribute} from "../variable-analysis/register-special-attribute";
import {ModrnHTMLElement, register} from "../component-registry";
import {declare, m, makeComponent, mArray, mBool, NoProps} from "../component-declaration";
import {useChild, useChildren} from "../templated-children-hooks";
import {only} from "../modrn";

const FOR_PRECEDENCE = -1;

const forComponent = makeComponent(m({"m-for": mArray<unknown>()}), props => {
    const children = useChildren(props["m-for"], props.allProps());
    return {children};
}).html(`{{children}}`).transparent().register();

only("modrn-for", forComponent).isSpecialAttribute = true;

registerSpecialAttribute("m-for", forSpecialAttributeHandler, FOR_PRECEDENCE);

function forSpecialAttributeHandler(elem: HTMLElement): ModrnHTMLElement {
    if (!forComponent.customElementConstructor) {
        throw new Error("Constructor missing for 'for' component");
    }
    return new forComponent.customElementConstructor() as ModrnHTMLElement;
}


import {registerSpecialAttribute} from "../variable-analysis/register-special-attribute";
import {ModrnHTMLElement, SpecialAttributeHandlerFnResult} from "../component-registry";
import {m, makeComponent, mBool} from "../component-declaration";
import {useChild} from "../templated-children-hooks";
import {varsWithOptions} from "../variable-substition/substitute-variables";
import {only} from "../modrn-base";

const IF_PRECEDENCE = -2;

const ifComponent = makeComponent(m({"mIf": mBool()}), props => {
    const vars = props.allProps();
    const child = useChild(props["mIf"] ? varsWithOptions(vars, {hideByDefault: true}) : null);
    return {child};
}).html(`{{child}}`).transparent().register();

only("modrn-if", ifComponent).isSpecialAttribute = true;

export const ifSpecialAttributeRegistration = registerSpecialAttribute("m-if", ifSpecialAttributeHandler, IF_PRECEDENCE);

function ifSpecialAttributeHandler(): SpecialAttributeHandlerFnResult {
    if (!ifComponent.customElementConstructor) {
        throw new Error("Constructor missing for if component");
    }
    return {
        transformedElement: new ifComponent.customElementConstructor() as ModrnHTMLElement
    };
}


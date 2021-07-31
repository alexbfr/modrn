import {registerSpecialAttribute} from "../variable-analysis/register-special-attribute";
import {ModrnHTMLElement, SpecialAttributeHandlerFnResult} from "../component-registry";
import {m, makeComponent, mArray, mString} from "../component-declaration";
import {useChildren} from "../templated-children-hooks";
import {only} from "../modrn-base";

const FOR_PRECEDENCE = -1;
const AS_PRECEDENCE = -100;

const forComponent = makeComponent(m({mFor: mArray<unknown>(), mAs: mString(), mIndexAs: mString()}), ({mFor, mAs, mIndexAs, ...rest}) => {
    const allProps = {...rest.allProps()};
    delete allProps.mFor;
    delete allProps.mAs;
    delete allProps.mIndexAs;
    const children = useChildren(mFor, allProps, mAs || "item", mIndexAs || "index");
    return {children};
}).html(`{{children}}`).transparent().register();

only("modrn-for", forComponent).isSpecialAttribute = true;

export const forSpecialAttributeRegistration = registerSpecialAttribute("m-for", forSpecialAttributeHandler, FOR_PRECEDENCE);
export const asSpecialAttributeRegistration = registerSpecialAttribute("m-as", asSpecialAttributeHandler, AS_PRECEDENCE);
export const indexAsSpecialAttributeRegistration = registerSpecialAttribute("m-index-as", asSpecialAttributeHandler, AS_PRECEDENCE);

function forSpecialAttributeHandler(): SpecialAttributeHandlerFnResult {
    if (!forComponent.customElementConstructor) {
        throw new Error("Constructor missing for 'for' component");
    }
    return {
        transformedElement: new forComponent.customElementConstructor() as ModrnHTMLElement
    };
}

function asSpecialAttributeHandler(): SpecialAttributeHandlerFnResult {
    return {
        valueTransformer: (element, value) => value
    };
}


import {VariableNameTuple} from "./variable-types";
import {
    AttributeVariable, FoundVariables, Fragment,
    isRegisteredTagName,
    ModrnHTMLElement,
    SpecialAttributeVariable,
    Variable,
    Variables,
    VariableType
} from "../component-registry";
import {splitTextContentAtVariables} from "./split-text-content-at-variables";
import {findChildVariables} from "./find-child-variables";
import {findAttributeVariables} from "./find-attribute-variables";
import {findAttributeRefVariables} from "./find-attribute-ref-variables";
import {findSpecialAttributes, hasSpecialAttributes} from "./find-special-attributes";

function precedenceComparer(s1: VariableNameTuple<SpecialAttributeVariable>, s2: VariableNameTuple<SpecialAttributeVariable>): number {
    return s1.variable.specialAttributeRegistration.precedence - s2.variable.specialAttributeRegistration.precedence;
}

function analyzeWrappedFragment(
    rootElementProvided: HTMLElement, indexes: number[], specialAttributes: VariableNameTuple<SpecialAttributeVariable>[]) {

    let rootElement = rootElementProvided;
    const result: VariableNameTuple<Variable>[] = [];

    const specialAttribute = specialAttributes[0];
    rootElement.removeAttribute(specialAttribute.variable.specialAttributeRegistration.attributeName);
    rootElement = specialAttribute.variable.specialAttributeRegistration.handler(rootElement);

    const variableResult = findVariables(rootElementProvided);
    const newRootElement = variableResult.potentiallyModifiedRootElement;

    const subFragment: Fragment = {
        childElement: newRootElement,
        variableDefinitions: variableResult.variables
    };
    if (subFragment.variableDefinitions) {
        const subVariables = Object.keys(subFragment.variableDefinitions)
            .map(variableName => ({
                variable: {
                    indexes,
                    attributeName: variableName,
                    type: VariableType.attribute,
                    hidden: true
                },
                variableName
            } as VariableNameTuple<AttributeVariable>));
        result.push(...subVariables);
    }

    const parentElement = newRootElement.parentElement;
    if (!parentElement) {
        throw new Error(`Parent element was assumed to exist, but didn't at ${newRootElement}`);
    }

    parentElement.insertBefore(rootElement, newRootElement);
    parentElement.removeChild(newRootElement);
    (rootElement as ModrnHTMLElement).notifyChildrenChanged(subFragment);

    result.push(specialAttribute);
    return {
        result,
        rootElement
    };
}

function analyze(rootElement: HTMLElement, indexes: number[]): VariableNameTuple<Variable>[] {
    const specialAttributes = findSpecialAttributes(rootElement, indexes).sort(precedenceComparer);

    if (specialAttributes.length > 0) {
        return analyzeWrappedFragment(rootElement, indexes, specialAttributes).result;
    }

    const result: VariableNameTuple<Variable>[] = [];
    result.push(...findChildVariables(rootElement, indexes));
    result.push(...findAttributeVariables(rootElement, indexes));
    result.push(...findAttributeRefVariables(rootElement, indexes));
    if (!isRegisteredTagName(rootElement.tagName)) {
        result.push(...iterateChildren(rootElement, indexes));
    }
    return result;
}

function iterateChildren(rootElement: HTMLElement, indexes: number[]): VariableNameTuple<Variable>[] {
    const result: VariableNameTuple<Variable>[] = [];
    splitTextContentAtVariables(rootElement);
    if (!rootElement.firstElementChild) {
        return result;
    }
    const length = rootElement.childNodes.length;
    for (let idx = 0; idx < length; ++idx) {
        const element = rootElement.childNodes.item(idx) as HTMLElement;
        if (!element.tagName) {
            continue;
        }
        result.push(...analyze(element, [...indexes, idx]));
    }
    return result;
}

export function findVariables(rootElement: HTMLElement): FoundVariables {
    const result: Variables = {};

    splitTextContentAtVariables(rootElement);
    const specialAttributes = findSpecialAttributes(rootElement, []);

    let vars: VariableNameTuple<Variable>[];
    let newRootElement = rootElement;

    if (specialAttributes.length) {
        const analyzed = analyzeWrappedFragment(rootElement, [], specialAttributes);
        vars = analyzed.result;
        newRootElement = analyzed.rootElement;
    } else {
        vars =  [...analyze(rootElement, []), ...iterateChildren(rootElement, [])];;
    }

    vars.forEach(value => {
        const list = result[value.variableName] || (result[value.variableName] = []);
        list.push(value.variable);
    });

    return {
        variables: result,
        potentiallyModifiedRootElement: newRootElement
    };
}
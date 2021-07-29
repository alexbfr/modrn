import {
    AttributeVariable,
    ComplexExpression,
    ExpressionType,
    FoundVariables,
    Fragment,
    isRegisteredTagName,
    MappingType,
    ModrnHTMLElement,
    SpecialAttributeVariable,
    VariableMapping,
    VariableMappings,
    VariableUsageExpression
} from "../component-registry";
import {splitTextContentAtVariables} from "./split-text-content-at-variables";
import {findChildVariables} from "./find-child-variables";
import {findAttributeVariables} from "./find-attribute-variables";
import {findAttributeRefVariables} from "./find-attribute-ref-variables";
import {findSpecialAttributes} from "./find-special-attributes";

function precedenceComparer(s1: SpecialAttributeVariable, s2: SpecialAttributeVariable): number {
    return s1.specialAttributeRegistration.precedence - s2.specialAttributeRegistration.precedence;
}

function analyzeWrappedFragment(
    rootElementProvided: HTMLElement, indexes: number[], specialAttributes: SpecialAttributeVariable[]) {

    let rootElement = rootElementProvided;
    const result: VariableMapping[] = [];

    const specialAttribute = specialAttributes[0];
    rootElement.removeAttribute(specialAttribute.specialAttributeRegistration.attributeName);
    rootElement = specialAttribute.specialAttributeRegistration.handler(rootElement);

    const variableResult = findVariables(rootElementProvided);
    const newRootElement = variableResult.newRootElement;

    const subFragment: Fragment = {
        childElement: newRootElement,
        variableDefinitions: variableResult.variables
    };
    if (subFragment.variableDefinitions) {
        const subVariables = Object.keys(subFragment.variableDefinitions)
            .map(variableName => ({
                indexes,
                attributeName: variableName,
                type: MappingType.attribute,
                hidden: true,
                expression: {expressionType: ExpressionType.VariableUsage, variableName} as VariableUsageExpression
            } as AttributeVariable));
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

function analyze(rootElement: HTMLElement, indexes: number[]): VariableMapping[] {
    const specialAttributes = findSpecialAttributes(rootElement, indexes).sort(precedenceComparer);

    if (specialAttributes.length > 0) {
        return analyzeWrappedFragment(rootElement, indexes, specialAttributes).result;
    }

    const result: VariableMapping[] = [];
    result.push(...findChildVariables(rootElement, indexes));
    result.push(...findAttributeVariables(rootElement, indexes));
    result.push(...findAttributeRefVariables(rootElement, indexes));
    if (!isRegisteredTagName(rootElement.tagName)) {
        result.push(...iterateChildren(rootElement, indexes));
    }
    return result;
}

function iterateChildren(rootElement: HTMLElement, indexes: number[]): VariableMapping[] {
    const result: VariableMapping[] = [];
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

function allVariableReferencesOf(varMapping: VariableMapping): string[] {
    switch (varMapping.expression.expressionType) {
    case ExpressionType.VariableUsage:
        return [(varMapping.expression as VariableUsageExpression).variableName];
    case ExpressionType.ComplexExpression:
        return (varMapping.expression as ComplexExpression).usedVariableNames;
    default:
        throw new Error(`Unknown expression type for ${varMapping} (${varMapping.expression.expressionType})`);
    }
}

export function findVariables(rootElement: HTMLElement): FoundVariables {
    const result: VariableMappings = {};

    splitTextContentAtVariables(rootElement);
    const specialAttributes = findSpecialAttributes(rootElement, []);

    let vars: VariableMapping[];
    let newRootElement = rootElement;

    if (specialAttributes.length) {
        const analyzed = analyzeWrappedFragment(rootElement, [], specialAttributes);
        vars = analyzed.result;
        newRootElement = analyzed.rootElement;
    } else {
        vars =  [...analyze(rootElement, []), ...iterateChildren(rootElement, [])];
    }

    vars.forEach(varMapping => {
        allVariableReferencesOf(varMapping).forEach(variableName => {
            const list = result[variableName] || (result[variableName] = []);
            list.push(varMapping);
        });
    });

    return {
        variables: result,
        newRootElement: newRootElement
    };
}
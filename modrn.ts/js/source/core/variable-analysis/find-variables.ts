/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {splitTextContentAtVariables} from "./split-text-content-at-variables";
import {findChildVariables} from "./find-child-variables";
import {findAttributeVariables} from "./find-attribute-variables";
import {findAttributeRefVariables} from "./find-attribute-ref-variables";
import {findSpecialAttributes} from "./find-special-attributes";
import {tagify} from "../../util/tagify";
import {
    AttributeVariable,
    FoundVariables,
    MappingType,
    SpecialAttributeVariable,
    VariableMapping,
    VariablesByNodeIndex
} from "../types/variables";
import {
    ComplexExpression,
    ExpressionType,
    FunctionReferenceExpression,
    VariableUsageExpression
} from "../types/expression-types";
import {Fragment, ModrnHTMLElement} from "../types/modrn-html-element";
import {isRegisteredTagName} from "../types/component-registry";

/**
 * Finds variable references in the provided element.
 * This function inspects all children recursively. If a ModrnHTMLElement is encountered,
 * recursion stops there (a ModrnHTMLElement will have done the same process for its own content already).
 *
 * Also, there is specific handling for special attributes which wrap their element (like m-if or m-for).
 *
 * @param rootElement
 */
export function findVariables(rootElement: Element): FoundVariables {
    const allMappings: {
        [variableName: string]: VariableMapping[],
        __constants: VariableMapping[]
    } = {
        __constants: []
    };
    const result: {
        [indexString: string]: VariablesByNodeIndex
    } = {};

    // Ensure variables occurring in textContent are in their own respective nodes
    splitTextContentAtVariables(rootElement);

    // Look for special attributes
    const specialAttributes = findSpecialAttributes(rootElement, []);

    let vars: VariableMapping[] = [];
    let newRootElement = rootElement;

    // If we do have special attributes, the root element may have been changed if the attribute is of the wrapping kind
    if (specialAttributes.length) {
        const analyzed = analyzeWrappedFragment(rootElement, [], specialAttributes, vars);
        newRootElement = analyzed.rootElement;
    }

    /** If the root element was changed, we don't need to delve into children since this will already have been done {@see analyzeWrappedFragment} */
    if (newRootElement === rootElement) {
        vars = [...vars, ...analyze(rootElement, []), ...iterateChildren(rootElement, [])];
    }

    // Normalize the list of variable mappings by putting them in a map first in order to group by child node indexes
    vars.forEach(varMapping => {
        const indexesString = varMapping.indexes.join(",");
        const where = result[indexesString] || (result[indexesString] = {
            indexes: varMapping.indexes,
            mappings: {__constants: []}
        });
        if (varMapping.expression.expressionType === ExpressionType.ConstantExpression) {
            where.mappings.__constants.push(varMapping);
            allMappings.__constants.push(varMapping);
        }
        allVariableReferencesOf(varMapping).forEach(variableName => {
            const list = where.mappings[variableName] || (where.mappings[variableName] = []);
            list.push(varMapping);
            const allList = allMappings[variableName] || (allMappings[variableName] = []);
            allList.push(varMapping);
        });
    });

    // Finally, return the result by taking the grouped result object's entries and sort by the indexes (ensuring the
    // element will be updated from top of hierarchy to bottom of hierarchy)
    return {
        variables: {
            sorted: Object.entries(result)
                .sort(([, value1], [, value2]) => indexArrayComparer(value1.indexes, value2.indexes))
                .map(([, vars]) => vars),
            all: allMappings
        },
        newRootElement: newRootElement
    };
}

/**
 * Analyzes the provided element for variable references.
 *
 * @param rootElement
 * @param indexes
 */
function analyze(rootElement: Element, indexes: number[]): VariableMapping[] {
    const specialAttributes = findSpecialAttributes(rootElement, indexes).sort(precedenceComparer);

    const result: VariableMapping[] = [];
    if (specialAttributes.length > 0) {
        const wrappedFragmentResult = analyzeWrappedFragment(rootElement, indexes, specialAttributes, result);
        if (wrappedFragmentResult.rootElement !== rootElement) {
            return result;
        }
    }

    result.push(...findChildVariables(rootElement, indexes));
    result.push(...findAttributeVariables(rootElement, indexes));
    result.push(...findAttributeRefVariables(rootElement, indexes));
    if (!isRegisteredTagName(rootElement.tagName)) {
        result.push(...iterateChildren(rootElement, indexes));
    }
    return result;
}

/**
 * Inspect children
 * @param rootElement
 * @param indexes
 */
function iterateChildren(rootElement: Element, indexes: number[]): VariableMapping[] {
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

/**
 * Extract all variable references in a mapping
 * @param varMapping
 */
function allVariableReferencesOf(varMapping: VariableMapping): string[] {
    switch (varMapping.expression.expressionType) {
    case ExpressionType.VariableUsage:
        return [(varMapping.expression as VariableUsageExpression).variableName];
    case ExpressionType.ComplexExpression:
        return (varMapping.expression as ComplexExpression).usedVariableNames;
    case ExpressionType.ConstantExpression:
        return [];
    case ExpressionType.FunctionReferenceExpression:
        return (varMapping.expression as FunctionReferenceExpression).usedVariableNames;
    default:
        throw new Error(`Unknown expression type for ${varMapping} (${varMapping.expression.expressionType})`);
    }
}

type WrappedFragmentResult = {
    rootElement: Element;
}

/**
 * Analyze the first special attribute, recurse over the rest (since we have to take precedence into account and some
 * special attributes may be of the wrapping kind, like m-for)
 *
 * This is not optimal but unlikely to be a measurable bottleneck.
 *
 * @param rootElementProvided
 * @param indexes
 * @param specialAttributes
 * @param result
 */
function analyzeWrappedFragment(
    rootElementProvided: Element, indexes: number[], specialAttributes: SpecialAttributeVariable[], result: VariableMapping[]): WrappedFragmentResult {

    let rootElement = rootElementProvided;

    if (specialAttributes.length === 0) {
        return {
            rootElement
        };
    }

    const specialAttribute = specialAttributes[0];
    rootElement.removeAttribute(specialAttribute.specialAttributeRegistration.attributeName);

    // Invoke the handler function
    const specialAttributeHandlerResult = specialAttribute.specialAttributeRegistration?.handler(rootElement);

    // Check if there is a new element returned, if so, recurse directly into it
    if (specialAttributeHandlerResult.transformedElement && specialAttributeHandlerResult.transformedElement !== rootElement) {
        rootElement = specialAttributeHandlerResult.transformedElement;

        // Recursively analyze variables in the original (unwrapped) item
        const variableResult = findVariables(rootElementProvided);
        const newRootElement = variableResult.newRootElement;

        // Build a fragment of the result (will be assigned as dynamic child later on)
        const subFragment: Fragment = {
            childElement: newRootElement,
            variableDefinitions: variableResult.variables
        };

        // Re-map found variable definitions; all variable definitions now are attributes (i.e. custom props) to the
        // wrapping container
        if (subFragment.variableDefinitions) {
            const subVariables = Object.keys(subFragment.variableDefinitions.all)
                .map(variableName => ({
                    indexes,
                    attributeName: tagify(variableName),
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

        // Inform the wrapping element of its dynamic children
        (rootElement as ModrnHTMLElement).notifyChildrenChanged(subFragment);

        // And add to parent, removing the wrapped children
        parentElement.insertBefore(rootElement, newRootElement);
        parentElement.removeChild(newRootElement);

        result.push(specialAttribute);
        return {
            rootElement
        };
    }
    specialAttributes.splice(0, 1);
    result.push({
        type: MappingType.specialAttribute,
        hidden: false,
        indexes,
        attributeName: specialAttributeHandlerResult.remapAttributeName ? specialAttributeHandlerResult.remapAttributeName(specialAttribute.attributeName) : specialAttribute.attributeName,
        expression: specialAttribute.expression,
        specialAttributeRegistration: specialAttribute.specialAttributeRegistration,
        valueTransformer: specialAttributeHandlerResult.valueTransformer
    } as SpecialAttributeVariable);
    return analyzeWrappedFragment(rootElementProvided, indexes, specialAttributes, result);
}

function precedenceComparer(s1: SpecialAttributeVariable, s2: SpecialAttributeVariable): number {
    return s1.specialAttributeRegistration.precedence - s2.specialAttributeRegistration.precedence;
}

function indexArrayComparer(indexes1: number[], indexes2: number[]): number {
    const l1 = indexes1.length;
    const l2 = indexes2.length;
    if (l1 < l2) {
        return -1;
    } else if (l1 > l2) {
        return 1;
    }
    for (let idx = 0; idx < l1; idx++) {
        const v1 = indexes1[idx];
        const v2 = indexes2[idx];
        if (v1 < v2) {
            return -1;
        } else if (v1 > v2) {
            return 1;
        }
    }
    return 0;
}

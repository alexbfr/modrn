/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {extractExpression, isRefAttributeName, isWildcardAttributeName} from "./extract-expression";
import {logDiagnostic} from "../../util/logging";
import {expressionPattern} from "./variable-types";
import {AttributeVariable, MappingType} from "../types/variables";
import {ConstantExpression, ExpressionType} from "../types/expression-types";

/**
 * Searches for attribute variables
 * @example
 * <span title="{{dynamicTitle}}">...</span>
 *
 * @param rootElement
 * @param indexes
 */
export function findAttributeVariables(rootElement: Element, indexes: number[]): AttributeVariable[] {
    const result: AttributeVariable[] = [];
    const attributes = (rootElement as Element)?.attributes;
    const attributesLength = attributes?.length || 0;
    if (attributes && attributes?.length > 0) {
        for (let attIdx = 0; attIdx < attributesLength; ++attIdx) {
            const {name, value} = extractNameAndValue(rootElement, attributes, attIdx);
            if (name && !isRefAttributeName(name) && !isWildcardAttributeName(name) && value && expressionPattern.test(value)) {
                logDiagnostic(`Found attribute ${name} at indexes ${indexes} for node `, rootElement);
                rootElement.setAttribute(name, "");
                const expression = extractExpression(value);
                if (expression.expressionType === ExpressionType.ConstantExpression) {
                    rootElement.setAttribute(name, "" + ((expression as ConstantExpression).value));
                    continue;
                }
                result.push({
                    attributeName: name,
                    expression,
                    indexes,
                    hidden: false,
                    type: MappingType.attribute
                } as AttributeVariable);
            }
        }
    }
    return result;
}

function extractNameAndValue(element: Element, attributes: NamedNodeMap, attIdx: number) {
    const {name, value} =  attributes.item(attIdx) || {name: null, value: null};
    if (name?.startsWith(":")) {
        element.removeAttribute(name);
        const newName = name.substring(1);
        return {name: newName, value};
    }
    return {name, value};
}


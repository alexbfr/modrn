/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {extractExpression, isRefAttributeName} from "./extract-expression";
import {ExpressionType, VariableUsageExpression} from "../types/expression-types";
import {AttributeRefVariable, MappingType} from "../types/variables";

/**
 * Searches for ref attributes
 * @example
 * <span ref="{{myRef}}">...</span>
 *
 * @param rootElement
 * @param indexes
 */
export function findAttributeRefVariables(rootElement: Element, indexes: number[]): AttributeRefVariable[] {
    const result: AttributeRefVariable[] = [];
    const attributes = (rootElement as HTMLElement)?.attributes;
    const attributesLength = attributes?.length || 0;
    if (attributes && attributes?.length > 0) {
        for (let attIdx = 0; attIdx < attributesLength; ++attIdx) {
            const {name, value} = attributes.item(attIdx) || {name: null, value: null};
            if (name && value && isRefAttributeName(name)) {
                rootElement.removeAttribute(name);
                const expression = extractExpression(value) as VariableUsageExpression;
                if (expression.expressionType !== ExpressionType.VariableUsage) {
                    throw new Error("Ref attribute must be a direct reference");
                }
                result.push({
                    expression,
                    type: MappingType.attributeRef,
                    indexes
                });
            }
        }
    }
    return result;
}


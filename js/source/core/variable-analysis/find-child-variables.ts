/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {ELEMENT_NODE} from "./variable-types";
import {extractExpression} from "./extract-expression";
import {hasSpecialAttributes} from "./find-special-attributes";
import {ChildVariable, MappingType} from "../types/variables";
import {ConstantExpression, ExpressionType} from "../types/expression-types";

/**
 * Searches for child variables
 * @example
 * <span>{{aChild}}</span>
 *
 * @param rootElement
 * @param indexes
 */
export function findChildVariables(rootElement: Element, indexes: number[]): ChildVariable[] {
    const result: ChildVariable[] = [];
    const length = rootElement.childNodes.length;
    for (let idx = 0; idx < length; ++idx) {
        const childNode = rootElement.childNodes.item(idx);
        if (childNode.nodeType === ELEMENT_NODE && hasSpecialAttributes(childNode as HTMLElement)) {
            continue;
        }
        const textContent = childNode.textContent;
        if (textContent && textContent.startsWith("{{") && textContent.endsWith("}}")) {
            childNode.textContent = "";
            const newIndexes = [...indexes, idx];
            const expression = extractExpression(textContent);
            if (expression.expressionType === ExpressionType.ConstantExpression) {
                childNode.textContent = "" + ((expression as ConstantExpression).value);
                continue;
            }
            result.push({
                expression,
                type: MappingType.childVariable,
                indexes: newIndexes
            });
        }
    }
    return result;
}

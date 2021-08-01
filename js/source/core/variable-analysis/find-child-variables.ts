import {ChildVariable, ConstantExpression, ExpressionType, MappingType} from "../component-registry";
import {ELEMENT_NODE} from "./variable-types";
import {extractExpression} from "./helpers";
import {hasSpecialAttributes} from "./find-special-attributes";

export function findChildVariables(rootElement: HTMLElement, indexes: number[]): ChildVariable[] {
    const result: ChildVariable[] = [];
    const length = rootElement.childNodes.length;
    for (let idx = 0; idx < length; ++idx) {
        const childNode = rootElement.childNodes.item(idx);
        if (childNode.nodeType === ELEMENT_NODE && hasSpecialAttributes(childNode as HTMLElement)) {
            continue;
        }
        const textContent = childNode.textContent;
        if (textContent && textContent.startsWith("{{") && textContent.endsWith("}}")) {
            if (rootElement instanceof SVGElement && (rootElement.textContent?.indexOf("axisLabels") || -1) >= 0) {
                debugger;
            }
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

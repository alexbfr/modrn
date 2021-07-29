import {AttributeRefVariable, ExpressionType, MappingType, VariableUsageExpression} from "../component-registry";
import {extractExpression, isRefAttributeName} from "./helpers";

export function findAttributeRefVariables(rootElement: HTMLElement, indexes: number[]): AttributeRefVariable[] {
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


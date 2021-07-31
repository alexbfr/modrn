import {AttributeVariable, ConstantExpression, ExpressionType, MappingType} from "../component-registry";
import {extractExpression, isRefAttributeName, isWildcardAttributeName} from "./helpers";
import {logDiagnostic} from "../../util/logging";
import {expressionPattern} from "./variable-types";

function extractNameAndValue(element: HTMLElement | SVGElement, attributes: NamedNodeMap, attIdx: number) {
    const {name, value} =  attributes.item(attIdx) || {name: null, value: null};
    if (name?.startsWith(":")) {
        element.removeAttribute(name);
        const newName = name.substring(1);
        return {name: newName, value};
    }
    return {name, value};
}

export function findAttributeVariables(rootElement: HTMLElement | SVGElement, indexes: number[]): AttributeVariable[] {
    const result: AttributeVariable[] = [];
    const attributes = (rootElement as HTMLElement)?.attributes;
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


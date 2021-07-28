import {VariableNameTuple, variablePattern} from "./variable-types";
import {AttributeVariable, VariableType} from "../component-registry";
import {extractVariableName, isRefAttributeName, isWildcardAttributeName} from "./helpers";
import {logDiagnostic} from "../../util/logging";

export function findAttributeVariables(rootElement: HTMLElement, indexes: number[]): VariableNameTuple<AttributeVariable>[] {
    const result: VariableNameTuple<AttributeVariable>[] = [];
    const attributes = (rootElement as HTMLElement)?.attributes;
    const attributesLength = attributes?.length || 0;
    if (attributes && attributes?.length > 0) {
        for (let attIdx = 0; attIdx < attributesLength; ++attIdx) {
            const {name, value} = attributes.item(attIdx) || {name: null, value: null};
            if (name && !isRefAttributeName(name) && !isWildcardAttributeName(name) && value && variablePattern.test(value)) {
                logDiagnostic(`Found attribute ${name} at indexes ${indexes} for node `, rootElement);
                rootElement.setAttribute(name, "");
                result.push({
                    variableName: extractVariableName(value),
                    variable: {
                        type: VariableType.attribute,
                        attributeName: name,
                        indexes
                    }
                });
            }
        }
    }
    return result;
}


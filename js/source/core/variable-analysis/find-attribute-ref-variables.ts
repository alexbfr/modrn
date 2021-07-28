import {VariableNameTuple} from "./variable-types";
import {AttributeRefVariable, VariableType} from "../component-registry";
import {extractVariableName, isRefAttributeName} from "./helpers";

export function findAttributeRefVariables(rootElement: HTMLElement, indexes: number[]): VariableNameTuple<AttributeRefVariable>[] {
    const result: VariableNameTuple<AttributeRefVariable>[] = [];
    const attributes = (rootElement as HTMLElement)?.attributes;
    const attributesLength = attributes?.length || 0;
    if (attributes && attributes?.length > 0) {
        for (let attIdx = 0; attIdx < attributesLength; ++attIdx) {
            const {name, value} = attributes.item(attIdx) || {name: null, value: null};
            if (name && value && isRefAttributeName(name)) {
                rootElement.removeAttribute(name);
                result.push({
                    variableName: extractVariableName(value),
                    variable: {
                        type: VariableType.attributeRef,
                        indexes
                    }
                });
            }
        }
    }
    return result;
}


import {AttributeVariable, ChildVariable, VariableType} from "../component-registry";
import {ELEMENT_NODE, VariableNameTuple} from "./variable-types";
import {extractVariableName} from "./helpers";
import {hasSpecialAttributes} from "./find-special-attributes";

export function findChildVariables(rootElement: HTMLElement, indexes: number[]): VariableNameTuple<ChildVariable>[] {
    const result: VariableNameTuple<ChildVariable>[] = [];
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
            result.push({
                variableName: extractVariableName(textContent),
                variable: {type: VariableType.childVariable, indexes: newIndexes}
            });
        }
    }
    return result;
}

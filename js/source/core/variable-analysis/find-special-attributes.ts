import {getSpecialAttributeRegistry} from "./register-special-attribute";
import {VariableNameTuple} from "./variable-types";
import {SpecialAttributeVariable, VariableType} from "../component-registry";
import {extractVariableName} from "./helpers";

export function hasSpecialAttributes(rootElement: HTMLElement) {
    const specialAttributeRegistry = getSpecialAttributeRegistry();
    const result: VariableNameTuple<SpecialAttributeVariable>[] = [];

    const attributes = (rootElement as HTMLElement)?.attributes;
    const attributesLength = attributes?.length || 0;
    if (attributes && attributes?.length > 0) {
        for (let attIdx = 0; attIdx < attributesLength; ++attIdx) {
            const {name, value} = attributes.item(attIdx) || {name: null, value: null};
            if (name && value && specialAttributeRegistry[name]) {
                return true;
            }
        }
    }
    return false;
}

export function findSpecialAttributes(rootElement: HTMLElement, indexes: number[]): VariableNameTuple<SpecialAttributeVariable>[] {
    const specialAttributeRegistry = getSpecialAttributeRegistry();
    const result: VariableNameTuple<SpecialAttributeVariable>[] = [];

    const attributes = (rootElement as HTMLElement)?.attributes;
    const attributesLength = attributes?.length || 0;
    if (attributes && attributes?.length > 0) {
        for (let attIdx = 0; attIdx < attributesLength; ++attIdx) {
            const {name, value} = attributes.item(attIdx) || {name: null, value: null};
            if (name && value && specialAttributeRegistry[name]) {
                result.push({
                    variableName: extractVariableName(value),
                    variable: {
                        type: VariableType.specialAttribute,
                        indexes,
                        specialAttributeRegistration: specialAttributeRegistry[name]
                    }
                });
            }
        }
    }

    return result;
}
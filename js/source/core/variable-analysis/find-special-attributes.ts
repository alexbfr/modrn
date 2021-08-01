import {getSpecialAttributeRegistry} from "./register-special-attribute";
import {MappingType, SpecialAttributeVariable} from "../component-registry";
import {extractExpression} from "./helpers";

export function hasSpecialAttributes(rootElement: HTMLElement): boolean {
    const specialAttributeRegistry = getSpecialAttributeRegistry();

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

export function findSpecialAttributes(rootElement: HTMLElement, indexes: number[]): SpecialAttributeVariable[] {
    const specialAttributeRegistry = getSpecialAttributeRegistry();
    const result: SpecialAttributeVariable[] = [];

    const attributes = (rootElement as HTMLElement)?.attributes;
    const attributesLength = attributes?.length || 0;
    if (attributes && attributes?.length > 0) {
        for (let attIdx = 0; attIdx < attributesLength; ++attIdx) {
            const {name: fullName, value} = attributes.item(attIdx) || {name: null, value: null};
            const indexOfColon = (fullName || "").indexOf(":");
            const name = (indexOfColon >= 0) ? fullName?.substring(0, indexOfColon) : fullName;
            if (name && fullName && value && specialAttributeRegistry[name]) {
                const expression = extractExpression(value);
                result.push({
                    type: MappingType.specialAttribute,
                    indexes,
                    specialAttributeRegistration: specialAttributeRegistry[name],
                    expression,
                    attributeName: fullName,
                    hidden: specialAttributeRegistry[name].hidden
                });
            }
        }
    }

    return result;
}
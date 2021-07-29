import {getSpecialAttributeRegistry} from "./register-special-attribute";
import {ExpressionType, MappingType, SpecialAttributeVariable} from "../component-registry";
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
            const {name, value} = attributes.item(attIdx) || {name: null, value: null};
            if (name && value && specialAttributeRegistry[name]) {
                const expression = extractExpression(value);
                if (expression.expressionType === ExpressionType.ConstantExpression) {
                    throw new Error("Constant expression not allowed in special attribute");
                }
                result.push({
                    type: MappingType.specialAttribute,
                    indexes,
                    specialAttributeRegistration: specialAttributeRegistry[name],
                    expression,
                    hidden: false
                });
            }
        }
    }

    return result;
}
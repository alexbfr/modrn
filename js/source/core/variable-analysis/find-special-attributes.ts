/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {getSpecialAttributeRegistry} from "./register-special-attribute";
import {extractExpression} from "./extract-expression";
import {MappingType, SpecialAttributeVariable} from "../types/variables";

/**
 * Looks for special attributes, that is, attributes which have been registered as such
 * @see registerSpecialAttribute
 *
 * @param rootElement
 * @param indexes
 */
export function findSpecialAttributes(rootElement: Element, indexes: number[]): SpecialAttributeVariable[] {
    const specialAttributeRegistry = getSpecialAttributeRegistry();
    const result: SpecialAttributeVariable[] = [];

    const attributes = (rootElement as Element)?.attributes;
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

export function hasSpecialAttributes(rootElement: HTMLElement): boolean {
    const specialAttributeRegistry = getSpecialAttributeRegistry();

    const attributes = (rootElement as HTMLElement)?.attributes;
    const attributesLength = attributes?.length || 0;
    if (attributes && attributes?.length > 0) {
        for (let attIdx = 0; attIdx < attributesLength; ++attIdx) {
            const {name, value} = attributes.item(attIdx) || {name: null, value: null};
            // TODO: this will also skip decorating special attributes, which is unintended
            if (name && value && specialAttributeRegistry[name]) {
                return true;
            }
        }
    }
    return false;
}


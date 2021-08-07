/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {getSpecialAttributeRegistry} from "./register-special-attribute";
import {extractExpression} from "./extract-expression";
import {MappingType, SpecialAttributeVariable} from "../types/variables";
import {classifyAttribute, SpecialAttribute} from "./attribute-classifier";

/**
 * Looks for special attributes, that is, attributes which have been registered as such
 * @see registerSpecialAttribute
 *
 * @param rootElement
 * @param indexes
 */
export function findSpecialAttributes(rootElement: Element, indexes: number[]): SpecialAttributeVariable[] {
    const result: SpecialAttributeVariable[] = [];

    const attributes = (rootElement as Element)?.attributes;
    const attributesLength = attributes?.length || 0;
    if (attributes && attributes?.length > 0) {
        for (let attIdx = 0; attIdx < attributesLength; ++attIdx) {
            const {name: fullName, value} = attributes.item(attIdx) || {name: null, value: null};
            const classification = classifyAttribute(fullName) as SpecialAttribute;
            if (fullName && value && classification?.type === "special") {
                const expression = extractExpression(value);
                result.push({
                    type: MappingType.specialAttribute,
                    indexes,
                    specialAttributeRegistration: classification.registration,
                    expression,
                    attributeName: fullName,
                    hidden: classification.registration.hidden
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

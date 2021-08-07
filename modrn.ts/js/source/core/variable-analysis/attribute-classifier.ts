/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {SpecialAttributeRegistration} from "../types/variables";
import {getSpecialAttributeRegistry} from "./register-special-attribute";
import {variableNamePattern} from "./variable-types";

export interface AttributeClassification {
    type: "ref" | "standard" | "special" | "wildcard";
}

export interface RefAttribute extends AttributeClassification {
    type: "ref";
}

export interface StandardAttribute extends AttributeClassification {
    type: "standard";
    name: string;
}

export interface SpecialAttribute extends AttributeClassification {
    type: "special";
    name: string;
    fullName: string;
    registration: SpecialAttributeRegistration;
}

export interface WildcardAttribute extends AttributeClassification {
    type: "wildcard";
    variableName: string;
}

export function classifyAttribute(attributeName: string | null): AttributeClassification | undefined {
    if (!attributeName) {
        return undefined;
    }
    if (attributeName === "ref") {
        return {type: "ref"};
    } if (variableNamePattern.test(attributeName)) {
        return {type: "wildcard", variableName: attributeName} as WildcardAttribute;
    } else {
        const specialAttributeRegistry = getSpecialAttributeRegistry();
        const indexOfColon = (attributeName || "").indexOf(":");
        const name = (indexOfColon >= 0) ? attributeName?.substring(0, indexOfColon) : attributeName;
        const registration = specialAttributeRegistry[name];
        if (registration) {
            return {
                type: "special",
                name: name,
                fullName: attributeName,
                registration
            } as SpecialAttribute;
        } else {
            return {
                type: "standard",
                name
            } as StandardAttribute;
        }
    }
}
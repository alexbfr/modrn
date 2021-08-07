/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {nextId} from "../../util/next-id";
import {SpecialAttributeHandlerFn, SpecialAttributeRegistration} from "../types/variables";

export type SpecialAttributeRegistry = {
    [attributeName: string]: SpecialAttributeRegistration
};

const specialAttributeRegistry: SpecialAttributeRegistry = {};

export function registerSpecialAttribute(attributeName: string, handler: SpecialAttributeHandlerFn, precedence = 0): SpecialAttributeRegistration {
    return specialAttributeRegistry[attributeName] = {
        id: nextId(),
        precedence,
        attributeName,
        handler,
    };
}

export function getSpecialAttributeRegistry(): SpecialAttributeRegistry {
    return specialAttributeRegistry;
}

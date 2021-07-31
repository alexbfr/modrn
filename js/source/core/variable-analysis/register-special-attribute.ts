import {SpecialAttributeHandlerFn, SpecialAttributeRegistration} from "../component-registry";

export type SpecialAttributeRegistry = {
    [attributeName: string]: SpecialAttributeRegistration
};

const specialAttributeRegistry: SpecialAttributeRegistry = {};

export function registerSpecialAttribute(attributeName: string, handler: SpecialAttributeHandlerFn, precedence = 0): SpecialAttributeRegistration {
    return specialAttributeRegistry[attributeName] = {
        precedence,
        attributeName,
        handler,
    };
}

export function getSpecialAttributeRegistry(): SpecialAttributeRegistry {
    return specialAttributeRegistry;
}
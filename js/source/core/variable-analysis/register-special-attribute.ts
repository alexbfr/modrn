import {SpecialAttributeHandlerFn, SpecialAttributeRegistration} from "../component-registry";
import {nextId} from "../../util/next-id";

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
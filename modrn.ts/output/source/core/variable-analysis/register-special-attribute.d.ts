import { SpecialAttributeHandlerFn, SpecialAttributeRegistration } from "../types/variables";
export declare type SpecialAttributeRegistry = {
    [attributeName: string]: SpecialAttributeRegistration;
};
export declare function registerSpecialAttribute(attributeName: string, handler: SpecialAttributeHandlerFn, precedence?: number): SpecialAttributeRegistration;
export declare function getSpecialAttributeRegistry(): SpecialAttributeRegistry;

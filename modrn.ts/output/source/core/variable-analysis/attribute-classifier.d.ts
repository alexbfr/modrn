import { SpecialAttributeRegistration } from "../types/variables";
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
export declare function classifyAttribute(attributeName: string | null): AttributeClassification | undefined;

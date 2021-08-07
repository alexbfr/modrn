import { BaseExpression } from "./expression-types";
export declare enum MappingType {
    childVariable = 0,
    attribute = 1,
    attributeRef = 2,
    specialAttribute = 3
}
export declare type ValueTransformerFn = <T>(node: Node, value: T) => T;
export declare type VariableMappingBase<T extends MappingType> = {
    indexes: number[];
    type: T;
    expression: BaseExpression;
    valueTransformer?: ValueTransformerFn | SpecialAttributeValueTransformerFn;
};
export declare type VariableMapping = VariableMappingBase<MappingType>;
export declare type ChildVariable = VariableMappingBase<MappingType.childVariable>;
export declare type AttributeVariable = {
    attributeName: string;
    hidden?: boolean;
} & VariableMappingBase<MappingType.attribute>;
export declare type AttributeRefVariable = VariableMappingBase<MappingType.attributeRef>;
export declare type SpecialAttributeVariable = {
    specialAttributeRegistration: SpecialAttributeRegistration;
    attributeName: string;
    hidden?: boolean;
} & VariableMappingBase<MappingType.specialAttribute>;
export declare type VariablesByNodeIndex = {
    indexes: number[];
    mappings: {
        [variableName: string]: VariableMapping[];
        __constants: VariableMapping[];
    };
};
export declare type SpecialAttributeValueTransformerFn = (element: Element, valuesBySlot: Record<string, unknown>) => unknown;
export declare type SpecialAttributeHandlerFnResult = {
    transformedElement?: HTMLElement;
    valueTransformer?: SpecialAttributeValueTransformerFn;
    remapAttributeName?: (attributeNameProvided: string) => string;
};
export declare type SpecialAttributeHandlerFn = (elem: Element) => SpecialAttributeHandlerFnResult;
export declare type SpecialAttributeRegistration = {
    id: string;
    precedence: number;
    attributeName: string;
    handler: SpecialAttributeHandlerFn;
    hidden?: boolean;
};
export declare type VariableMappings = {
    all: {
        [variableName: string]: VariableMapping[];
        __constants: VariableMapping[];
    };
    sorted: VariablesByNodeIndex[];
};
export declare type FoundVariables = {
    variables: VariableMappings;
    newRootElement: Element;
};

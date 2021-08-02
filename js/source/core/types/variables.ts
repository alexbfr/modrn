/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {BaseExpression} from "./expression-types";

export enum MappingType {
    childVariable,
    attribute,
    attributeRef,
    specialAttribute
}

export type ValueTransformerFn = <T>(node: Node, value: T) => T;

export type VariableMappingBase<T extends MappingType> = {
    indexes: number[];
    type: T;
    expression: BaseExpression;
    valueTransformer?: ValueTransformerFn | SpecialAttributeValueTransformerFn;
}

export type VariableMapping = VariableMappingBase<MappingType>;

export type ChildVariable = VariableMappingBase<MappingType.childVariable>;

export type AttributeVariable = {
    attributeName: string;
    hidden?: boolean;
} & VariableMappingBase<MappingType.attribute>;

export type AttributeRefVariable = VariableMappingBase<MappingType.attributeRef>;

export type SpecialAttributeVariable = {
    specialAttributeRegistration: SpecialAttributeRegistration;
    attributeName: string;
    hidden?: boolean;
} & VariableMappingBase<MappingType.specialAttribute>;

export type VariablesByNodeIndex = {
    indexes: number[],
    mappings: {
        [variableName: string]: VariableMapping[],
        __constants: VariableMapping[]
    }
};

export type SpecialAttributeValueTransformerFn = (element: Element, valuesBySlot: Record<string, unknown>) => unknown;

export type SpecialAttributeHandlerFnResult = {
    transformedElement?: HTMLElement;
    valueTransformer?: SpecialAttributeValueTransformerFn;
    remapAttributeName?: (attributeNameProvided: string) => string;
}

export type SpecialAttributeHandlerFn = (elem: Element) => SpecialAttributeHandlerFnResult;

export type SpecialAttributeRegistration = {
    id: string;
    precedence: number;
    attributeName: string;
    handler: SpecialAttributeHandlerFn;
    hidden?: boolean;
}

export type VariableMappings = {
    all: {
        [variableName: string]: VariableMapping[],
        __constants: VariableMapping[]
    },
    sorted: VariablesByNodeIndex[];
};

export type FoundVariables = {
    variables: VariableMappings;
    newRootElement: Element;
};


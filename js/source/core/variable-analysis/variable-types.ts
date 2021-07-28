import {Variable} from "../component-registry";

export const ELEMENT_NODE = 1;
export const TEXT_NODE = 3;

export type VariableNameTuple<T extends Variable> = {
    variableName: string;
    variable: T;
}

export const variablePattern = new RegExp("{{[\\w\\d_-]+}}");


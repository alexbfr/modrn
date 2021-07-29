import {ExpressionType, MappingType, VariableUsageExpression} from "../../component-registry";
import {findChildVariables} from "../find-child-variables";

it("Returns empty list when no variables are used", () => {

    const elem = document.createElement("div");
    elem.innerHTML = "the lazy frog jumps over the fox";

    const result = findChildVariables(elem, []);

    expect(result).toEqual([]);
});

it("Returns empty list when no variables are used (2)", () => {

    const elem = document.createElement("div");
    elem.innerHTML = "<span>the lazy</span><span>dog jumps over</span><span>the fox</span>";

    const result = findChildVariables(elem, []);

    expect(result).toEqual([]);
});

it("Returns list with one element if nothing else is used and index 0", () => {

    const elem = document.createElement("div");
    elem.innerHTML = "{{variable}}";

    const result = findChildVariables(elem, []);

    expect(result).toEqual([{type: MappingType.childVariable, indexes: [0], expression: varUsageExpression("variable")}]);
});

it("Returns list with one element at index 2", () => {

    const elem = document.createElement("div");
    elem.innerHTML = "<span>the lazy</span><span>dog jumps over</span><span>{{variable}}</span><span>the fox</span>";

    const result = findChildVariables(elem, []);

    expect(result).toEqual([{type: MappingType.childVariable, indexes: [2], expression: varUsageExpression("variable")}]);
});

it("Returns list with two element for two occurrences", () => {

    const elem = document.createElement("div");
    elem.innerHTML = "<span>the lazy</span><span>dog jumps over</span><span>{{variable1}}</span><span>the fox</span><span>{{variable2}}</span>";

    const result = findChildVariables(elem, []);

    expect(result).toEqual([
        {type: MappingType.childVariable, indexes: [2], expression: varUsageExpression("variable1") },
        {type: MappingType.childVariable, indexes: [4], expression: varUsageExpression("variable2") },
    ]);
});

export function varUsageExpression(variable: string): VariableUsageExpression {
    return {
        expressionType: ExpressionType.VariableUsage,
        variableName: variable
    };
}


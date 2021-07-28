import {VariableType} from "../../component-registry";
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

    expect(result).toEqual([{variableName: "variable", variable: {type: VariableType.childVariable, indexes: [0]}}]);
});

it("Returns list with one element at index 2", () => {

    const elem = document.createElement("div");
    elem.innerHTML = "<span>the lazy</span><span>dog jumps over</span><span>{{variable}}</span><span>the fox</span>";

    const result = findChildVariables(elem, []);

    expect(result).toEqual([{variableName: "variable", variable: {type: VariableType.childVariable, indexes: [2]}}]);
});

it("Returns list with two element for two occurrences", () => {

    const elem = document.createElement("div");
    elem.innerHTML = "<span>the lazy</span><span>dog jumps over</span><span>{{variable1}}</span><span>the fox</span><span>{{variable2}}</span>";

    const result = findChildVariables(elem, []);

    expect(result).toEqual([
        {variableName: "variable1", variable: {type: VariableType.childVariable, indexes: [2]}},
        {variableName: "variable2", variable: {type: VariableType.childVariable, indexes: [4]}},
    ]);
});

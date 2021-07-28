import {VariableType} from "../../component-registry";
import {findAttributeVariables} from "../find-attribute-variables";

it("Returns empty list when no attributes exist", () => {

    const elem = document.createElement("div");
    elem.innerHTML = `<an-undefined-object-without-attributes></an-undefined-object-without-attributes>`;
    const elemToTest = elem.firstElementChild as HTMLElement;

    const result = findAttributeVariables(elemToTest, []);

    expect(result).toEqual([]);
});

it("Returns empty list when no variables are used in attributes", () => {

    const elem = document.createElement("div");
    elem.innerHTML = `<an-undefined-object att1="no-variable"></an-undefined-object>`;
    const elemToTest = elem.firstElementChild as HTMLElement;

    const result = findAttributeVariables(elemToTest, []);

    expect(result).toEqual([]);
});

it("Returns list when variable is used in attributes", () => {

    const elem = document.createElement("div");
    elem.innerHTML = `<an-undefined-object att1="{{variable}}"></an-undefined-object>`;
    const elemToTest = elem.firstElementChild as HTMLElement;

    const result = findAttributeVariables(elemToTest, []);

    expect(result).toEqual([{
        variableName: "variable",
        variable: {
            type: VariableType.attribute,
            attributeName: "att1",
            indexes: []
        }
    }]);
});

it("Finds onclick attribute", () => {
    const elem = document.createElement("div");
    elem.innerHTML = `<button onclick="{{variable}}"></button>`;
    const elemToTest = elem.firstElementChild as HTMLElement;

    const result = findAttributeVariables(elemToTest, []);

    expect(result).toEqual([{
        variableName: "variable",
        variable: {
            type: VariableType.attribute,
            attributeName: "onclick",
            indexes: []
        }
    }]);
});
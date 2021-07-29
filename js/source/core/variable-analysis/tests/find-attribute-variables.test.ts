import {MappingType} from "../../component-registry";
import {findAttributeVariables} from "../find-attribute-variables";
import {varUsageExpression} from "./find-child-variables.test";

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
        type: MappingType.attribute,
        attributeName: "att1",
        indexes: [],
        hidden: false,
        expression: varUsageExpression("variable")
    }]);
});

it("Finds onclick attribute variable", () => {
    const elem = document.createElement("div");
    elem.innerHTML = `<button onclick="{{variable}}"></button>`;
    const elemToTest = elem.firstElementChild as HTMLElement;

    const result = findAttributeVariables(elemToTest, []);

    expect(result).toEqual([{
        type: MappingType.attribute,
        attributeName: "onclick",
        indexes: [],
        hidden: false,
        expression: varUsageExpression("variable")
    }]);
});
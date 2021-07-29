import {MappingType} from "../../component-registry";
import {findAttributeRefVariables} from "../find-attribute-ref-variables";
import {varUsageExpression} from "./find-child-variables.test";

it("Returns empty list when no refs exist", () => {

    const elem = document.createElement("div");
    elem.innerHTML = `<an-undefined-object-without-attributes></an-undefined-object-without-attributes>`;
    const elemToTest = elem.firstElementChild as HTMLElement;

    const result = findAttributeRefVariables(elemToTest, []);

    expect(result).toEqual([]);
});

it("Returns empty list when no refs are used in attributes", () => {

    const elem = document.createElement("div");
    elem.innerHTML = `<an-undefined-object att1="no-variable"></an-undefined-object>`;
    const elemToTest = elem.firstElementChild as HTMLElement;

    const result = findAttributeRefVariables(elemToTest, []);

    expect(result).toEqual([]);
});

it("Returns empty list when no variables are used but no ref variables in attributes", () => {

    const elem = document.createElement("div");
    elem.innerHTML = `<an-undefined-object att1="{{variable}}"></an-undefined-object>`;
    const elemToTest = elem.firstElementChild as HTMLElement;

    const result = findAttributeRefVariables(elemToTest, []);

    expect(result).toEqual([]);
});

it("Returns list when ref is used in attributes", () => {

    const elem = document.createElement("div");
    elem.innerHTML = `<an-undefined-object ref="{{variable}}"></an-undefined-object>`;
    const elemToTest = elem.firstElementChild as HTMLElement;

    const result = findAttributeRefVariables(elemToTest, []);

    expect(result).toEqual([{
        type: MappingType.attributeRef,
        indexes: [],
        expression: varUsageExpression("variable")
    }]);
});

import {findVariables} from "../find-variables";
import {AttributeVariable, MappingType, VariableMappings} from "../../component-registry";
import {varUsageExpression} from "./find-child-variables.test";

it("Finds single child variable", () => {
    const elem = document.createElement("div");
    elem.innerHTML = "<div>{{test}}</div>";

    const actual = findVariables(elem);

    expect(actual.variables).toEqual({
        "test": [
            {
                type: MappingType.childVariable,
                indexes: [0],
                expression: varUsageExpression("test")
            }
        ],
        __constants: []
    } as VariableMappings);

    expect(elem.innerHTML).toBe("<div></div>");
    expect(elem.childNodes.length).toBe(1);
});

it("Finds single child variable and splits prologue", () => {
    const elem = document.createElement("div");
    elem.innerHTML = "<div>prologue {{test}}</div>";

    const actual = findVariables(elem);

    expect(actual.variables).toEqual({
        "test": [
            {
                type: MappingType.childVariable,
                indexes: [0, 1],
                expression: varUsageExpression("test")
            }
        ],
        __constants: []
    } as VariableMappings);

    expect(elem.innerHTML).toBe("<div>prologue </div>");
    expect(elem.childNodes.length).toBe(1);
});

it("Finds onclick attribute", () => {
    const elem = document.createElement("div");
    elem.innerHTML = "<div>Foo bar <button onclick='{{clicked}}'>Button</button></div>";

    const actual = findVariables(elem);

    expect(actual.variables).toEqual({
        "clicked": [
            {
                type: MappingType.attribute,
                attributeName: "onclick",
                indexes: [0, 1],
                hidden: false,
                expression: varUsageExpression("clicked")
            } as AttributeVariable
        ],
        __constants: []
    } as VariableMappings);

    expect(elem.innerHTML).toBe(`<div>Foo bar <button onclick="">Button</button></div>`);
    expect(elem.firstElementChild?.childNodes.length).toBe(2);
});

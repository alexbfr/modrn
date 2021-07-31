import {splitTextContentAtVariables} from "../split-text-content-at-variables";

it("leaves a plain replacement as-is", () => {
    const elem = document.createElement("div");
    elem.innerHTML = "{{full}}";
    splitTextContentAtVariables(elem);

    expect(elem.innerHTML).toBe("{{full}}");
});

it("Trims spaces before", () => {
    const elem = document.createElement("div");
    elem.innerHTML = "     {{full}}";
    splitTextContentAtVariables(elem);

    expect(elem.innerHTML).toBe("{{full}}");
});

it("Trims spaces after", () => {
    const elem = document.createElement("div");
    elem.innerHTML = "{{full}}     ";
    splitTextContentAtVariables(elem);

    expect(elem.innerHTML).toBe("{{full}}");
});

it("Splits part before", () => {
    const elem = document.createElement("div");
    elem.innerHTML = "ABC{{full}}";

    expect(elem.childNodes.length).toBe(1);
    splitTextContentAtVariables(elem);
    expect(elem.innerHTML).toBe("ABC{{full}}");
    expect(elem.childNodes.length).toBe(2);
});

it("Splits part after", () => {
    const elem = document.createElement("div");
    elem.innerHTML = "{{full}}ABC";

    expect(elem.childNodes.length).toBe(1);
    splitTextContentAtVariables(elem);
    expect(elem.innerHTML).toBe("{{full}}ABC");
    expect(elem.childNodes.length).toBe(2);
});

it("Splits parts before and after", () => {
    const elem = document.createElement("div");
    elem.innerHTML = "ABC{{full}}DEF";

    expect(elem.childNodes.length).toBe(1);
    splitTextContentAtVariables(elem);
    expect(elem.innerHTML).toBe("ABC{{full}}DEF");
    expect(elem.childNodes.length).toBe(3);
});

it("Splits multiple times", () => {
    const elem = document.createElement("div");
    elem.innerHTML = "{{first}}{{second}}";

    expect(elem.childNodes.length).toBe(1);
    splitTextContentAtVariables(elem);
    expect(elem.innerHTML).toBe("{{first}}{{second}}");
    expect(elem.childNodes.length).toBe(2);
});


it("Does not trim in the middle", () => {
    const elem = document.createElement("div");
    elem.innerHTML = "  {{first}}  {{second}}  ";

    expect(elem.childNodes.length).toBe(1);
    splitTextContentAtVariables(elem);
    expect(elem.innerHTML).toBe("{{first}}  {{second}}");
    expect(elem.childNodes.length).toBe(3);
});

it("Ignores sub-elements", () => {
    const elem = document.createElement("div");
    elem.innerHTML = "<div>{{test}}</div>";

    expect(elem.childNodes.length).toBe(1);
    splitTextContentAtVariables(elem);
    expect(elem.innerHTML).toBe("<div>{{test}}</div>");
    expect(elem.childNodes.length).toBe(1);
});
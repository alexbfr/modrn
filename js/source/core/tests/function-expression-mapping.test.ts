import {clearRenderQueue} from "../render-queue";
import {makeComponent, NoProps} from "../component-declaration";
import {registerAnonymous} from "./anon";
import {TestUtils} from "../../test-utils/test-utils";

beforeEach(() => clearRenderQueue());

it("Correctly renders constant numerical expression", async () => {

    let result = 0;
    const component1 = makeComponent(NoProps, () => ({dummy: (number: number) => result = number})).html("<span id='test' onclick='{{&dummy(123)}}'></span>").register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;
    expect(result).toBe(0);

    const span = document.getElementById("test") as HTMLSpanElement;
    expect(span.onclick).toBeDefined();
    expect(typeof span.onclick).toBe("function");
    span.onclick && span.onclick({} as MouseEvent);
    expect(result).toBe(123);
});

it("Correctly renders a lambda expression with one parameter without parentheses", async () => {

    let result = 0;
    const component1 = makeComponent(NoProps, () => ({dummy: (number: number) => result = number}))
        .html("<span id='test' onclick='{{num => dummy(num)}}'></span>").register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;
    expect(result).toBe(0);

    const span = document.getElementById("test") as HTMLSpanElement;
    expect(span.onclick).toBeDefined();
    expect(typeof span.onclick).toBe("function");
    span.onclick && (span.onclick as any)(234);
    expect(result).toBe(234);
});

it("Correctly renders a lambda expression with one parameter in parentheses", async () => {

    let result = 0;
    const component1 = makeComponent(NoProps, () => ({dummy: (number: number) => result = number}))
        .html("<span id='test' onclick='{{(num) => dummy(num)}}'></span>").register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;
    expect(result).toBe(0);

    const span = document.getElementById("test") as HTMLSpanElement;
    expect(span.onclick).toBeDefined();
    expect(typeof span.onclick).toBe("function");
    span.onclick && (span.onclick as any)(234);
    expect(result).toBe(234);
});

it("Correctly renders a lambda expression with two parameters", async () => {

    let result = 0;
    const component1 = makeComponent(NoProps, () => ({dummy: (number: number) => result = number}))
        .html("<span id='test' onclick='{{(evt, num) => dummy(num)}}'></span>").register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;
    expect(result).toBe(0);

    const span = document.getElementById("test") as HTMLSpanElement;
    expect(span.onclick).toBeDefined();
    expect(typeof span.onclick).toBe("function");
    span.onclick && (span.onclick as any)({}, 234);
    expect(result).toBe(234);
});

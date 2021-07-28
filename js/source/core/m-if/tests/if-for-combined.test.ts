import {makeComponent, NoProps} from "../../component-declaration";
import {registerAnonymous} from "../../tests/anon";
import {TestUtils} from "../../../test-utils/test-utils";
import {getRenderQueueLength, renderElements, requestRender} from "../../render-queue";
import {ModrnHTMLElement} from "../../component-registry";

it("Renders a simple for loop with true if condition", async () => {

    const ifCondition = true;
    const values = ["foo", "bar", "baz", "quux"];
    const component1 = makeComponent(NoProps, () => ({values, ifCondition})).html(`<span m-if="{{ifCondition}}" m-for="{{values}}">{{item}}</span>`).register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("foo");
});

it("Renders a simple for loop with false if condition", async () => {

    const ifCondition = false;
    const values = ["foo", "bar", "baz", "quux"];
    const component1 = makeComponent(NoProps, () => ({values, ifCondition})).html(`<span m-if="{{ifCondition}}" m-for="{{values}}">{{item}}</span>`).register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    console.error(container.innerHTML + "");
    expect(container.innerHTML).not.toContain("foo");
});

it("Renders a simple for loop with false if condition changing to true", async () => {

    let ifCondition = false;
    const values = ["foo", "bar", "baz", "quux"];
    const component1 = makeComponent(NoProps, () => {
        return ({values, ifCondition});
    }).html(`<div m-if="{{ifCondition}}" m-for="{{values}}">{{item}}</div>`).register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen(`id="root"`)}${tag1.tagClose}<p>Epilogue</p>`;
    const rootElem = document.getElementById("root") as ModrnHTMLElement;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).not.toContain("foo");

    ifCondition = true;
    requestRender(rootElem);
    renderElements();
    expect(getRenderQueueLength()).toBe(0);

    console.error(container.innerHTML + "");
    expect(container.innerHTML).toContain("foo");
});



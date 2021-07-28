import {clearRenderQueue, getRenderQueueLength, renderElements} from "../../render-queue";
import {makeComponent, NoProps} from "../../component-declaration";
import {registerAnonymous} from "../../tests/anon";
import {TestUtils} from "../../../test-utils/test-utils";
import {createRef, Ref, useRef} from "../../ref-hooks";

beforeEach(clearRenderQueue);

it("Renders a simple for loop", async () => {

    const values = ["foo", "bar", "baz", "quux"];
    const component1 = makeComponent(NoProps, () => ({values})).html(`<span m-for="{{values}}">{{item}}</span>`).register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("foo");
});

it("Renders a for loop with other outer props", async () => {

    const values = ["foo", "bar", "baz", "quux"];
    const component1 = makeComponent(NoProps, () => ({values, text: "hello world"})).html(`<span m-for="{{values}}">{{text}}{{item}}</span>`).register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();

    values.forEach(value => expect(container.innerHTML).toContain(`hello world${value}</span>`));
});

it("Renders a for loop with other outer ref prop", async () => {

    const values = ["foo", "bar", "baz", "quux"];
    let refs: Ref = [];

    const myRefState = createRef();
    const component1 = makeComponent(NoProps, () => {
        const myRef = useRef(myRefState);
        refs = myRef;
        return ({values, myRef});
    }).html(`<span m-for="{{values}}" ref="{{myRef}}">{{item}}</span>`).register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();

    values.forEach(value => expect(container.innerHTML).toContain(`>${value}</span>`));
    expect(getRenderQueueLength()).toBe(4);
    expect(refs.length).toEqual(0);

    renderElements();
    expect(getRenderQueueLength()).toBe(0);
    expect(refs.length).toEqual(4);
});

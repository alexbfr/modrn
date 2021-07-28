import {clearRenderQueue} from "../../render-queue";
import {makeComponent, NoProps} from "../../component-declaration";
import {registerAnonymous} from "../../tests/anon";
import {TestUtils} from "../../../test-utils/test-utils";

beforeEach(clearRenderQueue);

it("Renders a simple true if condition", async () => {

    const value = true;
    const component1 = makeComponent(NoProps, () => ({value})).html(`<span m-if="{{value}}">Hello world</span>`).register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).toContain("Hello world");
});

it("Renders a simple false if condition", async () => {

    const value = false;
    const component1 = makeComponent(NoProps, () => ({value})).html(`<span m-if="{{value}}">Hello world</span>`).register();
    const tag1 = registerAnonymous(component1);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).not.toContain("Hello world");
});



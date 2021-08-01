import {clearRenderQueue} from "../../core/render-queue";
import {makeComponent, NoProps} from "../../core/component-declaration";
import {registerAnonymous} from "../../core/tests/anon";
import {TestUtils} from "../../test-utils/test-utils";
import {nextId} from "../../util/next-id";

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

it("Works recursively", async () => {

    const value = false;

    const anonymousName = ("tag" + nextId());
    const component1 = makeComponent(NoProps, () => ({value})).html(`<${anonymousName} m-if="{{value}}">Hello world</${anonymousName}>`).register();
    const tag1 = registerAnonymous(component1, anonymousName);

    const container = await TestUtils.render("div") as HTMLElement;
    container.innerHTML = `<p>Prologue</p>${tag1.tagOpen()}${tag1.tagClose}<p>Epilogue</p>`;

    expect(container.innerHTML.startsWith(`<p>Prologue</p>`)).toBeTrue();
    expect(container.innerHTML.endsWith(`<p>Epilogue</p>`)).toBeTrue();
    expect(container.innerHTML).not.toContain("Hello world");
});

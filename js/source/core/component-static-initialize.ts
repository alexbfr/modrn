import {RegisteredComponent} from "./component-declaration";
import {tagify} from "../util/tagify";
import {Fragment, setStaticInitializationResultForComponent} from "./component-registry";
import {logDiagnostic} from "../util/logging";
import {findVariables} from "./variable-analysis/find-variables";
import {cloneDeep} from "../util/cloneDeep";

export function analyzeToFragment(rootElement: HTMLElement): Fragment {
    const variables = findVariables(rootElement);
    const childElement = cloneDeep(rootElement);

    return {childElement, variableDefinitions: variables.variables};
}

export function componentStaticInitialize(componentName: string, component: RegisteredComponent<unknown, unknown>): void {

    logDiagnostic(`Statically initializing ${componentName}`);
    const tagName = tagify(componentName);
    if (component.svgTemplate) {
        debugger;
    }
    const rootElement = document.createElement("div", {is: tagName});

    rootElement.style.display = "contents";
    rootElement.innerHTML = component.htmlTemplate || component.svgTemplate || "";

    const fragment = analyzeToFragment(rootElement);
    logDiagnostic(`Element ${componentName} analyzed to`, fragment.variableDefinitions);
    setStaticInitializationResultForComponent(componentName, fragment);
}
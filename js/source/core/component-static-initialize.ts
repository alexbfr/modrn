import {RegisteredComponent} from "./component-declaration";
import {tagify} from "../util/tagify";
import {
    Fragment,
    PotentiallyModifiedRootElement,
    setStaticInitializationResultForComponent
} from "./component-registry";
import {logDiagnostic} from "../util/logging";
import {findVariables} from "./variable-analysis/find-variables";
import {cloneDeep} from "../util/cloneDeep";

export type FragmentAnalysisResult = {
    fragment: Fragment;
} & PotentiallyModifiedRootElement;

export function analyzeToFragment(rootElement: HTMLElement): FragmentAnalysisResult {
    const variables = findVariables(rootElement);
    const childElement = cloneDeep(rootElement);

    return {
        potentiallyModifiedRootElement: variables.potentiallyModifiedRootElement,
        fragment: {childElement, variableDefinitions: variables.variables}
    };
}

export function componentStaticInitialize(componentName: string, component: RegisteredComponent<unknown, unknown>): void {

    logDiagnostic(`Statically initializing ${componentName}`);
    const tagName = tagify(componentName);
    const rootElement = document.createElement("div", {is: tagName});

    rootElement.style.display = "contents";
    rootElement.innerHTML = component.htmlTemplate;

    const fragment = analyzeToFragment(rootElement).fragment;
    logDiagnostic(`Element ${componentName} analyzed to`, fragment.variableDefinitions);
    setStaticInitializationResultForComponent(componentName, fragment);
}
import {ModrnHTMLElement} from "../core/component-registry";

function copyDeep(current: HTMLElement, currentRoot: HTMLElement) {
    let pivotRoot = currentRoot;
    let pivot = current;
    while (pivot && pivotRoot) {
        const current = pivot;
        const currentRoot = pivotRoot;
        pivot = pivot.nextElementSibling as HTMLElement;
        pivotRoot = pivotRoot.nextElementSibling as HTMLElement;
        if (current instanceof ModrnHTMLElement) {
            (currentRoot as ModrnHTMLElement).copyTo(current);
        } else if (current.firstElementChild && currentRoot.firstElementChild) {
            copyDeep(current.firstElementChild as HTMLElement, currentRoot.firstElementChild as HTMLElement);
        }
    }
}

export function cloneDeep(root: HTMLElement): HTMLElement {

    const result = root.cloneNode(true) as HTMLElement;
    copyDeep(result, root);
    return result;
}
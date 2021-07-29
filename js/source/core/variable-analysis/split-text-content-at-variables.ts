import {expressionPattern, TEXT_NODE} from "./variable-types";

export function splitTextContentAtVariables(rootElement: HTMLElement): void {
    let childCount = rootElement.childNodes.length;
    for (let idx = 0; idx < childCount; ++idx) {
        const child = rootElement.childNodes.item(idx);
        let startIndex: number;
        const textContent = child.textContent?.trim();
        if (child.nodeType === TEXT_NODE && textContent && (startIndex = textContent.indexOf("{{")) >= 0) {
            const endIndex = textContent.indexOf("}}", startIndex + 2);
            if (startIndex === 0 && endIndex === textContent.length - 2) {
                child.textContent = textContent;
                continue;
            }
            if (endIndex >= 0) {
                const remainderBefore = textContent.substring(0, startIndex);
                const value = textContent.substring(startIndex, endIndex + 2);
                if (!expressionPattern.test(value)) {
                    console.warn(`Invalid expression pattern ${value} at element ${rootElement}`);
                    continue;
                }
                const remainderAfter = textContent.substring(endIndex + 2);
                if (remainderBefore.length > 0) {
                    const nextNode = document.createTextNode(remainderBefore);
                    rootElement.insertBefore(nextNode, child);
                    childCount++;
                    idx++;
                }
                if (remainderAfter.length > 0) {
                    const nextNode1 = document.createTextNode(remainderAfter);
                    rootElement.insertBefore(nextNode1, child.nextSibling);
                    childCount++;
                    idx++;
                }
                child.textContent = value;
            }
        }
    }
}


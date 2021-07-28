export function childNodesToArray(element: HTMLElement): ChildNode[] {
    const result: ChildNode[] = [];
    const length = element.childNodes.length;
    for (let idx = 0; idx < length; ++idx) {
        result.push(element.childNodes.item(idx));
    }
    return result;
}
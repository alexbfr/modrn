export function watchAll(node: HTMLElement, handler: (root: HTMLElement, node: HTMLElement, mutations: MutationRecord[]) => void): MutationObserver[] {

    const observers: MutationObserver[] = [];

    function iterate(current: HTMLElement) {
        const observer = new MutationObserver(mutations => handler(node, current, mutations));
        observers.push(observer);
        const length = current.childElementCount;
        for (let idx = 0; idx < length; ++idx) {
            iterate(current.children.item(idx) as HTMLElement);
        }
    }

    iterate(node);

    return observers;
}
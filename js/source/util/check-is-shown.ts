export function checkIsShown(
    firstElementChild: Element | null): boolean {

    let elem = firstElementChild as HTMLElement;
    while (elem?.style.display === "contents") {
        elem = elem.firstElementChild as HTMLElement;
        if (!elem) {
            return false;
        }
    }

    return elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
}

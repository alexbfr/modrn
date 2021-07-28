export type UnsafeHtml = { unsafeHtml: string };

export function unsafeHtml(text?: string): UnsafeHtml | undefined {
    return text ? { unsafeHtml: text } : undefined;
}
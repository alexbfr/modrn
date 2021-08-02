/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

export type UnsafeHtml = { unsafeHtml: string };

export function unsafeHtml(text?: string): UnsafeHtml | undefined {
    return text ? { unsafeHtml: text } : undefined;
}
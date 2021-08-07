/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

export function nextId(): string {
    const rnd = Math.floor(Math.random() * 1000000);
    const date = new Date();
    return `${rnd}-${date.getDate()}`;
}

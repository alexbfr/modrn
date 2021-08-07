/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

export const ELEMENT_NODE = 1;
export const TEXT_NODE = 3;

export const expressionPattern = new RegExp("{{.+?}}");
export const variableNamePattern = new RegExp("{{\\s*?[^\\d][\\w\\d_-]+\\s*?}}");


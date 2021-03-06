/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import "./source/modrn";

export * from "./source/core/change-detection/has-changed";
export * from "./source/core/change-tracking/mark-changed";

export * from "./source/core/hooks/change-hooks";
export * from "./source/core/hooks/disconnect-hook";
export * from "./source/core/hooks/event-hooks";
export * from "./source/core/hooks/ref-hooks";
export * from "./source/core/hooks/state-hooks";
export * from "./source/core/hooks/localstorage-backed-state-hooks";
export * from "./source/core/hooks/templated-children-hooks";

export * from "./source/core/types/component-builder";
export * from "./source/core/types/component-registry";
export * from "./source/core/types/expression-types";
export * from "./source/core/types/modrn-html-element";
export * from "./source/core/types/prop-types";
export * from "./source/core/types/registered-component";
export * from "./source/core/types/render-queue";
export * from "./source/core/types/variables";

export * from "./source/core/variable-analysis/analyze-to-fragment";

export {substituteVariables, varsWithOptions} from "./source/core/variable-substition/substitute-variables";

export * from "./source/core/component-declaration";
export * from "./source/core/component-registry";
export * from "./source/core/component-state";
export * from "./source/core/component-static-initialize";
export * from "./source/core/modrn-base";

export * from "./source/util/state";
export * from "./source/util/immodify";
export * from "./source/util/cloneDeep";
export * from "./source/util/logging";

export {modrn} from "./source/modrn";
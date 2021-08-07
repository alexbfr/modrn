/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import {terser} from "rollup-plugin-terser";

export default {
    input: "js/index.ts",
    output: [
        { file: "output/modrn.js", format: "cjs" },
        { file: "output/modrn.min.js", format: "cjs", plugins: [terser()] },
        { file: "output/modrn.esm.js", format: "esm" },
    ],
    plugins: [typescript({ tsconfig: "./tsconfig.json" })],
    external: [
        "date-fns/format",
        "date-fns/isDate",
        "date-fns/parseISO",
        "date-fns/formatISO",
    ]
};
/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {declare, makeComponent} from "../js/source/core/component-declaration";
import {createState} from "../js/source/util/state";
import {useState} from "../js/source/core/hooks/state-hooks";
import {unsafeHtml} from "../js/source/core/variable-substition/unsafe-html";
import {NoProps} from "../js/source/core/types/registered-component";

const textState = createState<string>();

const markdownComponent = makeComponent(NoProps, () => {

    const marked = (window as any).marked; // eslint-disable-line @typescript-eslint/no-explicit-any
    const [text, setText] = useState(textState, "");

    return {
        textChanged: (evt: InputEvent) => setText((evt.target as HTMLTextAreaElement).value),
        markdown: unsafeHtml(marked(text, {sanitize: true}))
    };

}).html(`
<div id="editor">
    <textarea oninput="{{textChanged}}"></textarea>
    <div>{{markdown}}</div>
</div>
`).register();

export const markdownModule = declare({markdownComponent});
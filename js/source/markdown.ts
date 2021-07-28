import {declare, makeComponent, NoProps} from "./core/component-declaration";
import marked from "marked";
import {createState} from "./util/state";
import {useState} from "./core/state-hooks";
import {unsafeHtml} from "./core/variable-substition/unsafe-html";

const textState = createState<string>();

const markdownComponent = makeComponent(NoProps, () => {

    const [text, setText] = useState(textState, "");

    return {
        textChanged: (evt: InputEvent) => setText((evt.target as HTMLTextAreaElement).value),
        markdown: unsafeHtml(marked(text, {sanitize: true}))
    };

}).html(`
<textarea oninput="{{textChanged}}"></textarea>
<div>{{markdown}}</div>
`).register();

export const markdownModule = declare({markdownComponent});
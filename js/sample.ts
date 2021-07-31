import {declare, m, makeComponent, mBool, mString} from "./source/core/component-declaration";
import {createState} from "./source/util/state";
import {useState} from "./source/core/state-hooks";

const propsType = m({
    lesbian: mBool(),
    name: mString(),
    thelma: m({
        ugly: mBool(),
        city: mString()
    })
});

const myComponent1State = createState<number>();

const myComponent = makeComponent(propsType, () => {
    const [state] = useState(myComponent1State, 123);
    function spammy() {
        const [state, setState] = useState(myComponent1State, 123);
        setState(state + 1);
    }
    return {state, spammy};
}).html(`<div id="fluff">
    Thelma!<my-component2 name="BIHATCH"></my-component2>Louise! {{state}}
    <button onclick="{{spammy}}">Barnarne {{state}}</button>
</div>`).register();

const myComponent2 = makeComponent(propsType, props => {
    console.log("2", JSON.stringify(props, null, 2));
    return {state: props.thelma};
}).html(`<div>Larber!</div>`).register();

export const myComponentModule = declare({myComponent, myComponent2});

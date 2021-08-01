import {declare, m, makeComponent, mArray, mNumber, mObj, mString, NoProps} from "./source/core/component-declaration";
import {createState} from "./source/util/state";
import {purify, useState} from "./source/core/state-hooks";
import {
    createChildrenState,
    createTemplatedChildrenState,
    useModrnChild, useModrnChildren,
    useTemplatedChildren
} from "./source/core/templated-children-hooks";

type Stat = {label: string, value: number};

const polygraphProps = m({
    data: mArray<Stat>()
});

function valueToPoint(value: number, index: number, total: number) {
    const x = 0;
    const y = -value * 0.8;
    const angle = ((Math.PI * 2) / total) * index;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const tx = x * cos - y * sin + 100;
    const ty = x * sin + y * cos + 100;
    return {
        x: tx,
        y: ty
    };
}

const axisLabelProps = m({
    point: m( {
        x: mNumber(),
        y: mNumber()
    }),
    label: mString()
});
const axisLabelComponent = makeComponent(axisLabelProps)
    .html(`
      <text :x="{{point.x}}" :y="{{point.y}}">{{stat.label}}</text>
    `)
    .register();

const axisLabelChildren = createChildrenState();
const polygraphComponent = makeComponent(polygraphProps, ({data: stats}) => {

    const axisLabelInfo = stats.map((stat, index) => ({point: valueToPoint(stat.value, index, stats.length), label: stat.label}));
    const axisLabels = useModrnChildren(axisLabelChildren, axisLabelComponent, axisLabelInfo);

    const total = stats.length;
    const points = stats
        .map((stat, i) => {
            const point = valueToPoint(stat.value, i, total);
            return `${point.x},${point.y}`;
        }).join(" ");
    return {stats, total, points, axisLabels};
})
    .html(`<svg>
  <g>
    <polygon :points="{{points}}"></polygon>
    <circle cx="100" cy="100" r="80"></circle>
    <g>{{axisLabels}}</g>
<!--    <axis-label-->
<!--      m-for="{{stats}}" m-as="stat" m-index-as="index"-->
<!--      :stat="{{stat}}"-->
<!--      :index="{{index}}}}"-->
<!--      :total="{{stats.length}}">-->
<!--    </axis-label>-->
  </g></svg>
`)
    .register();

const stats = {
    data: [
        {label: "A", value: 100},
        {label: "B", value: 100},
        {label: "C", value: 100},
        {label: "D", value: 100},
        {label: "E", value: 100},
        {label: "F", value: 100}
    ]
};

const polygraphDemoState = createState<typeof stats>();
const polygraphDemo = makeComponent(NoProps, () => {

    const [state, setState] = useState(polygraphDemoState, stats);

    const changeStat = purify(polygraphDemoState, (state, stat: Stat, value: string) => {
        const newData = [...state.data];
        const index = newData.findIndex(dp => dp === stat);
        if (index >= 0) {
            newData[index].value = Number.parseFloat(value);
            return {data: newData};
        }
    });

    return {stats: state.data, changeStat};
})
    .html(`
     <!-- controls -->
      <polygraph-component data="{{stats}}"></polygraph-component>
      <div m-for="{{stats}}" m-as="stat">
        <label>{{stat.label}}</label>
        <input type="range" value="{{stat.value}}" m-input="{{newRange => changeStat(stat, newRange)}}" min="0" max="100" />
        <span>{{stat.value}}</span>
        <button @click="remove(stat)" class="remove">X</button>
      </div>
      <form id="add">
        <input name="newlabel" v-model="newLabel" />
        <button @click="add">Add a Stat</button>
      </form>
      <pre id="raw">{{ stats }}</pre>
`)
    .register();

export const polygraphModule = declare({polygraphDemo, polygraphComponent, axisLabelComponent});
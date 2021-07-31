import "./sample";
import {start} from "./source/core/modrn";
import {myComponentModule} from "./sample";
import {markdownModule} from "./markdown";
import {treeViewModule} from "./treeview";
import {elasticHeaderModule} from "./elastic-header";
import {githubCommitsModule} from "./github-commits";
import {todoMvcModule} from "./todo-mvc";

start(myComponentModule, markdownModule, treeViewModule, elasticHeaderModule, githubCommitsModule, todoMvcModule);


// window.setInterval(() => {
//        const elem = document.getElementById("stats");
//     if (elem) {
//         elem.innerText = getRenderDiagnostics().sequence.join("\n");
//     }
// }, 1000);



// interface MainContentState {
//     counter: number;
//     numbers: number[];
//     show: boolean;
//     text: string;
//     falaffel?: {
//         bulba: string;
//         data: string;
//     }
// }
//
// const mainContentState = createState<MainContentState>();
//
// window.setInterval(() => {
//     const elem = document.getElementById("stats");
//     if (elem) {
//         elem.innerText = JSON.stringify(getRenderDiagnostics(), null, 2);
//     }
// }, 1000);
//
// function MainContent(props: void, {purify, useState}: Context) {
//
//     const [state] = useState(mainContentState, {
//         counter: 123,
//         numbers: [1, 2, 3, 4],
//         show: true,
//         text: "wurb"
//     });
//
//     const addNumbers = purify(mainContentState, (state) => {
//         return {counter: state.counter + 1, numbers: [...state.numbers, state.counter]};
//     });
//
//     const toggle = purify(mainContentState, state => ({show: !state.show}));
//
//     const mutate = purify(mainContentState, state => {
//         const newNumbers = state.numbers;
//         newNumbers[(new Date().getMilliseconds()) % newNumbers.length]++;
//         return {numbers: newNumbers};
//     });
//
//     const onTextChanged = purify(mainContentState, (state, newText: string) => {
//         return {text: newText};
//     });
//
//     const clear = purify(mainContentState, () => ({numbers: []}));
//
//     return {
//         counter: state.counter,
//         clicked: addNumbers,
//         numbers: state.numbers,
//         mutate,
//         clear,
//         show: state.show,
//         toggle,
//         text: state.text,
//         onTextChanged
//     };
// }
//
// const style = createStyles({
//     "large": {
//         fontSize: "20px",
//         fontWeight: "bold"
//     }
// });
//
// define({
//
//     ChitChat: tag().withHtml(`<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
//   <div class="flex-shrink-0">
//     <img class="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo">
//   </div>
//   <div>
//     <div class="text-xl font-medium text-black">ChitChat</div>
//     <p class="text-gray-500">You have a new message!</p>
//     <div>{{slot}}</div>dsadsdas
//     <div>{{slot}}</div>
//   </div>
// </div>`),
//
//     MainContent: tag(MainContent)
//         .withHtml(`<div class="mui-container"><div class="mui-panel">
//     <span>Hello world<b onclick="{{clicked}}">{{counter}}</b></span>
//     <chit-chat>Berni Banani</chit-chat>
//     <modrn-if true="{{show}}" numbers="{{numbers}}" counter="{{counter}}" mutate="{{mutate}}" clear="{{clear}}">
//         <modrn-for of="{{numbers}}" as="counterX" counter2="{{counter}}" counter="{{counter}}">
//             <div><span>{{counterX}}</span> - <b>{{counter2}}</b> - <b>{{counter}}</b></div>
//         </modrn-for>
//         <button onclick="{{mutate}}">Mutate!</button>
//         <button onclick="{{clear}}">Clear!</button>
//     </modrn-if>
//     <div style="display: block">
//     <search-filter-input placeholder="Search stuff now" onValueChanged="{{onTextChanged}}"></search-filter-input>
//     </div>
//     <pill-button onClick="{{toggle}}" class="large">Toggle!</pill-button>
//     <modrn-input type="text" value="{{text}}" onValueChanged="{{onTextChanged}}"></modrn-input>
//     <span>{{text}}</span>
// </div>
//     <pre id="stats" style="width:100%; font-size: 9px"></pre>
// </div>`)
//         .withStyles(style)
// });

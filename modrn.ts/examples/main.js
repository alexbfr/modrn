import {modrnElement} from "./source/core/decorators";
import {fuckOffer} from "modrn/jsx-runtime";

fuckOffer();
modrnElement();
// window.setInterval(() => {
//     const elem = document.getElementById("stats");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUU1QyxTQUFTLEVBQUUsQ0FBQztBQUVaLFlBQVksRUFBRSxDQUFDO0FBRWYsNkJBQTZCO0FBQzdCLHFEQUFxRDtBQUNyRCxrQkFBa0I7QUFDbEIsdUVBQXVFO0FBQ3ZFLFFBQVE7QUFDUixZQUFZO0FBSVosK0JBQStCO0FBQy9CLHVCQUF1QjtBQUN2Qix5QkFBeUI7QUFDekIscUJBQXFCO0FBQ3JCLG9CQUFvQjtBQUNwQixtQkFBbUI7QUFDbkIseUJBQXlCO0FBQ3pCLHdCQUF3QjtBQUN4QixRQUFRO0FBQ1IsSUFBSTtBQUNKLEVBQUU7QUFDRiw0REFBNEQ7QUFDNUQsRUFBRTtBQUNGLDZCQUE2QjtBQUM3QixxREFBcUQ7QUFDckQsa0JBQWtCO0FBQ2xCLDRFQUE0RTtBQUM1RSxRQUFRO0FBQ1IsWUFBWTtBQUNaLEVBQUU7QUFDRixtRUFBbUU7QUFDbkUsRUFBRTtBQUNGLG1EQUFtRDtBQUNuRCx3QkFBd0I7QUFDeEIsaUNBQWlDO0FBQ2pDLHNCQUFzQjtBQUN0Qix1QkFBdUI7QUFDdkIsVUFBVTtBQUNWLEVBQUU7QUFDRiwrREFBK0Q7QUFDL0QsMkZBQTJGO0FBQzNGLFVBQVU7QUFDVixFQUFFO0FBQ0YsK0VBQStFO0FBQy9FLEVBQUU7QUFDRix5REFBeUQ7QUFDekQsNENBQTRDO0FBQzVDLDRFQUE0RTtBQUM1RSx3Q0FBd0M7QUFDeEMsVUFBVTtBQUNWLEVBQUU7QUFDRixtRkFBbUY7QUFDbkYsa0NBQWtDO0FBQ2xDLFVBQVU7QUFDVixFQUFFO0FBQ0YscUVBQXFFO0FBQ3JFLEVBQUU7QUFDRixlQUFlO0FBQ2Ysa0NBQWtDO0FBQ2xDLCtCQUErQjtBQUMvQixrQ0FBa0M7QUFDbEMsa0JBQWtCO0FBQ2xCLGlCQUFpQjtBQUNqQiw0QkFBNEI7QUFDNUIsa0JBQWtCO0FBQ2xCLDRCQUE0QjtBQUM1Qix3QkFBd0I7QUFDeEIsU0FBUztBQUNULElBQUk7QUFDSixFQUFFO0FBQ0YsK0JBQStCO0FBQy9CLGlCQUFpQjtBQUNqQiw0QkFBNEI7QUFDNUIsNkJBQTZCO0FBQzdCLFFBQVE7QUFDUixNQUFNO0FBQ04sRUFBRTtBQUNGLFdBQVc7QUFDWCxFQUFFO0FBQ0YsNkhBQTZIO0FBQzdILGdDQUFnQztBQUNoQyxzRUFBc0U7QUFDdEUsV0FBVztBQUNYLFVBQVU7QUFDVixpRUFBaUU7QUFDakUsMkRBQTJEO0FBQzNELGtDQUFrQztBQUNsQywwQkFBMEI7QUFDMUIsV0FBVztBQUNYLFlBQVk7QUFDWixFQUFFO0FBQ0Ysb0NBQW9DO0FBQ3BDLHdFQUF3RTtBQUN4RSx1RUFBdUU7QUFDdkUsMENBQTBDO0FBQzFDLG1IQUFtSDtBQUNuSCxrR0FBa0c7QUFDbEcsOEZBQThGO0FBQzlGLHVCQUF1QjtBQUN2Qix3REFBd0Q7QUFDeEQsc0RBQXNEO0FBQ3RELGtCQUFrQjtBQUNsQixtQ0FBbUM7QUFDbkMsb0hBQW9IO0FBQ3BILGFBQWE7QUFDYiw0RUFBNEU7QUFDNUUsa0dBQWtHO0FBQ2xHLDRCQUE0QjtBQUM1QixTQUFTO0FBQ1QsZ0VBQWdFO0FBQ2hFLFdBQVc7QUFDWCw2QkFBNkI7QUFDN0IsTUFBTSJ9
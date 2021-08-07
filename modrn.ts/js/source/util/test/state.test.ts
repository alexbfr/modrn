/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

// import {createState, PureStateFunction, purifyInternal, State, Stateful, StateToken, useStateInternal, WrappedFunction} from "../state";
//
// interface StatefulX extends Stateful {
//     useState<T, K extends StateToken<T>>(token: K, initial: K["dummy"]): State<T>;
//     purify<T, K extends StateToken<T>, K1=never, K2=never, K3=never, K4=never>(token: K, fn: WrappedFunction<K["dummy"], K1, K2, K3, K4>): PureStateFunction<K1, K2, K3, K4>;
// }
//
// function makeContext(): StatefulX {
//     const result = {
//         state: {},
//         update: () => null,
//         useState: <T, K extends StateToken<T>>(token: K, initial: K["dummy"]): State<T> => useStateInternal(token, result, initial),
//         purify: <T, K extends StateToken<T>, K1=never, K2=never, K3=never, K4=never>(token: K, fn: WrappedFunction<K["dummy"], K1, K2, K3, K4>): PureStateFunction<K1, K2, K3, K4> => {
//             return purifyInternal(result, token, fn);
//         }
//     };
//     return result;
// }
//
// interface SimpleState {
//     aNumber: number;
//     aString: string;
// }
//
// it("Sets up a state correctly", () => {
//
//     const token = createState<SimpleState>();
//     const {useState} = makeContext();
//
//     const [state] = useState(token, {aNumber: 123, aString: "test"});
//
//     expect(state.aNumber).toBe(123);
//     expect(state.aString).toBe("test");
// });
//
// it("Changes a state once correctly", () => {
//
//     const token = createState<SimpleState>();
//     const {useState} = makeContext();
//
//     {
//         const [state, setState] = useState(token, {aNumber: 123, aString: "test"});
//         expect(state.aNumber).toBe(123);
//         expect(state.aString).toBe("test");
//         setState({...state, aNumber: 234});
//     }
//
//     {
//         const [state] = useState(token, {aNumber: 123, aString: "test"});
//         expect(state.aNumber).toBe(234);
//         expect(state.aString).toBe("test");
//     }
//
// });
//
// it("Changes a state with purified function", () => {
//
//     const token = createState<SimpleState>();
//     const {useState, purify} = makeContext();
//
//     const changeNumber = purify(token, () => ({aNumber: 234}));
//
//     {
//         const [state] = useState(token, {aNumber: 123, aString: "test"});
//         expect(state.aNumber).toBe(123);
//         expect(state.aString).toBe("test");
//     }
//     changeNumber();
//     {
//         const [state] = useState(token, {aNumber: 123, aString: "test"});
//         expect(state.aNumber).toBe(234);
//         expect(state.aString).toBe("test");
//     }
//
// });
//
// it("Changes a state in sequence with purified function", () => {
//
//     const token = createState<SimpleState>();
//     const {useState, purify} = makeContext();
//
//     const changeNumber = purify(token, () => ({aNumber: 234}));
//     const changeNumberIf234 = purify(token, (state) => state.aNumber === 234 ? ({aNumber: 345}) : undefined);
//
//     {
//         const [state] = useState(token, {aNumber: 123, aString: "test"});
//         expect(state.aNumber).toBe(123);
//         expect(state.aString).toBe("test");
//     }
//     changeNumber();
//     changeNumberIf234();
//     {
//         const [state] = useState(token, {aNumber: 123, aString: "test"});
//         expect(state.aNumber).toBe(345);
//         expect(state.aString).toBe("test");
//     }
//
// });
//
// it("Does not see changed state without purified function", () => {
//
//     const token = createState<SimpleState>();
//     const {useState} = makeContext();
//
//     {
//         const [state, setState] = useState(token, {aNumber: 123, aString: "test"});
//         expect(state.aNumber).toBe(123);
//         expect(state.aString).toBe("test");
//
//         const updatedState = setState({...state, aNumber: 234});
//         expect(state.aNumber).toBe(123);
//         expect(updatedState.aNumber).toBe(234);
//     }
// });

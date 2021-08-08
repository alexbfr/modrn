/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {useState} from "react";

type PerformanceTestItem = {
    name: string;
    counter: number;
}

type PerformanceTest = {
    currentCounter: number;
    items: PerformanceTestItem[]
}

const batchSize = 1000;
export function PerformanceTestApp() {
    const [state, setState] = useState<PerformanceTest>({currentCounter:0, items:[]});

    function addAtEnd() {
        const newItems = [...state.items];
        let counter = state.currentCounter;
        for (let idx = 0; idx < batchSize; idx++) {
            newItems.push({name: `Item ${counter}`, counter});
            counter++;
        }
        setState({currentCounter: counter, items: newItems});
    }

    function addAtStart() {
        const newItems = [];
        let counter = state.currentCounter;
        for (let idx = 0; idx < batchSize; idx++) {
            newItems.push({name: `Item ${counter}`, counter});
            counter++;
        }
        setState({currentCounter: counter, items: [...newItems, ...state.items]});
    }

    return (<>
        <button onClick={addAtEnd}>Add items at the end</button>
        <button onClick={addAtStart}>Add items at the start</button>
        {state.items.map(item => (<div key={item.counter}>
            <span style={{minWidth: "20em", display: "inline-block"}}>{item.name}</span>
            <span>#{item.counter}</span>
            </div>))}
    </>);
}
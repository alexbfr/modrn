/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {createState, declare, makeComponent, modrn, NoProps, purify, useState} from "modrn";

type PerformanceTestItem = {
    name: string;
    counter: number;
}

type PerformanceTest = {
    currentCounter: number;
    items: PerformanceTestItem[]
}

const performanceTestState = createState<PerformanceTest>();

const batchSize = 1000;
const performanceTest = makeComponent(NoProps, () => {

    const [state, setState] = useState(performanceTestState, {currentCounter: 0, items:[]});

    const addAtEnd = purify(performanceTestState, state => {
        const newItems = [...state.items];
        let counter = state.currentCounter;
        for (let idx = 0; idx < batchSize; idx++) {
            newItems.push({name: `Item ${counter}`, counter});
            counter++;
        }
        return {currentCounter: counter, items: newItems};
    });

    const addAtStart = purify(performanceTestState, state => {
        const newItems = [];
        let counter = state.currentCounter;
        for (let idx = 0; idx < batchSize; idx++) {
            newItems.push({name: `Item ${counter}`, counter});
            counter++;
        }
        return {currentCounter: counter, items: [...newItems, ...state.items]};
    });

    return {items: state.items, addAtEnd, addAtStart};
})
    .html(`
    <button onclick="{{addAtEnd}}">Add items at the end</button>
    <button onclick="{{addAtStart}}">Add items at the start</button>
    <div m-for="{{items}}" m-as="item">
        <span style="min-width: 20em; display: inline-block">{{item.name}}</span>
        <span>#{{item.counter}}</span>
    </div>
`)
    .register();

export const performanceTestModule = declare({performanceTest});

modrn(performanceTestModule);

/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {declare, makeComponent} from "./source/core/component-declaration";
import {createState} from "./source/util/state";
import {purify, useState} from "./source/core/hooks/state-hooks";
import {yearMonthDay} from "./source/filters/date-time-filter";
import {jsonFetch} from "./source/util/fetch";
import {NoProps} from "./source/core/types/registered-component";

const apiURL = "https://api.github.com/repos/vuejs/vue/commits?per_page=5&sha=";

type Author = {
    html_url: string;
    name: string;
};

type Commit = {
    html_url: string;
    sha: string;
    author: Author;
};

const initialState = {
    branches: ["master", "dev"],
    currentBranch: "dev",
    commits: null as (Commit[] | null)
};

type GithubState = typeof initialState;

const githubState = createState<GithubState>();

const githubCommits = makeComponent(NoProps, () => {

    const [state, setState] = useState(githubState, init);

    function init() {
        fetchData(initialState.currentBranch);
        return initialState;
    }

    const setCommits = purify(githubState, (state, commits: Commit[]) => ({commits}));

    async function fetchData(branch: string) {
        await jsonFetch(`${apiURL}${branch}`)
            .then(data => {
                setCommits(data as Commit[]);
            });
    }

    function selected(branch: string) {
        setState({...state, currentBranch: branch});
        fetchData(branch);
    }

    return {branches: state.branches, currentBranch: state.currentBranch, selected, commits: state.commits};
})
    .html(`
    <div m-for="{{branches}}" m-as="branch">
        <input
            type="radio"
            id="{{branch}}"
            value="{{branch}}"
            name="branch" checked="{{branch === currentBranch}}"
            onchange="{{&selected(branch)}}"
            />
        <label for="{{branch}}">{{ branch }}</label>
    </div>
    <p>vuejs/vue@{{ currentBranch }}</p>
    <ul>
        <li m-for="{{commits}}" m-as="record">
            <a href="{{record.html_url}}" target="_blank" class="commit">{{ record.sha.slice(0, 7) }}</a>
            - <span class="message">{{ record.commit.message }}</span><br/>
            by <span class="author"><a href="{{record.author.html_url}}" target="_blank">{{ record.commit.author.name }}</a></span> 
            at <span class="date">{{ yearMonthDay(record.commit.author.date) }}</span>
        </li>
    </ul>
`)
    .withFilters({yearMonthDay})
    .register();

export const githubCommitsModule = declare({githubCommits});
# Introduction

Modrn.ts is a pet project trying to resemble a Framework like vue.js or react.js 
while only focusing on modern browsers and web technologies. So, ES6, web components 
and the fetch api were a given - and since the browser landscape has shrunken 
considerably, almost all browsers should be compatible (not sure about Safari, though).

Please keep in mind that this started as an experiment based on the question, 
is it possible to create a reasonably fast, modern framework not using virtual DOM
but resorting to web components instead, and this experiment hasn't concluded yet :)

# Architecture

The approach in Modrn.ts is to use web components (aka custom elements) to render
the DOM. Meaning there is no need to build and traverse a virtual dom.

Instead, Modrn.ts renders components directly and clones, updates
and removes DOM elements without resorting to another abstraction in between. 
A component in Modrn.ts is created quite similar to other frameworks, but the
HTML template is not parsed separately (or created by emitted code). It is created
in a non-document attached DOM node instead, from which it is cloned as required.

# Performance
There was no focus on optimizing performance yet. The variable substition code is particularly
unoptimized. Nevertheless, the performance is right now broadly comparable to react/vuejs,
at least in the synthetic benchmarks under /examples/performance. 

# So?
Since this is an ongoing experiment, there isn't much of anything aside from code yet. But to 
provide something to feel and see, and to compare against other frameworks, there
are a few examples shamelessly copied from the Vue.js examples:

### elastic-header example
* vuejs: https://vuejs.org/v2/examples/elastic-header.html
* modrnjs: https://codesandbox.io/s/elasticdraggableheader-modrnjs-example-tr90t?file=/src/index.ts

### github-commits example
* vuejs: https://vuejs.org/v2/examples/commits.html
* modrnjs: https://codesandbox.io/s/github-commits-modrnjs-example-67768?file=/src/index.ts

### todo-mvc
* vuejs: https://vuejs.org/v2/examples/todomvc.html
* modrnjs: https://codesandbox.io/s/todomvc-modrnjs-example-g1y22?file=/src/index.ts

All of those examples work exactly the same as the Vue.js examples, to the best
of my knowledge.
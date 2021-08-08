<!--
  - SPDX-License-Identifier: MIT
  - Copyright © 2021 Alexander Berthold
  -->

<template>
  <div>
    <button @click="addAtEnd">Add items at the end</button>
    <button @click="addAtStart">Add items at the start</button>
    <div class="performance-test">
      <div v-for="item in items" :key="item.counter">
        <span style="min-width: 20em; display: inline-block">{{ item.name }}</span>
        <span>#{{ item.counter }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

type PerformanceTestItem = {
  name: string;
  counter: number;
}

type PerformanceTest = {
  currentCounter: number;
  items: PerformanceTestItem[]
}

const batchSize = 1000;
export default Vue.extend({
  name: "PerformanceTest",
  data: function (): PerformanceTest {
    return {
      currentCounter: 0,
      items: []
    };
  },
  methods: {
    addAtEnd: function () {
      const newItems = [];
      let counter = this.currentCounter;
      for (let idx = 0; idx < batchSize; idx++) {
        newItems.push({name: `Item ${counter}`, counter});
        counter++;
      }
      this.items.push(...newItems);
      this.currentCounter = counter;
    },
    addAtStart: function () {
      const newItems = [];
      let counter = this.currentCounter;
      for (let idx = 0; idx < batchSize; idx++) {
        newItems.push({name: `Item ${counter}`, counter});
        counter++;
      }
      this.items.splice(0, 0, ...newItems);
      this.currentCounter = counter;
    }
  }
});
</script>

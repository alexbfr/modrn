<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <PerformanceTest/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PerformanceTest from "@/components/PerformanceTest.vue";

export default Vue.extend({
  name: 'App',
  components: {
    PerformanceTest
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

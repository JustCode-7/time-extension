<script lang="ts">
import TheFooter from '@/components/TheFooter.vue';
import TheHeader from '@/components/TheHeader.vue';
import TheRouterOutlet from '@/components/TheRouterOutlet.vue';
import { store } from '@/store/store';
import { Component, Vue } from 'vue-property-decorator';
import Login from './components/Login.vue';

@Component({
  components: {
    TheHeader,
    TheFooter,
    TheRouterOutlet,
    Login,
  },
})
export default class App extends Vue {

  constructor() {
    super();

    store.dispatch('tabConnection/connectToTab');
  }
}
</script>


<template>
  <div id="app">
    <TheHeader/>
    <TheRouterOutlet/>
    <TheFooter/>
  </div>
</template>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

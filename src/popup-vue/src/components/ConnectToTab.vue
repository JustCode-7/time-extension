<script lang="ts">
import { store } from '@/store/store';
import Component from 'vue-class-component';
import { Vue } from 'vue-property-decorator';

@Component
export default class ConnectToTab extends Vue {
  onConnectToTab(): void {
    store.dispatch('tabConnection/connectToTab');
  }
}
</script>


<template>
  <div>
    <p>In order to use this extension, please open a Time Tab.</p>
    <button v-on:click="() => this.onConnectToTab()">Connect to Tab</button>
  </div>
</template>


<style scoped></style>

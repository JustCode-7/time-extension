<script lang="ts">
import ConnectToTab from '@/components/ConnectToTab.vue';
import Login from '@/components/Login.vue';
import { Route } from '@/store/route-state';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: { Login, ConnectToTab },
  computed: {
    activeRoute(): Route {
      return this.$store.getters['route/activeRoute'];
    },
  },
})
export default class TheRouterOutlet extends Vue {
  Route = Route; /** inject enum */
}
</script>


<template>
  <div>
    <p>Active Route: {{ activeRoute }}</p>
    <ConnectToTab v-if="activeRoute === Route.OpenTab"/>
    <Login v-else-if="activeRoute === Route.Login"/>
    <p v-else>404 - Unknown route {{ activeRoute }}</p>
  </div>
</template>


<style scoped></style>

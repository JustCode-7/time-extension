import { authStateModule } from '@/store/auth-state';
import { RouteState, routeStateModule } from '@/store/route-state';
import { tabConnectionStateModule } from '@/store/tab-connection-state';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export interface RootState {
  route: RouteState,
}

export const store = new Vuex.Store<RootState>({
  devtools: true,
  strict: true,
  modules: {
    route: routeStateModule,
    tabConnection: tabConnectionStateModule,
    auth: authStateModule,
  },
});

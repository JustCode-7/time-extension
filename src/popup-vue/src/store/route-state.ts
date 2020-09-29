import { RootState } from '@/store/store';
import { ActionContext, Module } from 'vuex';

export enum Route {
  OpenTab = 'OpenTab',
  Login = 'Login',
  Home = 'Home',
}


export interface RouteState {
  activeRoute: Route;
}

const initialState: RouteState = {
  activeRoute: Route.OpenTab,
};

export const routeStateModule: Module<RouteState, RootState> = {
  namespaced: true,
  state: () => initialState,
  getters: {
    activeRoute(state: RouteState): Route {
      return state.activeRoute;
    },
  },
  mutations: {
    updateActiveRoute(state: RouteState, newRoute: Route): void {
      state.activeRoute = newRoute;
    },
  },
  actions: {
    updateActiveRoute({ commit }: ActionContext<RouteState, RootState>, newRoute: Route) {
      commit('updateActiveRoute', newRoute);
    },
  },
};

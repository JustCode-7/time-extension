import { createSelector, createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../global/app';

export enum Route {
  OpenTab = 'OpenTab',
  Login = 'Login',
  Home = 'Home',
}


interface RouteState {
  activeRoute: Route,
}

const initialState: RouteState = {
  activeRoute: Route.OpenTab,
};

export const route = createSlice({
  name: 'route',
  initialState,
  reducers: {
    updateActiveRoute(state: Draft<RouteState>, action: PayloadAction<Route>) {
      state.activeRoute = action.payload;
      return state;
    },
  },
});

const getRouteState = (state: RootState) => state.route;

export const getActiveRoute = createSelector(
  [getRouteState],
  (state: RouteState) => state.activeRoute,
);

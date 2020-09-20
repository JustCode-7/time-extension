import { AnyAction, combineReducers, createStore, Store } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';
import { auth } from './auth.state';
import { route } from './route.state';

/**
 * Initialize Store
 */
const rootReducer = combineReducers({
  auth: auth.reducer,
  route: route.reducer,
});
export type RootState = ReturnType<typeof rootReducer>
// export const store: Store = configureStore({ reducer: rootReducer, devTools: true });

export let store: Store;

export function initStore(): void {
  store = createStore(rootReducer, composeWithDevTools());
}

export function dispatch(action: AnyAction): void {
  store.dispatch(action);
}

export function getRootState(): RootState {
  return store.getState();
}

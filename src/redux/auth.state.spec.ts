import { combineReducers, createStore, Store } from '@reduxjs/toolkit';
import { auth, AuthState, getAuthState, isLoggedIn } from './auth.state';

describe('Auth State', () => {
  let store: Store;
  const initialState: AuthState = {
    credentials: null,
    loginStatus: {
      isLoggedIn: false,
      remainingAttempts: 3,
      isAccountLocked: false,
    },
  };

  beforeEach(() => {
    store = createStore(
      combineReducers({ auth: auth.reducer }),
      { auth: initialState },
    );
  });

  describe('Actions and Reducers', () => {
    it('should have an initial State', () => {
      const state: AuthState = store.getState();
      expect(state).toEqual({ auth: initialState });
    });

    it('should update State', () => {
      store.dispatch(auth.actions.updateLoginStatus({
        isLoggedIn: true,
        loginAttempts: 42,
        isAccountLocked: true,
      }));

      const expected = {
        auth: { isLoggedIn: true, loginAttempts: 42, isAccountLocked: true },
      };

      const state: AuthState = store.getState();
      expect(state).toEqual(expected);
    });

    it('should partially update the State', () => {
      store.dispatch(auth.actions.updateIsLoggedIn(true));

      const expected = { auth: { ...initialState, isLoggedIn: true } };

      const state: AuthState = store.getState();
      expect(state).toEqual(expected);
    });
  });

  describe('Selectors', () => {
    it('should select the whole AuthState', function() {
      const loginState: AuthState = getAuthState(store.getState());
      expect(loginState).toEqual(initialState);
    });

    it('should select isLoggedIn', function() {
      const result: boolean = isLoggedIn(store.getState());
      expect(result).toEqual(false);
    });
  });
});

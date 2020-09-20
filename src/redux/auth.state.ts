import { createSelector, createSlice, Draft, PayloadAction, Slice } from '@reduxjs/toolkit';
import { RootState } from '../popup/global/app';
import { Constants } from '../shared/constants';
import { Auth } from '../shared/messaging.util';
import Credentials = Auth.Credentials;

export interface LoginStatus {
  isLoggedIn: boolean,
  remainingAttempts: number,
  isAccountLocked: boolean,
}

export interface AuthState {
  credentials: Credentials | null,
  loginStatus: LoginStatus,
}

const initialState: AuthState = {
  credentials: null,
  loginStatus: {
    isLoggedIn: false,
    isAccountLocked: false,
    remainingAttempts: Constants.MAX_LOGIN_ATTEMPTS,
  },
};

export const auth: Slice<AuthState> = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateCredentials(state: Draft<AuthState>, { payload: newCredentials }: PayloadAction<Credentials>) {
      const previousUsername = state.credentials?.username;
      if (previousUsername !== newCredentials.username) {
        state.loginStatus.isLoggedIn = false;
        state.loginStatus.remainingAttempts = Constants.MAX_LOGIN_ATTEMPTS;
        state.loginStatus.isAccountLocked = false;
      }
      state.credentials = newCredentials;
      return state;
    },
    updateLoginStatus(state: Draft<AuthState>, { payload: newStatus }: PayloadAction<LoginStatus>) {
      state.loginStatus.isLoggedIn = newStatus.isLoggedIn;
      state.loginStatus.remainingAttempts = newStatus.remainingAttempts;
      state.loginStatus.isAccountLocked = newStatus.isAccountLocked;
      return state;
    },
    updateIsLoggedIn(state: Draft<AuthState>, { payload: isLoggedIn }: PayloadAction<boolean>) {
      state.loginStatus.isLoggedIn = isLoggedIn;
      if (!isLoggedIn) {
        state.loginStatus.remainingAttempts--;
        state.loginStatus.isAccountLocked = state.loginStatus.remainingAttempts <= 0;
      }
      return state;
    },
  },
});

export const getAuthState = (state: RootState): AuthState => state.auth;

export const getCredentials = createSelector(
  [getAuthState],
  (state): Credentials | null => state.credentials,
);

export const getLoginStatus = createSelector(
  [getAuthState],
  (state): LoginStatus => state.loginStatus,
);

export const isLoggedIn = createSelector(
  [getAuthState],
  (state): boolean => state.loginStatus.isLoggedIn,
);

export const isAccountLocked = createSelector(
  [getAuthState],
  (state): boolean => state.loginStatus.isAccountLocked,
);

import { messageConnectionPort } from '@/main';
import { Route } from '@/store/route-state';
import { RootState } from '@/store/store';
import { ActionContext, Module } from 'vuex';
import { Constants } from '../../../shared/constants';
import { Logger } from '../../../shared/logger';
import { Auth, GenericMessage } from '../../../shared/message.types';
import { LoginStatus } from '../../../shared/models/login-status.model';
import Credentials = Auth.Credentials;
import LoginResult = Auth.LoginResult;

interface AuthState {
  credentials: Credentials | null,
  loginStatus: {
    isLoggedIn: boolean,
    remainingAttempts: number,
    isAccountLocked: boolean,
  },
}

const initialState: AuthState = {
  credentials: null,
  loginStatus: {
    isLoggedIn: false,
    remainingAttempts: Constants.MAX_LOGIN_ATTEMPTS,
    isAccountLocked: false,
  },
};


export const authStateModule: Module<AuthState, RootState> = {
  namespaced: true,
  state: () => initialState,
  getters: {
    getLoginStatus: (state): LoginStatus => state.loginStatus,
    isLastAttempt: (state): boolean => state.loginStatus.remainingAttempts === 1,
  },
  mutations: {
    updateState(state, newState: Partial<AuthState>) {
      state = { ...state, ...newState };
    },
    updateCredentials(state, credentials) {
      state.credentials = credentials;
    },
  },
  actions: {
    updateCredentials({ state, commit }: ActionContext<AuthState, RootState>, newCredentials: Credentials) {
      const previousUsername = state.credentials?.username;
      if (previousUsername !== newCredentials.username) {
        commit('updateState', {
          loginStatus: {
            isLoggedIn: false,
            remainingAttempts: Constants.MAX_LOGIN_ATTEMPTS,
            isAccountLocked: false,
          },
        });
      }
      commit('updateCredentials', newCredentials);
    },

    async attemptLogin({ state, dispatch }: ActionContext<AuthState, RootState>, credentials: Credentials) {
      await dispatch('auth/updateCredentials', credentials);
      if (state.loginStatus.isAccountLocked) {
        return;
      } else {
        messageConnectionPort?.postMessage(new Auth.AttemptLoginMessage(credentials));
      }
    },

    handleMessage({ dispatch }: ActionContext<AuthState, RootState>, message: GenericMessage) {
      switch (message.type as Auth.MessageType) {
        case Auth.MessageType.LOGIN_RESULT:
          return dispatch('auth/updateLoginStatus', (message as Auth.LoginResultMessage).loginResult);

        default:
          Logger.logUnimplementedMessageCase(message);
      }
    },

    handleLoginResult({ state, commit, dispatch }: ActionContext<AuthState, RootState>, { isLoggedIn }: LoginResult) {
      const remainingAttempts = isLoggedIn ? Constants.MAX_LOGIN_ATTEMPTS : (state.loginStatus.remainingAttempts - 1);
      const isAccountLocked = remainingAttempts <= 0;

      commit('updateState', { loginStatus: { isLoggedIn, remainingAttempts, isAccountLocked } } as Partial<AuthState>);
      return dispatch('route/updateActiveRoute', Route.Home);
    },

  },
};

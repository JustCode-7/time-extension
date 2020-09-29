import { messageConnectionPort } from '@/main';
import { Route } from '@/store/route-state';
import { RootState, store } from '@/store/store';
import { ActionContext, Module } from 'vuex';
import { Logger } from '../../../shared/logger';
import { Connection, GenericMessage } from '../../../shared/message.types';
import TabConnectionStatus = Connection.TabConnectionStatus;

interface TabConnectionState {
  isPending: boolean,
  isTabConnected: boolean,
}

const initialState: TabConnectionState = {
  isPending: false,
  isTabConnected: false,
};

type ActionContextTabConnection = ActionContext<TabConnectionState, RootState>;


export const tabConnectionStateModule: Module<TabConnectionState, RootState> = {
  namespaced: true,
  state: () => initialState,
  mutations: {
    updateState(state: TabConnectionState, newState: Partial<TabConnectionState>) {
      state = { ...state, ...newState };
    },
    setPending(state: TabConnectionState, isPending: boolean) {
      state.isPending = isPending;
    },
  },
  actions: {
    connectToTab({ commit }: ActionContextTabConnection) {
      commit('setPending', true);
      messageConnectionPort?.postMessage(new Connection.ConnectToTabMessage());
    },

    handleMessage({ dispatch }: ActionContextTabConnection, message: GenericMessage) {
      switch (message.type as Connection.MessageType) {
        case Connection.MessageType.TAB_CONNECTION_STATUS:
          return dispatch('handleConnectionStatusResult', (message as Connection.TabConnectionStatusMessage).tabConnectionStatus);

        default:
          Logger.logUnimplementedMessageCase(message);
      }
    },

    handleConnectionStatusResult({ commit }: ActionContextTabConnection, { isTabConnected }: TabConnectionStatus) {
      commit('updateState', { isPending: false, isTabConnected });

      if (isTabConnected) {
        store.dispatch('route/updateActiveRoute', Route.Login);
      } else {
        store.dispatch('route/updateActiveRoute', Route.OpenTab);
      }
    },
  },
};

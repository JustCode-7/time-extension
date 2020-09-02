import { AnyAction, combineReducers, createStore, Store } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Logger } from '../../shared/logger';
import { Connection, GenericMessage, Realm, RUNTIME_MESSAGE_PORT__POPUP } from '../../shared/messaging.util';
import { AuthService } from '../services/auth.service';
import { ConnectionService } from '../services/connection.service';
import { auth } from '../store/auth.state';
import { route } from '../store/route.state';
import Port = chrome.runtime.Port;

/**
 * Initialize Store
 */
const rootReducer = combineReducers({
  auth: auth.reducer,
  route: route.reducer,
});
export type RootState = ReturnType<typeof rootReducer>
//export const store: Store = configureStore({ reducer: rootReducer, devTools: true });

export const store: Store = createStore(rootReducer, composeWithDevTools());


export function dispatch(action: AnyAction): void {
  store.dispatch(action);
}

export function getRootState(): RootState {
  return store.getState();
}


/**
 * Global reference to send messages.
 */
export let messageConnectionPort: Port;

export default async (): Promise<void> => {
  /**
   * The code to be executed should be placed within a default function that is
   * exported by the global script. Ensure all of the code in the global script
   * is wrapped in the function() that is exported.
   */
  initConnectionPort();

  function initConnectionPort() {
    messageConnectionPort = chrome.runtime.connect({ name: RUNTIME_MESSAGE_PORT__POPUP });
    messageConnectionPort.onMessage.addListener(handleMessage);
    messageConnectionPort.postMessage(new Connection.CheckTabConnectionMessage());
  }

  function handleMessage(action: GenericMessage): void {
    Logger.logIncomingMessage('Popup', action);

    switch (action.realm) {
      // @formatter:off
      case Realm.CONNECTION: ConnectionService.handleMessage(action); break;
      case Realm.AUTH: AuthService.handleMessage(action); break;
      // @formatter:on
      default:
        Logger.logUnimplementedMessageCase(action);
    }
  }
};

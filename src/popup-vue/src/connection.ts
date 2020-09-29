import { store } from '@/store/store';
import { Logger } from '../../shared/logger';
import { Connection, GenericMessage, Realm, RUNTIME_MESSAGE_PORT__POPUP } from '../../shared/message.types';
import Port = chrome.runtime.Port;

export function initConnectionPort(): Port | null {
  try {
    const connectionPort: Port = chrome.runtime.connect({ name: RUNTIME_MESSAGE_PORT__POPUP });
    connectionPort.onMessage.addListener(handleIncomingMessage);
    connectionPort.postMessage(new Connection.CheckTabConnectionMessage());
    return connectionPort;

  } catch (error) {
    Logger.error('Unable to establish a connection', error);
    return null;
  }
}

function handleIncomingMessage(message: GenericMessage): void | Promise<void> {
  Logger.logIncomingMessage('Popup', message);

  switch (message.realm) {
    case Realm.CONNECTION:
      return store.dispatch('tabConnection/handleMessage', message);

    case Realm.AUTH:
      return store.dispatch('auth/handleMessage', message);

    default:
      Logger.logUnimplementedMessageCase(message);
  }
}

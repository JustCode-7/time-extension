import Port = chrome.runtime.Port;
import { Logger } from '../shared/logger';
import { GenericAction, Realm, RUNTIME_MESSAGE_PORT__CONTENT_SCRIPT } from '../shared/messaging.util';
import { AuthCS } from './auth.cs';


export const messageConnectionPort: Port = chrome.runtime.connect({ name: RUNTIME_MESSAGE_PORT__CONTENT_SCRIPT });
messageConnectionPort.onMessage.addListener(handleMessages);

function handleMessages(action: GenericAction): void {
  Logger.logIncomingAction('CS', action);

  switch (action.realm) {
    // @formatter:off
    case Realm.AUTH: AuthCS.handleAction(action); break;
    // @formatter:on
    default:
      Logger.logMissingCase(action);
  }
}

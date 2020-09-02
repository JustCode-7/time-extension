import Port = chrome.runtime.Port;
import { Logger } from '../shared/logger';
import { GenericMessage, Realm, RUNTIME_MESSAGE_PORT__CONTENT_SCRIPT } from '../shared/messaging.util';
import { AuthCS } from './auth.cs';


export const messageConnectionPort: Port = chrome.runtime.connect({ name: RUNTIME_MESSAGE_PORT__CONTENT_SCRIPT });
messageConnectionPort.onMessage.addListener(handleMessages);

function handleMessages(action: GenericMessage): void {
  Logger.logIncomingMessage('ContentScript', action);

  switch (action.realm) {
    // @formatter:off
    case Realm.AUTH: AuthCS.handleAction(action); break;
    // TODO add additonal pages, eg. Buchungen
    // @formatter:on
    default:
      Logger.logUnimplementedMessageCase(action);
  }
}

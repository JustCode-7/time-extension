import Port = chrome.runtime.Port;
import { Logger } from '../shared/logger';
import { GenericMessage, Realm, RUNTIME_MESSAGE_PORT__CONTENT_SCRIPT } from '../shared/message.types';
import { AuthCS } from './auth.cs';


export const messageConnectionPort: Port = chrome.runtime.connect({ name: RUNTIME_MESSAGE_PORT__CONTENT_SCRIPT });
messageConnectionPort.onMessage.addListener(handleMessages);

function handleMessages(message: GenericMessage): void {
  Logger.logIncomingMessage('ContentScript', message);

  switch (message.realm) {
    case Realm.AUTH:
      AuthCS.handleMessage(message);
      break;

    // TODO add additonal pages, eg. Buchungen

    default:
      Logger.logUnimplementedMessageCase(message);
  }
}

import { Logger } from '../../shared/logger';
import { General, GenericAction, Realm, RUNTIME_MESSAGE_PORT__POPUP } from '../../shared/messaging.util';
import { AuthService } from './services/auth.service';
import { GeneralService } from './services/general.service';
import Port = chrome.runtime.Port;


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
  init();

  let counter = 0;
  setTimeout(() => console.log(counter++), 20);

  function init() {
    const port: Port = chrome.runtime.connect({ name: RUNTIME_MESSAGE_PORT__POPUP });
    messageConnectionPort = port;
    messageConnectionPort.onMessage.addListener(handleMessage);
    messageConnectionPort.postMessage(new General.CheckTabConnectionAction());
  }

  function handleMessage(action: GenericAction): void {
    console.log('Popup received action ::', action.realm + '.' + action.type, '::', action);

    switch (action.realm) {
      // @formatter:off
      case Realm.GENERAL: GeneralService.handleAction(action); break;
      case Realm.AUTH: AuthService.handleAction(action); break;
      // @formatter:on
      default:
        Logger.logMissingCase(action);
    }
  }
};

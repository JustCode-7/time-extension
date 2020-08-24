import { Subject } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { ZEIT_URL, ZEIT_URL_QUERY_PATTERN } from '../../shared/constants';
import { Logger } from '../../shared/logger';
import { General, GenericAction } from '../../shared/messaging.util';
import { portConnections } from '../background';
import Tab = chrome.tabs.Tab;
import MessageType = General.MessageType;

export const GeneralService = new class {

  handleAction(action: GenericAction) {
    switch (action.type as General.MessageType) {
      // @formatter:off
      case MessageType.CONNECT_TO_TAB: this.connectToTab(); break;
      case MessageType.CHECK_TAB_CONNECTION: this.checkIfTabIsConnected(); break;
      // @formatter:on
      default:
        Logger.logMissingCase(action);
    }
  }

  /**
   * The goal is to create or reestablish the connection to the Content-Script
   *
   * In order to do so, we either:
   * - Open a new Tab or
   * - Reload an existing tab to reactivate the Content-Script Connection
   */
  private connectToTab(): Promise<void> {
    const subject = new Subject<void>();
    chrome.tabs.query({ url: ZEIT_URL_QUERY_PATTERN }, (result: Tab[]) => {

      if (result.length === 0) {
        chrome.tabs.create({ active: true, url: ZEIT_URL });
        subject.next();

      } else {
        const tabId = result[0].id;

        if ((!!tabId || tabId === 0) && tabId !== chrome.tabs.TAB_ID_NONE) {
          chrome.tabs.update(tabId, { active: true });
          chrome.tabs.reload(tabId);
          // chrome.tabs.highlight({ tabs: [tabId] });
          subject.next();
        } else {
          console.error('! Unable to connect to Tab.');
        }
      }
    });

    return subject
      .pipe(take(1), delay(500))
      .toPromise();
  }

  private checkIfTabIsConnected() {
    const isTabConnected = portConnections.isContentScriptConnected();
    portConnections.getPopupPort()?.postMessage(new General.TabConnectionStatusAction({ isTabConnected }));
  }
};

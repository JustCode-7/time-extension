import { Constants } from '../../shared/constants';
import { Logger } from '../../shared/logger';
import { Connection, GenericMessage } from '../../shared/messaging.util';
import { portConnections } from '../background';
import Tab = chrome.tabs.Tab;
import MessageType = Connection.MessageType;

export const ConnectionService = new class {

  handleMessage(action: GenericMessage) {
    switch (action.type as Connection.MessageType) {
      // @formatter:off
      case MessageType.CONNECT_TO_TAB: this.connectToTab(); break;
      case MessageType.CHECK_TAB_CONNECTION: this.checkIfTabIsConnected(); break;
      // @formatter:on
      default:
        Logger.logUnimplementedMessageCase(action);
    }
  }

  /**
   * The goal is to create or reestablish the connection to the Content-Script
   *
   * In order to do so, we either:
   * - Open a new Tab or
   * - Reload an existing tab to reinitialize the Content-Script Connection
   */
  private connectToTab(): void {
    chrome.tabs.query(
      { url: Constants.ZEIT_URL_QUERY_PATTERN },
      (result: Tab[]) => {

        if (result.length === 0) {
          this.openNewTab();

        } else {
          const tabId = result[0].id;
          this.focusAndReloadExistingTab(tabId);
        }
      });
  }

  private openNewTab(): void {
    chrome.tabs.create({ active: true, url: Constants.ZEIT_URL });
  }

  private focusAndReloadExistingTab(tabId: number | undefined): void {
    if ((!!tabId || tabId === 0) && tabId !== chrome.tabs.TAB_ID_NONE) {
      chrome.tabs.update(tabId, { active: true });
      chrome.tabs.reload(tabId);
      // chrome.tabs.highlight({ tabs: [tabId] });
    } else {
      Logger.error(`Unable to connect to Tab, tabId=${tabId}`);
    }
  }

  private checkIfTabIsConnected() {
    const isTabConnected = portConnections.isContentScriptConnected();
    portConnections.getPopupPort()
      ?.postMessage(new Connection.TabConnectionStatusMessage({ isTabConnected }));
  }
};

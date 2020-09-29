import { Logger } from '../shared/logger';
import { RUNTIME_MESSAGE_PORT__CONTENT_SCRIPT, RUNTIME_MESSAGE_PORT__POPUP } from '../shared/message.types';
import { PortConnections } from './port-connections';
import Port = chrome.runtime.Port;


/**
 * Initialize Message Connections between Popup and Content-Script
 */
export const portConnections = new PortConnections();

chrome.runtime.onInstalled.addListener(() => {
  Logger.info('Background Script got successfully installed');
});

chrome.runtime.onConnect.addListener((port: Port) => {
  switch (port.name) {
    case RUNTIME_MESSAGE_PORT__CONTENT_SCRIPT:
      portConnections.setContentScriptPort(port);
      break;

    case RUNTIME_MESSAGE_PORT__POPUP:
      portConnections.setPopupPort(port);
      break;

    default:
      Logger.info('Discard unknown connection:', port.name, port);
  }
});

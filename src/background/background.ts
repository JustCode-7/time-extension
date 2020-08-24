import { RUNTIME_MESSAGE_PORT__CONTENT_SCRIPT, RUNTIME_MESSAGE_PORT__POPUP } from '../shared/messaging.util';
import { PortConnections } from './port-connections';
import Port = chrome.runtime.Port;


export const portConnections = new PortConnections();


chrome.runtime.onInstalled.addListener(() => {
  console.log('Background Script got successfully installed.');
});


chrome.runtime.onConnect.addListener((port: Port) => {
  switch (port.name) {
    // @formatter:off
    case RUNTIME_MESSAGE_PORT__CONTENT_SCRIPT: portConnections.setContentScriptPort(port); break;
    case RUNTIME_MESSAGE_PORT__POPUP: portConnections.setPopupPort(port); break;
    // @formatter:on
    default:
      console.log('Discard unknown connection:', port.name, port);
  }
});

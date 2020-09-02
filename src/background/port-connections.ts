import { Logger } from '../shared/logger';
import { GenericMessage, MessageTarget, Realm, RUNTIME_MESSAGE_PORT__CONTENT_SCRIPT, RUNTIME_MESSAGE_PORT__POPUP } from '../shared/messaging.util';
import { ConnectionService } from './services/connection.service';
import Port = chrome.runtime.Port;


export class PortConnections {
  private _contentScriptPort: Port | null = null;
  private _isContentScriptConnected = false;

  private _popupPort: Port | null = null;
  private _isPopupConnected = false;

  setContentScriptPort(port: Port): void {
    this._contentScriptPort = port;
    this._isContentScriptConnected = true;
    this.initListeners(port);
  }

  setPopupPort(port: Port): void {
    this._popupPort = port;
    this._isPopupConnected = true;
    this.initListeners(port);
  }

  getContentScriptPort(): Port | null {
    return this._contentScriptPort;
  }

  getPopupPort(): Port | null {
    return this._popupPort;
  }

  isContentScriptConnected(): boolean {
    return this._isContentScriptConnected;
  }


  private initListeners(port: Port) {
    console.log('+ Port connected,', port.name);
    port.onMessage.addListener((message) => this.onMessage(message));
    port.onDisconnect.addListener((port) => this.onDisconnect(port));
  }

  protected onMessage(message: GenericMessage): void {
    try {
      Logger.logMessage(message, this._popupPort, this._contentScriptPort);

      switch (message.target) {
        case MessageTarget.ContentScript:
          this.getContentScriptPort()?.postMessage(message);
          break;

        case MessageTarget.Popup:
          this.getPopupPort()?.postMessage(message);
          break;

        case MessageTarget.Background:
          this.handleMessage(message);
          break;

        default:
          Logger.logUnimplementedMessageCase(message);
      }

    } catch (error) {
      Logger.error('Something went wrong', error);
    }
  }

  // noinspection JSMethodCanBeStatic
  private handleMessage(message: GenericMessage): void {
    switch (message.realm) {

      case Realm.CONNECTION:
        ConnectionService.handleMessage(message);
        break;

      default:
        Logger.logUnimplementedMessageCase(message);
    }
  }


  private onDisconnect(port: Port): void {
    console.log('- Port disconnected,', port.name);
    port.onMessage.removeListener((message) => this.onMessage(message));

    if (port.name === RUNTIME_MESSAGE_PORT__CONTENT_SCRIPT) {
      this._isContentScriptConnected = false;
    } else if (port.name === RUNTIME_MESSAGE_PORT__POPUP) {
      this._isPopupConnected = false;
    }
  }
}

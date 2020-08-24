import { GenericAction, Realm, RUNTIME_MESSAGE_PORT__CONTENT_SCRIPT, RUNTIME_MESSAGE_PORT__POPUP } from '../shared/messaging.util';
import { AuthService } from './services/auth.service';
import { GeneralService } from './services/general.service';
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
    console.log(' + Port connected,', port.name);
    port.onMessage.addListener((message) => this.onMessage(message));
    port.onDisconnect.addListener((port) => this.onDisconnect(port));
  }

  protected onMessage(action: GenericAction): void {
    try {
      this.logAction(action);

      switch (action.realm) {
        // @formatter:off
        case Realm.GENERAL: GeneralService.handleAction(action); break;
        case Realm.AUTH: AuthService.handleAction(action); break;
        // TODO add additional cases, eg. BUCHUNGEN
        // @formatter:on
        default:
          console.error('! Unimplemented case for action', action);
      }

    } catch (error) {
      console.error('Something went wrong.', error);
    }
  }

  private onDisconnect(port: Port): void {
    console.log(' - Port disconnected,', port.name);
    port.onMessage.removeListener((message) => this.onMessage(message));

    if (port.name === RUNTIME_MESSAGE_PORT__CONTENT_SCRIPT) {
      this._isContentScriptConnected = false;
    } else if (port.name === RUNTIME_MESSAGE_PORT__POPUP) {
      this._isPopupConnected = false;
    }
  }


  private logAction(action: GenericAction) {
    console.groupCollapsed(`Action received ${action.realm}.${action.type}`);
    console.log('PopupPort', this._popupPort?.name);
    console.log('ContentScriptPort', this._contentScriptPort?.name);
    console.log(action);
    console.groupEnd();

    // console.log('New action received: ', action, '| PopupPort:', this._popupPort?.name, '| ContentScriptPort: ', this._contentScriptPort?.name);
  }
}

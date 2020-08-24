import { Auth, GenericAction } from '../../shared/messaging.util';
import { sleep } from '../../shared/sync.util';
import { portConnections } from '../background';
import LoginStatus = Auth.LoginStatus;
import Port = chrome.runtime.Port;


export const AuthService = new class {

  private _credentials: Auth.Credentials = { username: '', password: '' };
  private _loginAttemptCounter = 0;
  private _isLoggedIn = false;

  handleAction(action: GenericAction) {

    switch (action.type as Auth.MessageType) {
      // @formatter:off
      case Auth.MessageType.LOGIN_ATTEMPT: this.onLogin((action as Auth.AttemptLoginAction).credentials); break;
      case Auth.MessageType.CHECK_LOGIN_STATUS: this.onCheckLoginStatus(); break;
      case Auth.MessageType.LOGIN_RESULT: this.onLoginResult(action as Auth.LoginResultAction); break;
      case Auth.MessageType.LOGIN_STATUS: this.sendLoginStatus(portConnections.getPopupPort()); break;
      // @formatter:on

      default:
        console.error('[AuthService] Unimplemented case for action', action);
    }
  }


  private async onLogin(credentials: Auth.Credentials) {

    if (this._loginAttemptCounter < Auth.MAX_LOGIN_ATTEMPTS) {
      this.updateAttemptCounter(credentials);
      this.doLogin(portConnections.getContentScriptPort(), credentials);

    } else {
      this.sendAccountLockedMessage(portConnections.getPopupPort());
    }

    this._credentials = credentials;
  }

  /**
   * The user is locked out. No need to try a third time.
   * @private
   */
  private sendAccountLockedMessage(popupPort: Port | null) {
    popupPort?.postMessage(new Auth.LoginStatusAction({ isLoggedIn: false, loginAttempts: this._loginAttemptCounter, isAccountLocked: true }));
  }

  private doLogin(contentScriptPort: Port | null, credentials: Auth.Credentials) {
    contentScriptPort?.postMessage(new Auth.AttemptLoginAction(credentials));
    sleep(300) // wait for frames to load
      .then(() => contentScriptPort?.postMessage(new Auth.CheckLoginStatusAction()));
  }

  private updateAttemptCounter(credentials: Auth.Credentials) {
    if (this._credentials.username != credentials.username) {
      this._loginAttemptCounter = 0;

    } else {
      this._loginAttemptCounter++;
    }
  }

  private onLoginResult(action: Auth.LoginResultAction) {
    this._isLoggedIn = action.loginResult.isLoggedIn;
    this.sendLoginStatus(portConnections.getPopupPort());

  }

  private sendLoginStatus(port: Port | null) {

    const loginStatus: LoginStatus = {
      isLoggedIn: this._isLoggedIn,
      loginAttempts: this._loginAttemptCounter,
      isAccountLocked: this._loginAttemptCounter < Auth.MAX_LOGIN_ATTEMPTS,
    };

    port?.postMessage(new Auth.LoginStatusAction(loginStatus));
  }

  private onCheckLoginStatus() {
    portConnections.getContentScriptPort()?.postMessage(new Auth.CheckLoginStatusAction());
  }
};

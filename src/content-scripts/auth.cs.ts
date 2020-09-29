import { Logger } from '../shared/logger';
import { Auth, GenericMessage } from '../shared/message.types';
import { sleep } from '../shared/sync.util';
import { Header, Login, Navbar } from './elements.cs';
import { messageConnectionPort } from './index.cs';

export const AuthCS = new class {

  handleMessage(action: GenericMessage) {
    switch (action.type as Auth.MessageType) {
      // @formatter:off
      case Auth.MessageType.LOGIN_ATTEMPT: this.onLoginAttempt(action as Auth.AttemptLoginMessage); break;
      case Auth.MessageType.CHECK_LOGIN_STATUS: this.onCheckLoginStatus(); break;
      // @formatter:on
      default:
        Logger.logUnimplementedMessageCase(action);
    }
  }

  private onLoginAttempt({ credentials }: Auth.AttemptLoginMessage) {
    this.login(credentials).then((isLoggedIn: boolean) => {
      this.sendLoginResult({ isLoggedIn });
    });
  }

  private onCheckLoginStatus() {
    const isLoggedIn = this.isLoggedIn();
    this.sendLoginResult({ isLoggedIn });
  }

  private sendLoginResult(loginResult: Auth.LoginResult) {
    messageConnectionPort.postMessage(new Auth.LoginResultMessage(loginResult));
  }

  /**
   * Login
   *
   * @param username {string}
   * @param password {string}
   * @return {Promise<boolean>} true if the Login was successful, otherwise false
   */
  private async login({ username, password }: Auth.Credentials): Promise<boolean> {
    if (this.isLoggedIn()) return true;

    Login.usernameInput.element?.setAttribute('value', username);
    Login.passwordInput.element?.setAttribute('value', password);

    await sleep(10);
    Login.loginBtn.element?.click();

    await sleep(10); // wait until header has updated
    return this.isLoggedIn();
  }

  /**
   * Check if the user is logged in.
   *
   * The element with the id=`DIV1_de` is ONLY available on the Login-page. (Top right corner)
   *
   * If the element is found, we are on the Login-page,
   * if not, we are already logged in on a subpage.
   *
   * @return {boolean} true if logged in, otherwise false
   */
  private isLoggedIn(): boolean {
    return Header.bitteAnmelden.element === null;
  }

  /**
   * Logout
   */
  private logout(): void {
    Navbar.logout.element?.click();
  }
};

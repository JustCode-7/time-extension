import { Component, h, State } from '@stencil/core';
import { Auth } from '../../../shared/messaging.util';
import { AuthService } from '../../global/services/auth.service';
import { messageConnectionPort } from '../../global/app';

enum Control {
  username,
  password,
}

@Component({
  tag: 'te-login',
  styleUrl: 'te-login.css',
  shadow: true,
})
export class TeLogin {

  @State() private _username = '';
  @State() private _password = '';

  @State() private _loginResult: Auth.LoginStatus = { isLoggedIn: false, loginAttempts: Auth.MAX_LOGIN_ATTEMPTS, isAccountLocked: false };

  constructor() {
    messageConnectionPort.postMessage(new Auth.CheckLoginStatusAction());
    AuthService.loginStatus$
      .subscribe((loginResult: Auth.LoginStatus) => this._loginResult = loginResult);
  }

  render(): h.JSX.IntrinsicElements {
    return (
      <div class='ma2'>

        <h2>IT-Zeit Login</h2>

        <form onSubmit={(event) => this.onLogin(event)}>
          <div class="mt1">
            <label htmlFor="username">Username</label><br/>
            <input type="text" id="username" maxlength="20" required
                   onInput={(event) => this.handleInput(event, Control.username)}
            />
          </div>
          <div class="mt1">
            <label htmlFor="password">Password</label><br/>
            <input type="password" id="password" maxlength="16" required
                   onInput={(event) => this.handleInput(event, Control.password)}
            />
          </div>
          <div class="mt2 flex justify-end">
            <button type='submit' class="mr1" id="login-btn">LOGIN</button>
            <button type='reset' class="ml1" id="reset-btn">RESET</button>
          </div>

          {!this._loginResult.isAccountLocked &&
          <div>You have {this.getRemainingLoginAttempts()} remaining attempts.</div>
          }
          {!this._loginResult.isAccountLocked && this.isLastAttempt() &&
          <div>Watch out. If you fail the next Login, your account will be locked.</div>
          }
          {this._loginResult.isAccountLocked &&
          <div>You did it. Your Account is locked.</div>
          }
        </form>
      </div>
    );
  }

  private handleInput(event: Event, control: Control): void {
    const el = event.target as HTMLInputElement;
    const value = el.value;
    switch (control) {
      // @formatter:off
      case Control.username: this._username = value; break;
      case Control.password: this._password = value; break;
      // @formatter:on
      default:
        throw new Error(`Unknown value ${control}`);
    }
  }

  private onLogin(event: Event): void {
    event.preventDefault();

    const credentials: Auth.Credentials = { username: this._username, password: this._password };
    AuthService.attemptLogin(credentials);
  }

  private getRemainingLoginAttempts(): number {
    return Auth.MAX_LOGIN_ATTEMPTS - this._loginResult.loginAttempts;
  }

  private isLastAttempt() {
    return (Auth.MAX_LOGIN_ATTEMPTS - 1) === this.getRemainingLoginAttempts();
  }

}

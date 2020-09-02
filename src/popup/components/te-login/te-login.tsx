import { Component, h, State } from '@stencil/core';
import { Auth } from '../../../shared/messaging.util';
import { AuthService } from '../../services/auth.service';
import { getRootState, messageConnectionPort, store } from '../../global/app';
import { getLoginStatus, LoginStatus } from '../../store/auth.state';
import { Logger } from '../../../shared/logger';
import Credentials = Auth.Credentials;

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

  @State() private _credentials: Credentials = { username: '', password: '' };
  @State() private _loginStatus: LoginStatus = getLoginStatus(getRootState());

  constructor() {
    messageConnectionPort.postMessage(new Auth.CheckLoginStatusMessage());
    store.subscribe(() => {
      this._loginStatus = getLoginStatus(getRootState());
    });
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

          {!this._loginStatus.isAccountLocked &&
          <p>You have {this._loginStatus.remainingAttempts} remaining attempts.</p>
          }
          {!this._loginStatus.isAccountLocked && this.isLastAttempt() &&
          <p>Watch out. If you fail the next Login, your account will be locked.</p>
          }
          {this._loginStatus.isAccountLocked &&
          <p>You did it. Your Account is locked.</p>
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
      case Control.username: this._credentials.username = value; break;
      case Control.password: this._credentials.password = value; break;
      // @formatter:on
      default:
        Logger.logUnimplementedCase(control);
    }
  }

  private onLogin(event: Event): void {
    event.preventDefault();
    AuthService.attemptLogin(this._credentials);
  }

  private isLastAttempt(): boolean {
    return this._loginStatus.remainingAttempts === 1;
  }

}

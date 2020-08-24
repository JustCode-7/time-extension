import { Subject } from 'rxjs';
import { Logger } from '../../../shared/logger';
import { Auth, GenericAction } from '../../../shared/messaging.util';
import { messageConnectionPort } from '../app';
import { Route, RoutingState } from './routing.state';

export const AuthService = new class {
  private _loginStatus$ = new Subject<Auth.LoginStatus>();

  get loginStatus$(): Subject<Auth.LoginStatus> {
    return this._loginStatus$;
  }

  attemptLogin(credentials: Auth.Credentials) {
    messageConnectionPort.postMessage(new Auth.AttemptLoginAction(credentials));
  }

  handleAction(action: GenericAction) {
    switch (action.type as Auth.MessageType) {
      // @formatter:off
      case Auth.MessageType.LOGIN_STATUS: this.onLoginStatus(action as Auth.LoginStatusAction); break;
      // @formatter:on

      default:
        Logger.logMissingCase(action);
    }
  }

  private onLoginStatus({ loginStatus }: Auth.LoginStatusAction): void {
    this._loginStatus$.next(loginStatus);

    if (loginStatus.isLoggedIn) {
      RoutingState.updateActiveRoute(Route.Home);
    }
  }
};

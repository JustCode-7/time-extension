import { Logger } from '../../shared/logger';
import { Auth, GenericMessage } from '../../shared/messaging.util';
import { dispatch, getRootState, messageConnectionPort } from '../global/app';
import { auth, isAccountLocked } from '../store/auth.state';
import { Route, route } from '../store/route.state';

export const AuthService = new class {

  attemptLogin(credentials: Auth.Credentials) {
    dispatch(auth.actions.updateCredentials(credentials));
    if (isAccountLocked(getRootState())) {
      return;
    } else {
      messageConnectionPort.postMessage(new Auth.AttemptLoginMessage(credentials));
    }
  }

  handleMessage(message: GenericMessage) {
    switch (message.type as Auth.MessageType) {

      case Auth.MessageType.LOGIN_RESULT:
        this.onLoginResult(message as Auth.LoginResultMessage);
        break;

      default:
        Logger.logUnimplementedMessageCase(message);
    }
  }

  private onLoginResult({ loginResult }: Auth.LoginResultMessage): void {
    dispatch(auth.actions.updateLoginStatus(loginResult.isLoggedIn));

    if (loginResult.isLoggedIn) {
      dispatch(route.actions.updateActiveRoute(Route.Home));
    }
  }
};

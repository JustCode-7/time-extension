import { BehaviorSubject } from 'rxjs';
import { Logger } from '../../shared/logger';
import { Connection, GenericMessage } from '../../shared/messaging.util';
import { dispatch, messageConnectionPort } from '../global/app';
import { Route, route } from '../store/route.state';


export const ConnectionService = new class {
  // TODO create state for this. `connection.state.ts` ?
  tabConnectionStatus$ = new BehaviorSubject<Connection.TabConnectionStatus>({ isTabConnected: false });

  connectToTab() {
    messageConnectionPort.postMessage(new Connection.ConnectToTabMessage());
  }

  handleMessage(action: GenericMessage) {
    switch (action.type as Connection.MessageType) {

      case Connection.MessageType.TAB_CONNECTION_STATUS:
        this.onTabConnectionStatus(action as Connection.TabConnectionStatusMessage);
        break;

      default:
        Logger.logUnimplementedMessageCase(action);
    }
  }

  private onTabConnectionStatus({ tabConnectionStatus }: Connection.TabConnectionStatusMessage) {
    this.tabConnectionStatus$.next(tabConnectionStatus); // TODO dispatch action

    if (!tabConnectionStatus.isTabConnected) {
      dispatch(route.actions.updateActiveRoute(Route.OpenTab));
    } else {
      dispatch(route.actions.updateActiveRoute(Route.Login));
    }
  }
};

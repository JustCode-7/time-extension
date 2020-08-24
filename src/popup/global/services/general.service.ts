import { BehaviorSubject } from 'rxjs';
import { Logger } from '../../../shared/logger';
import { General, GenericAction } from '../../../shared/messaging.util';
import { messageConnectionPort } from '../app';
import { Route, RoutingState } from './routing.state';


export const GeneralService = new class {
  tabConnectionStatus$ = new BehaviorSubject<General.TabConnectionStatus>({ isTabConnected: false });

  connectToTab() {
    messageConnectionPort.postMessage(new General.ConnectToTabAction());
  }

  handleAction(action: GenericAction) {
    switch (action.type as General.MessageType) {
      // @formatter:off
      case General.MessageType.TAB_CONNECTION_STATUS: this.onTabConnectionStatus(action as General.TabConnectionStatusAction); break;
      // @formatter:on
      default:
        Logger.logMissingCase(action);
    }
  }

  private onTabConnectionStatus({ tabConnectionStatus }: General.TabConnectionStatusAction) {
    this.tabConnectionStatus$.next(tabConnectionStatus);

    if (!tabConnectionStatus.isTabConnected) {
      RoutingState.updateActiveRoute(Route.OpenTab);
    } else {
      RoutingState.updateActiveRoute(Route.Login);
    }
  }
};

import { BehaviorSubject } from 'rxjs';

export enum Route {
  OpenTab = 'OpenTab',
  Login = 'Login',
  Home = 'Home',
}

export const RoutingState = new class {
  private _activeRoute$ = new BehaviorSubject<Route>(Route.Login);

  get activeRoute$(): BehaviorSubject<Route> {
    return this._activeRoute$;
  }

  updateActiveRoute(route: Route) {
    this._activeRoute$.next(route);
    console.log('updateActiveRoute', route);
  }
};

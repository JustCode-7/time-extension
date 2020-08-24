import '@stencil/router';
import { Component, h, Host, State } from '@stencil/core';
import { Route, RoutingState } from '../../../global/services/routing.state';

@Component({
  tag: 'page-root',
  styleUrl: 'page-root.css',
  shadow: true,
})
export class PageRoot {
  @State() private _activeRoute: Route = RoutingState.activeRoute$.getValue();

  constructor() {
    RoutingState.activeRoute$.subscribe((nextRoute) => {
      console.log('new route received', nextRoute);
      this._activeRoute = nextRoute;
    });
  }

  render(): h.JSX.IntrinsicElements {
    return (
      <Host>
        <app-header/>
        <main>
          {this.renderRoutes()}
        </main>
      </Host>
    );
  }

  renderRoutes(): h.JSX.IntrinsicElements {
    console.log('render Route', this._activeRoute);
    switch (this._activeRoute) {
      // @formatter:off
      case Route.OpenTab: return (<te-open-tab/>);
      case Route.Login: return (<te-login/>);
      case Route.Home: return (<app-home/>);
      // @formatter:on
      default:
        return (<p>404 - Unknown Route {this._activeRoute}</p>);
    }
  }
}

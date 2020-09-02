import '@stencil/router';
import { Component, h, Host, State } from '@stencil/core';
import { getRootState, store } from '../../global/app';
import { getActiveRoute, Route } from '../../store/route.state';

@Component({
  tag: 'page-root',
  styleUrl: 'page-root.css',
  shadow: true,
})
export class PageRoot {
  @State() private _activeRoute: Route = getActiveRoute(getRootState());

  constructor() {
    store.subscribe(() => {
      this._activeRoute = getActiveRoute(getRootState());
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
    console.log('rendering Route', this._activeRoute);
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

import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true,
})
export class AppHome {

  render() {
    return (
      <Host>
        <p>Home works.</p>
        <slot/>
      </Host>
    );
  }

}

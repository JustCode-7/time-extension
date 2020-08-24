import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'te-header',
  styleUrl: 'te-header.css',
  shadow: true,
})
export class TeHeader {

  render(): h.JSX.IntrinsicElements {
    return (
      <Host>
        <header>
          <h1>Time Extension</h1>
        </header>
      </Host>
    );
  }
}

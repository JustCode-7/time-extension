import { Component, h, Host } from '@stencil/core';
import { GeneralService } from '../../global/services/general.service';

@Component({
  tag: 'te-open-tab',
  styleUrl: 'te-open-tab.css',
  shadow: true,
})
export class TeOpenTab {

  render(): h.JSX.IntrinsicElements {
    return (
      <Host>
        <p>In order to use this extension, please open a Time Tab.</p>
        <button onClick={() => this.onConnectToTab()}>Connect to Tab</button>
      </Host>
    );
  }

  // noinspection JSMethodCanBeStatic
  private onConnectToTab() {
    GeneralService.connectToTab();
  }

}

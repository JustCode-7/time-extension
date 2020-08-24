import { newSpecPage } from '@stencil/core/testing';
import { TeOpenTab } from '../te-open-tab';

describe('te-open-tab', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [TeOpenTab],
      // eslint-disable-next-line quotes
      html: `<te-open-tab></te-open-tab>`,
    });
    expect(page.root).toEqualHtml(`
      <te-open-tab>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </te-open-tab>
    `);
  });
});

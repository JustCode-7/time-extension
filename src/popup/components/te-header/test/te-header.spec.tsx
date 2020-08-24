import { newSpecPage } from '@stencil/core/testing';
import { TeHeader } from '../te-header';

describe('app-header', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [TeHeader],
      // eslint-disable-next-line quotes
      html: `<te-header></te-header>`,
    });
    expect(page.root).toEqualHtml(`
      <te-header>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </te-header>
    `);
  });
});

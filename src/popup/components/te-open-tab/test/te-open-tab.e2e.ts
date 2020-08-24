import { newE2EPage } from '@stencil/core/testing';

describe('te-open-tab', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<te-open-tab></te-open-tab>');

    const element = await page.find('te-open-tab');
    expect(element).toHaveClass('hydrated');
  });
});

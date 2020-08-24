import { newE2EPage } from '@stencil/core/testing';

describe('te-header', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<te-header></te-header>');

    const element = await page.find('te-header');
    expect(element).toHaveClass('hydrated');
  });
});

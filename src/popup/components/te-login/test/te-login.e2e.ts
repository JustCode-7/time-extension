import { newE2EPage } from '@stencil/core/testing';

describe('app-login', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<te-login></te-login>');

    const element = await page.find('te-login');
    expect(element).toHaveClass('hydrated');
  });

  it('contains a "Profile Page" button', async () => {
    const page = await newE2EPage();
    await page.setContent('<te-login></te-login>');

    const element = await page.find('te-login >>> button');
    expect(element.textContent).toEqual('Profile page');
  });
});

import HelloWorld from '@/pages/Root.vue';
import { shallowMount } from '@vue/test-utils';

describe('Root.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});

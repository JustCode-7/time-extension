import { initConnectionPort } from '@/connection';
import { store } from '@/store/store';
import Vue from 'vue';
import App from './App.vue';

import './styles.scss';

/**
 * Global reference to send messages.
 */
export const messageConnectionPort = initConnectionPort();

Vue.config.productionTip = true;
Vue.config.performance = true;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');

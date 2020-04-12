import Vue from 'vue';
import PopupApp from './PopupApp';

global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

new Vue({
  render: (h) => h(PopupApp),
}).$mount('#app');

import Vue from 'vue';
import MainApp from './MainApp';
import vuetify from '../plugins/vuetify';
global.browser = require('webextension-polyfill');

Vue.prototype.$browser = global.browser;

new Vue({
  vuetify,
  render: (h) => h(MainApp),
}).$mount('#app');

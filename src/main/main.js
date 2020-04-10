import Vue from 'vue';
import MainApp from './MainApp';
global.browser = require('webextension-polyfill');

Vue.prototype.$browser = global.browser;

new Vue({
  el: '#app',
  render: h => h(MainApp),
});

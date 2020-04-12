import Vue from 'vue';
import OptionsApp from './OptionsApp';

global.browser = require('webextension-polyfill');

new Vue({
  render: (h) => h(OptionsApp),
}).$mount('#app');

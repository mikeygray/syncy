import Vue from 'vue';
import OptionsApp from './OptionsApp';
global.browser = require('webextension-polyfill');

new Vue({
  el: '#app',
  render: h => h(OptionsApp),
});

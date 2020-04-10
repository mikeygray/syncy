<template>
  <div id="syncy-main">
    <h1>Hello, Syncy!</h1>
    <pre id="syncy-content">{{ content }}</pre>
  </div>
</template>

<script>
const browser = require('webextension-polyfill');
export default {
  name: 'syncy-main-app',
  data: function() {
    return {
      content: '... loading ...',
    };
  },
  mounted: function() {
    /** Use an anonymous function to maintain 'this' context */
    chrome.tabs.query({}, tabArray => {
      this.content = JSON.stringify(tabArray, undefined, 2);
    });
  },
};
</script>

<style scoped>
#syncy-content {
  font-size: 12px;
}
</style>

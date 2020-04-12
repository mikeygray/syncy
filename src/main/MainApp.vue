<template>
  <div id="syncy-main">
    <v-app>
      <v-content>
        <v-container>
          <h1>Hello, Syncy!</h1>
        </v-container>
        <v-container>
          <pre id="syncy-content">{{ content }}</pre>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
const browser = require('webextension-polyfill');
export default {
  name: 'syncy-main-app',
  data: function () {
    return {
      content: '... loading ...',
    };
  },
  mounted: function () {
    /** Use an anonymous function to maintain 'this' context */
    chrome.tabs.query({}, (tabArray) => {
      this.content = JSON.stringify(tabArray, undefined, 2);
    });
  },
};
</script>

<style lang="scss" scoped>
#syncy-content {
  font-size: 12px;
}
</style>

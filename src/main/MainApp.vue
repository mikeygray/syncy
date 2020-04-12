<template>
  <v-app id="syncy-main">
    <HeaderNav />
    <v-content>
      <v-container fluid>
        <h2>Browser - {{ deviceid }}</h2>
        <h3>Windows</h3>
        <pre class="syncy-content">{{ wincontent }}</pre>
        <h3>Tabs</h3>
        <pre class="syncy-content">{{ tabcontent }}</pre>
        <h3>Devices</h3>
        <pre class="syncy-content">{{ devicecontent }}</pre>
        <h3>Recent</h3>
        <pre class="syncy-content">{{ recentcontent }}</pre>
      </v-container>
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import HeaderNav from './components/HeaderNav';
import Footer from './components/Footer';

const browser = require('webextension-polyfill');

export default {
  name: 'syncy-main',
  components: {
    HeaderNav,
    Footer,
  },
  data: function () {
    return {
      deviceid: 'unknown',
      wincontent: '... loading ...',
      tabcontent: '... loading ...',
      devicecontent: '... loading ...',
      recentcontent: '... loading ...',
    };
  },
  created() {
    /** Use an anonymous function to maintain 'this' context */
    chrome.instanceID.getID((id) => {
      this.deviceid = id;
    });
    chrome.windows.getAll({ populate: true }, (winArray) => {
      this.wincontent = JSON.stringify(winArray, undefined, 2);
    });
    chrome.tabs.query({}, (tabArray) => {
      this.tabcontent = JSON.stringify(tabArray, undefined, 2);
    });
    chrome.sessions.getDevices({}, (deviceArray) => {
      this.devicecontent = JSON.stringify(deviceArray, undefined, 2);
    });
    chrome.sessions.getRecentlyClosed({}, (recentArray) => {
      this.recentcontent = JSON.stringify(recentArray, undefined, 2);
    });
  },
};
</script>

<style lang="scss" scoped>
.syncy-content {
  font-size: 12px;
}
</style>

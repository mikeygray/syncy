<template>
  <v-app id="main">
    <HeaderNav />
    <v-content>
      <v-container fluid>
        <h1>Browser - {{ deviceId }}</h1>

        <LegacyWindowsList
          title="Current Tabs"
          v-bind:windowsData="this.thisBrowserData"
        ></LegacyWindowsList>

        <LegacyCardLinksList
          title="Recent Tabs"
          v-bind:items="this.thisRecentsData"
        ></LegacyCardLinksList>

        <v-divider inset class="mx-auto"></v-divider>

        <h1>Debug</h1>
        <h2>Windows</h2>
        <pre class="syncy-content">{{ winContent }}</pre>
        <h2>Devices</h2>
        <pre class="syncy-content">{{ deviceContent }}</pre>
        <h2>Recent</h2>
        <pre class="syncy-content">{{ JSON.stringify(thisRecentsData, undefined, 2) }}</pre>
      </v-container>
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
  import HeaderNav from './components/HeaderNav';
  import Footer from './components/Footer';
  import LegacyWindowsList from './components/legacy_WindowsList';
  import LegacyCardLinksList from './components/legacy_CardLinksList';
  import {
    identifyBrowser,
    emptyBrowserData,
    parseWindowsData,
    emptyTabList,
    parseRecentsData,
  } from './tools';

  const browser = require('webextension-polyfill');

  export default {
    name: 'syncy-main',
    components: {
      HeaderNav,
      Footer,
      LegacyCardLinksList,
      LegacyWindowsList,
    },
    data: function () {
      return {
        thisBrowserData: emptyBrowserData,
        thisRecentsData: emptyTabList,
        deviceId: 'unknown',
        winContent: '... loading ...',
        deviceContent: '... loading ...',
      };
    },
    created() {
      /** Use an anonymous function to maintain 'this' context */
      chrome.windows.getAll({ populate: true }, (winArray) => {
        chrome.instanceID.getID((id) => {
          this.winContent = JSON.stringify(winArray, undefined, 2);
          let browsername = identifyBrowser(navigator.userAgent);
          this.deviceId = browsername + ' - ID: ' + id;
          this.thisBrowserData = parseWindowsData(id, browsername, winArray);
        });
      });
      chrome.sessions.getDevices({}, (deviceArray) => {
        this.deviceContent = JSON.stringify(deviceArray, undefined, 2);
      });
      chrome.sessions.getRecentlyClosed({}, (recentArray) => {
        this.thisRecentsData = parseRecentsData(recentArray);
      });
    },
  };
</script>

<style lang="scss" scoped>
  main.v-content {
    width: 100vw;
    height: calc(100vh - 58px - 48px);
    flex-direction: column;
    overflow-y: scroll;
    margin-top: 58px;
    margin-bottom: 48px;
    padding-top: 0 !important;
  }
  .syncy-content {
    font-size: 12px;
  }
</style>

<template>
  <v-app id="main">
    <HeaderNav />
    <v-content>
      <v-container fluid>
        <h1 class="my-2">This Browser</h1>

        <BrowserInstance
          :browserid="thisBrowserID"
          :browsername="thisBrowserName"
          :tabpanelsdata="thisTabPanels"
        ></BrowserInstance>

        <v-divider class="my-6"></v-divider>

        <h1 class="my-2">Debug</h1>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>Raw Windows Data</v-expansion-panel-header>
            <v-expansion-panel-content>
              <pre class="syncy-content">{{ tempWindowContent }}</pre>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>Raw Recents Data</v-expansion-panel-header>
            <v-expansion-panel-content>
              <pre class="syncy-content">{{ tempRecentsContent }}</pre>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>Raw Devices Data</v-expansion-panel-header>
            <v-expansion-panel-content>
              <pre class="syncy-content">{{ tempDeviceContent }}</pre>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>Parsed TabPanel Data</v-expansion-panel-header>
            <v-expansion-panel-content>
              <pre class="syncy-content">{{ JSON.stringify(thisTabPanels, undefined, 2) }}</pre>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-container>
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
  import HeaderNav from './components/HeaderNav';
  import Footer from './components/Footer';
  import BrowserInstance from './components/BrowserInstance';
  import {
    identifyBrowser,
    parseWindowsData,
    parseRecentsData,
    parseDevicesData,
  } from '../common/tools';

  const browser = require('webextension-polyfill');

  export default {
    components: {
      HeaderNav,
      Footer,
      BrowserInstance,
    },
    data: function () {
      return {
        thisBrowserID: 'unknown',
        thisBrowserName: 'unknown',
        thisTabPanels: [],
        tempWindowContent: '... loading ...',
        tempDeviceContent: '... loading ...',
        tempRecentsContent: '... loading ...',
      };
    },
    created: function () {
      /** Use an anonymous functions to maintain 'this' context */
      chrome.instanceID.getID((id) => {
        this.thisBrowserID = id;
      });

      this.thisBrowserName = identifyBrowser(navigator.userAgent);

      chrome.windows.getAll({ populate: true }, (winArray) => {
        this.thisTabPanels.unshift(...parseWindowsData(winArray));
        this.tempWindowContent = JSON.stringify(winArray, undefined, 2);
      });

      chrome.sessions.getRecentlyClosed({}, (recentArray) => {
        this.thisTabPanels.push(parseRecentsData(recentArray));
        this.tempRecentsContent = JSON.stringify(recentArray, undefined, 2);
      });

      chrome.sessions.getDevices({}, (deviceArray) => {
        this.thisTabPanels.push(...parseDevicesData(deviceArray));
        this.tempDeviceContent = JSON.stringify(deviceArray, undefined, 2);
      });
    },
  };
</script>

<style lang="scss" scoped>
  /** primarily to trap scrollbars in central conatiner */
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

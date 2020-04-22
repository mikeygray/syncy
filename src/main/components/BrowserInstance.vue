<template>
  <v-card class="ma-auto">
    <v-toolbar justify="space-around">
      <v-icon>{{ browsericon }}</v-icon>
      <v-toolbar-title class="text-capitalize">{{ browserName }}</v-toolbar-title>
      <v-card-subtitle>ID: {{ browserId }}</v-card-subtitle>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="expandAll">
            <v-icon>{{ mdiExpandAll }}</v-icon>
          </v-btn>
        </template>
        <span>Expand All</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="expandAll">
            <v-icon>{{ mdiCollapseAll }}</v-icon>
          </v-btn>
        </template>
        <span>Collapse All</span>
      </v-tooltip>
    </v-toolbar>

    <v-expansion-panels v-model="openPanels" multiple inset>
      <!-- Windows -->
      <v-expansion-panel v-for="(windowData, panelIndex) in windowsData.windows" :key="panelIndex">
        <v-expansion-panel-header>
          {{ panelIndex }} - Open Window ID: {{ windowData.id }} ({{ windowData.tabs.length }} tabs)
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <LinksList v-bind:items="windowData.tabs"></LinksList>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Recents -->
      <v-expansion-panel :key="recentsPanelIndex">
        <v-expansion-panel-header>
          {{ recentsPanelIndex }} - Recent Tabs ({{ recentsData.length }} tabs)
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <LinksList v-bind:items="recentsData"></LinksList>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Device Tabs -->
      <v-expansion-panel :key="devicesPanelIndex">
        <v-expansion-panel-header>
          {{ devicesPanelIndex }} - Other Device Tabs
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          Not Implemented
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
  import LinksList from './LinksList';
  import getBrowserIcon from '../tools';
  import { mdiExpandAll, mdiCollapseAll } from '@mdi/js';
  export default {
    props: {
      browserId: String,
      browserName: String,
      windowsData: Object,
      recentsData: Object,
      devicesData: Object,
    },
    components: {
      LinksList,
    },
    data: () => ({
      browsericon: getBrowserIcon(browserName),
      numberOfPanels: windowsData.windows.length() + 2,
      openPanels: [],
      recentsPanelIndex: numberOfPanels - 2,
      devicesPanelIndex: numberOfPanels - 1,
    }),
    methods: {
      expandAll() {
        this.openPanels = [...Array(this.numberOfPanels).keys()].map((k, i) => i);
      },
      collapseAll() {
        this.openPanels = [];
      },
    },
    created() {
      this.expandAll();
    },
  };
</script>

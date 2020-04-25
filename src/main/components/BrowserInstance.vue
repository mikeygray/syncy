<template>
  <v-card class="ma-auto">
    <v-toolbar>
      <v-icon large>{{ browserIcon }}</v-icon>
      <v-toolbar-title large class="text-capitalize ml-2">{{ browsername }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-card-subtitle>ID: {{ browserid }}</v-card-subtitle>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" :disabled="openPanels.length === numberOfPanels" @click="expandAll">
            <v-icon>{{ expandIcon }}</v-icon>
          </v-btn>
        </template>
        <span>Expand All</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" :disabled="openPanels.length === 0" @click="collapseAll">
            <v-icon>{{ collapseIcon }}</v-icon>
          </v-btn>
        </template>
        <span>Collapse All</span>
      </v-tooltip>
    </v-toolbar>

    <v-expansion-panels v-model="openPanels" multiple inset class="ma-auto pa-1">
      <v-expansion-panel
        v-for="(panel, panelIndex) in tabpanelsdata"
        :key="panelIndex"
        class="ma-1"
      >
        <v-expansion-panel-header>
          <div class="subtitle-1">
            {{ panelIndex }} - {{ panel.title }} ({{ panel.tabs.length }} tabs)
          </div>
          <div v-if="panel.id.length > 0" class="font-weight-light">ID: {{ panel.id }}</div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <LinksList :items="panel.tabs"></LinksList>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
  import LinksList from './LinksList';
  import { getBrowserIcon } from '../../common/tools';
  import { mdiExpandAll, mdiCollapseAll, mdiHelpCircle } from '@mdi/js';
  export default {
    props: {
      browserid: String,
      browsername: String,
      tabpanelsdata: Array,
    },
    components: {
      LinksList,
    },
    data: function () {
      return {
        expandIcon: mdiExpandAll,
        collapseIcon: mdiCollapseAll,
        openPanels: [0],
      };
    },
    computed: {
      browserIcon: function () {
        return this.browsername ? getBrowserIcon(this.browsername) : mdiHelpCircle;
      },
      numberOfPanels: function () {
        return this.tabpanelsdata ? this.tabpanelsdata.length : 0;
      },
    },
    methods: {
      expandAll() {
        this.openPanels = [...Array(this.numberOfPanels).keys()].map((k, i) => i);
      },
      collapseAll() {
        this.openPanels = [];
      },
    },
  };
</script>

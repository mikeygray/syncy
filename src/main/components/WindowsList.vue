<template>
  <v-card class="ma-4">
    <v-toolbar dense>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>{{ pinicon }}</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>{{ dotsicon }}</v-icon>
      </v-btn>
    </v-toolbar>

    <div class="d-flex flex-row">
      <div class="ma-6">
        <v-icon x-large v-if="browserdata.name === 'edge'">{{ edgeicon }}</v-icon>
        <v-icon x-large v-else-if="browserdata.name === 'brave'">{{ braveicon }}</v-icon>
        <v-icon x-large v-else-if="browserdata.name === 'chrome'">{{ chromeicon }}</v-icon>
        <v-icon x-large v-else>{{ unknownicon }}</v-icon>
      </div>
      <div>
        <v-card-title class="text-capitalize display-1">{{ browserdata.name }}</v-card-title>
        <v-card-subtitle>ID: {{ browserdata.id }}</v-card-subtitle>
      </div>
    </div>

    <v-list shaped two-line v-for="window in browserdata.windows" :key="window.id">
      <v-subheader class="text-capitalize">{{ window.title }}</v-subheader>
      <v-list-item v-for="tab in window.tabs" :key="tab.id" v-bind:href="tab.url">
        <v-list-item-avatar>
          <v-img :src="tab.imageurl"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="tab.title"></v-list-item-title>
          <v-list-item-subtitle v-text="tab.url"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
  import {
    mdiMicrosoftEdge,
    mdiGoogleChrome,
    mdiDotsVertical,
    mdiPin,
    mdiSafeSquare,
    mdiHelpBox,
  } from '@mdi/js';
  export default {
    data: () => ({
      chromeicon: mdiGoogleChrome,
      braveicon: mdiSafeSquare,
      edgeicon: mdiMicrosoftEdge,
      unknownicon: mdiHelpBox,
      dotsicon: mdiDotsVertical,
      pinicon: mdiPin,
    }),
    props: {
      title: String,
      browserdata: Object,
    },
  };
</script>

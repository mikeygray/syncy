<template>
  <div>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>{{dashboardicon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item link>
          <v-list-item-action>
            <v-icon>{{settingsicon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Syncy</v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
import { mdiViewDashboard, mdiSettingsHelper } from '@mdi/js'

export default {
  data: () => ({
    drawer: null,
    dashboardicon: mdiViewDashboard,
    settingsicon: mdiSettingsHelper
  }),
};
</script>

<!--
<v-navigation-drawer
  v-model="drawer"
  app
  clipped
  color="grey lighten-4"
>
  <v-list
    dense
    class="grey lighten-4"
  >
    <template v-for="(item, i) in items">
      <v-row
        v-if="item.heading"
        :key="i"
        align="center"
      >
        <v-col cols="6">
          <v-subheader v-if="item.heading">
            {{ item.heading }}
          </v-subheader>
        </v-col>
        <v-col
          cols="6"
          class="text-right"
        >
          <v-btn
            small
            text
          >edit</v-btn>
        </v-col>
      </v-row>
      <v-divider
        v-else-if="item.divider"
        :key="i"
        dark
        class="my-4"
      />
      <v-list-item
        v-else
        :key="i"
        link
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="grey--text">
            {{ item.text }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</v-navigation-drawer>
-->

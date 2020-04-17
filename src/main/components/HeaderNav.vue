<template>
  <div>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list>
        <v-list-item>
          <v-btn icon @click.stop="drawer = !drawer">
            <v-icon>{{ backButton }}</v-icon>
          </v-btn>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item v-for="item in items" :key="item.id" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle v-if="item.subtitle">{{ item.subtitle }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-btn block>Logout</v-btn>
      </template>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Syncy</v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
import { mdiViewDashboard, mdiArrowLeft, mdiCog, mdiBug } from '@mdi/js';

export default {
  data: () => ({
    drawer: false,
    backButton: mdiArrowLeft,
    items: [
      { id: 1, title: 'Home', icon: mdiViewDashboard },
      { id: 2, title: 'Settings', icon: mdiCog },
      { id: 4, title: 'Bugs/Ideas', subtitle: 'Problems? Suggestions?', icon: mdiBug },
    ],
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

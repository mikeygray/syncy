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
    data: function () {
      return {
        drawer: false,
        backButton: mdiArrowLeft,
        items: [
          { id: 1, title: 'Home', icon: mdiViewDashboard },
          { id: 2, title: 'Settings', icon: mdiCog },
          { id: 4, title: 'Bugs/Ideas', subtitle: 'Problems? Suggestions?', icon: mdiBug },
        ],
      };
    },
  };
</script>

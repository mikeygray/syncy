<template>
  <v-card class="ma-4">
    <v-toolbar dense>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>{{ dotsicon }}</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list shaped two-line dense>
      <v-list-item v-for="item in items" :key="item.id" v-bind:href="item.url">
        <v-list-item-avatar small>
          <v-img :src="item.imageurl"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
          <v-list-item-subtitle v-text="item.url"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
  import { mdiDotsVertical } from '@mdi/js';
  export default {
    props: {
      title: String,
      items: Array,
    },
    data: () => ({
      dotsicon: mdiDotsVertical,
    }),
  };
</script>

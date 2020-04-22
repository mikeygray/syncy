<template>
  <v-list shaped two-line dense>
    <v-list-item v-for="item in items" :key="item.id" @click="goTo(tab.url)">
      <v-list-item-avatar small>
        <v-img :src="item.imageurl"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="item.title"></v-list-item-title>
        <v-list-item-subtitle v-text="item.url"></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
  export default {
    props: {
      items: Array,
    },
    methods: {
      goTo(url) {
        window.open(url, '_blank');
      },
    },
  };
</script>

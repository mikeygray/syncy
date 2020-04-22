<template>
  <v-footer app class="elevation-12">
    <v-row dense justify="space-around">
      <v-spacer></v-spacer>
      <v-btn class="pb-1 mr-2" icon @click="window.open('https://twitter.com/sirmikey')">
        <v-icon medium>{{ twittericon }}</v-icon>
      </v-btn>
      <v-chip outlined @click="window.open('https://mikeygray.co.uk')">
        Mikey Gray - {{ new Date().getFullYear() }}
      </v-chip>
    </v-row>
  </v-footer>
</template>

<script>
  import { mdiTwitter } from '@mdi/js';
  export default {
    data: () => ({
      twittericon: mdiTwitter,
    }),
  };
</script>

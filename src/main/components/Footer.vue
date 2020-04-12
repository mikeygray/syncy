<template>
  <v-footer app>
    <span>&copy; {{ Year }}</span>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    Year: '',
  }),
  created() {
    this.Year = new Date().getFullYear();
  },
};
</script>

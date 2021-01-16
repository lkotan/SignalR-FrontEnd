<template>
  <v-app style="background:#E0F7FA">
    <nuxt />
    <client-only>
      <VueConfirm />
    </client-only>
  </v-app>
</template>

<script>
export default {
  components: {
    VueConfirm: () => import("@/components/shared/vue-confirm")
  }
};
</script>

<style></style>

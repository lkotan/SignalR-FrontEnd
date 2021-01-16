<template>
  <v-app>
    <div class="container">
      <nuxt />
    </div>

    <client-only>
      <VueConfirm />
    </client-only>


  </v-app>
</template>
<script>
import { confirmOption } from "@/helpers/plugin-options";

export default {
  components: {
    VueConfirm: () => import("@/components/shared/vue-confirm")
  }
};
</script>
<style></style>

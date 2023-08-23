<template>
  <h1>Main page</h1>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import { LocalStorageUtil } from "@/util/localStorageUtil";

export default defineComponent({
  name: 'MainPage',
  components: {},
  mounted() {
    this.$router.push('/login');
    console.log(LocalStorageUtil.getAuthorizedUserFromStorage())
  },
})
</script>

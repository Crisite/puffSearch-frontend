<template>
  <div class="index-page">
    <a-input-search
      v-model:value="searchText"
      placeholder="input search text"
      enter-button="Search"
      size="large"
      @search="onSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const searchText = ref("");

const onSearch = (value: string) => {
  alert(value);
};
</script>

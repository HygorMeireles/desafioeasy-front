<template>
  <div class="dashboard">
    <div class="flex justify-center mt-2"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
</script>

<style lang="scss">
  .dashboard {
    .va-card {
      margin-bottom: 0 !important;
      &__title {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>

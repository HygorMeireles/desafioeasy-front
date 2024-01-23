<template>
  <div v-if="message" class="message-card" :class="{ success: type === 'success', error: type === 'error' }">
    {{ message }}
  </div>
</template>

<script setup>
  const props = defineProps(['type', 'message'])
</script>

<style scoped>
  .message-card {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px;
    border-radius: 5px;
    color: #fff;
    font-weight: bold;
    z-index: 9999;
    transition: opacity 0.5s ease-in-out;
  }

  .success {
    background-color: #4caf50;
  }

  .error {
    background-color: #f44336;
  }
</style>

<template>
  <svg class="va-icon-mini-easy-logo" :height="props.height">
    <image href="/MiniEasy.png" x="0" y="0" height="100%" width="100%" preserveAspectRatio="none" />
  </svg>
</template>

<script setup lang="ts">
  const props = defineProps<{
    height?: number | string
  }>()
</script>

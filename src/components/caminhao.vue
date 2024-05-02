<template>
  <svg class="va-icon-icones" :height="props.height">
    <image href="/ordenados.png" x="0" y="0" height="100%" width="100%" preserveAspectRatio="none" />
  </svg>
</template>

<script setup lang="ts">
  const props = defineProps<{
    height?: number | string
  }>()
</script>

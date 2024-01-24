<template>
  <svg class="va-icon-easy" :height="props.height" viewBox="0 0 100 40" fill="none">
    <image
      href="https://easypallet.app/img/logo-easypallet.4242a065.png"
      x="0"
      y="0"
      height="100%"
      width="100%"
      preserveAspectRatio="none"
    />
  </svg>
</template>

<script setup lang="ts">
  const props = defineProps<{
    height?: number | string
  }>()
</script>

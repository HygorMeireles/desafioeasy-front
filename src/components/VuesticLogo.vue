<template>
  <svg
    class="va-icon-vuestic"
    :height="props.height"
    viewBox="0 0 100 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <image
      href="https://easypallet.app/img/logo-easypallet.4242a065.png"
      x="0"
      y="0"
      height="115%"
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

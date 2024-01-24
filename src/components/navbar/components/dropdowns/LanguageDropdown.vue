<template>
  <div class="language-dropdown">
    <va-icon :name="getFlagIcon(locale, 'large')" />
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t, locale } = useI18n()

  function getFlagIcon(code: string, size: string) {
    return `flag-icon-${code} ${size}`
  }
</script>

<style lang="scss" scoped>
  @import 'flag-icons/css/flag-icons.css';
  .language-dropdown {
    display: inline-block;
  }
</style>

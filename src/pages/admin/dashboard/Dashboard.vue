<template>
  <div class="dashboard">
    <div class="flex col-span-12 p-4 justify-center">
      <div class="py-5 justify-center flex">
        <mini-easy-logo height="150" width="1100" />
      </div>
    </div>
  </div>
  <div class="dashboard">
    <div class="flex col-span-12 p-4 justify-center">
      <div class="py-5 justify-center flex">
        <Icones height="80" width="400" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import MiniEasyLogo from '@/components/MiniEasyLogo.vue'
  import Icones from '@/components/Icones.vue'
</script>

<style lang="scss"></style>

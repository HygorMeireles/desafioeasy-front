<template>
  <div class="dashboard">
    <div class="flex col-span-12 p-4 justify-center">
      <div class="py-5 justify-center flex">
        <mini-easy-logo height="235" width="1800" />
      </div>
    </div>
  </div>
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <VaCarousel :items="items" stateful autoscroll :autoscroll-interval="6000">
    <template #default="{ item }">
      <img :src="item.src" alt="" />
    </template>
  </VaCarousel>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import MiniEasyLogo from '@/components/MiniEasyLogo.vue'

  const items = ref([
    { src: '/Login.png' },
    { src: 'url-da-imagem-2.jpg' },
    { src: 'url-da-imagem-3.jpg' },
    { src: 'url-da-imagem-3.jpg' },
    { src: 'url-da-imagem-3.jpg' },
  ])
</script>

<style lang="scss">
  .va-carousel {
    height: 500px !important;
  }
  .va-carousel__slide {
    font-size: 10px;
  }

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

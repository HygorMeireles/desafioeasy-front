<template>
  <div class="dashboard">
    <div class="flex col-span-12 p-4 justify-center">
      <div class="py-5 justify-center flex">
        <mini-easy-logo height="150" width="1100" />
      </div>
    </div>
  </div>
  <VaCarousel :items="items" stateful autoscroll infinite :autoscroll-interval="5000">
    <template #default="{ item }">
      <img :src="item.src" alt="" />
    </template>
  </VaCarousel>
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

  const items = ref([
    { src: '/pag1.png' },
    { src: '/pag2.png' },
    { src: '/pag3.png' },
    { src: '/pag4.png' },
    { src: '/pag5.png' },
    { src: '/pag6.png' },
  ])
</script>

<style lang="scss">
  .va-carousel {
    height: 430px !important;
    width: 1100px;
    margin: 0 auto;
    margin-top: 40px;
    margin-bottom: 50px;
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
  .va-button.va-button--round.va-button--normal{
    background-color: #f44336 !important;
    --va-0-background-color: transparent
    color: white !important;
    color: white !important;
  }
  .va-button:hover{
    background-color: #ffffff !important;
    color: #0000 !important;
  }
  .material-icons {
      color: rgb(255, 255, 255)!important;
  }
</style>

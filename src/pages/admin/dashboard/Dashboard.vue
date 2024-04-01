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
    <div class="charts-container">
      <div v-for="chart in charts" :key="chart.title" class="chart-box">
        <div style="color: black" class="chart-title">{{ chart.title }}</div>
        <div class="chart-bar" :style="{ width: chart.value + '%', backgroundColor: chart.color }"></div>
        <div style="color: black" class="chart-value">{{ chart.value }}</div>
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

<script setup>
  import { ref, onMounted } from 'vue'
  import MiniEasyLogo from '@/components/MiniEasyLogo.vue'
  import Icones from '@/components/Icones.vue'
  import axios from 'axios'

  const items = ref([
    { src: '/pag1.png' },
    { src: '/pag2.png' },
    { src: '/pag3.png' },
    { src: '/pag4.png' },
    { src: '/pag5.png' },
    { src: '/pag6.png' },
  ])
  const charts = ref([
    { title: 'Usuários cadastrados:', value: 83, color: '#EF5350' },
    { title: 'Produtos cadastrados:', value: 67, color: '#EF5350' },
    { title: 'Cargas cadastradas:', value: 39, color: '#EF5350' },
  ])
</script>

<style scoped>
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

  .va-button.va-button--round.va-button--normal {
    background-color: #f44336 !important;
    --va-0-background-color: transparent !important;
    color: white !important;
  }

  .va-button:hover {
    background-color: #ffffff !important;
    color: #0000 !important;
  }

  .material-icons {
    color: rgb(255, 255, 255) !important;
  }

  .va-button--current {
    --va-0-background-color: #f44336 !important;
    color: white !important;
  }

  .va-button--normal {
    color: black !important;
  }

  .dashboard .charts-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .chart-box {
    width: 200px;
    padding: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    margin: 20px;
  }

  .chart-title {
    margin-bottom: 10px;
    font-weight: bold;
  }

  .chart-bar {
    height: 20px;
    border-radius: 5px;
  }

  .chart-value {
    margin-top: 5px;
    text-align: right;
  }
</style>

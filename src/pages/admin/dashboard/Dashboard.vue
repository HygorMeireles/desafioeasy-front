<template>
  <div class="dashboard">
    <div class="flex col-span-12 p-4 justify-center">
      <div class="py-5 justify-center flex">
        <mini-easy-logo height="150" width="1100" />
      </div>
    </div>
  </div>
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

  const charts = ref([
    { title: 'Usuários cadastrados:', value: 83, color: '#EF5350' },
    { title: 'Produtos cadastrados:', value: 67, color: '#EF5350' },
    { title: 'Cargas cadastradas:', value: 39, color: '#EF5350' },
  ])
</script>

<style scoped>
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

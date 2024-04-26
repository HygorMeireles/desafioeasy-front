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
  import axios from '@/axios'
  import { useStore } from 'vuex'
  import moment from 'moment-timezone'
  import { useRouter } from 'vue-router'

  const charts = ref([
    { title: 'Usuários cadastrados:', value: 0, color: '#EF5350' },
    { title: 'Produtos cadastrados:', value: 0, color: '#EF5350' },
    { title: 'Cargas cadastradas:', value: 0, color: '#EF5350' },
  ])

  onMounted(async () => {
    try {
      const responses = await Promise.all([
        axios.get(`/admin/v1/users/count`),
        axios.get(`/admin/v1/products/count`),
        axios.get(`/admin/v1/loads/count`),
      ])

      charts.value[0].value = responses[0].data.count
      charts.value[1].value = responses[1].data.count
      charts.value[2].value = responses[2].data.count
    } catch (error) {
      console.error('Error fetching counts:', error)
    }
  })
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

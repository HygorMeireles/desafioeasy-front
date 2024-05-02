<template>
  <div class="dashboard">
    <div class="flex col-span-12 p-4 justify-center">
      <div class="py-5 justify-center flex">
        <mini-easy-logo height="150" width="1100" />
      </div>
    </div>
    <div class="charts-container">
      <div v-for="chart in charts" :key="chart.title" class="chart">
        <div class="flex flex-col items-center">
          <va-image :src="chart.imageSrc" style="width: 60px; height: 50px" />
          <div class="chart-info">
            <div style="color: white" class="chart-value">{{ chart.value }}</div>
            <div style="color: white" class="chart-title">{{ chart.title }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex col-span-12 p-4 justify-center">
      <div class="py-5 justify-center flex">
        <div class="charts-container">
          <div v-for="chart in charts2" :key="chart.title" class="chart">
            <div class="flex flex-col items-center">
              <div class="chart-info2">
                <div style="color: white" class="chart-title">{{ chart.title }}</div>
                <div style="color: white" class="chart-value">{{ chart.value }}</div>
              </div>
            </div>
          </div>
        </div>
        <caminhao height="300" width="1500" />

        <div class="charts-container">
          <div v-for="chart in charts3" :key="chart.title" class="chart">
            <div class="flex flex-col items-center">
              <div class="chart-info2">
                <div style="color: white" class="chart-title">{{ chart.title }}</div>
                <div style="color: white" class="chart-value">{{ chart.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  import caminhao from '@/components/caminhao.vue'
  import axios from '@/axios'
  import { useStore } from 'vuex'
  import moment from 'moment-timezone'
  import { useRouter } from 'vue-router'

  const charts = ref([
    { title: 'Usuários cadastrados', value: 0, color: '#EF5350', imageSrc: '/usuario.png' },
    { title: 'Produtos cadastrados', value: 0, color: '#EF5350', imageSrc: '/produtos.png' },
    { title: 'Cargas cadastradas', value: 0, color: '#EF5350', imageSrc: '/caminhao.png' },
  ])
  const charts2 = ref([{ title: 'Quantidade de listas', value: 0, color: '#EF5350', imageSrc: '/usuario.png' }])
  const charts3 = ref([
    { title: 'Quantidade de produtos ordenados', value: 0, color: '#EF5350', imageSrc: '/usuario.png' },
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
    try {
      const responses = await Promise.all([axios.get(`/admin/v1/loads/0/orders/count`)])
      charts2.value[0].value = responses[0].data.count
    } catch (error) {
      console.error('Error fetching counts:', error)
    }
    try {
      const responses = await Promise.all([axios.get(`/admin/v1/loads/0/orders/0/sorted_order_products/count`)])
      charts3.value[0].value = responses[0].data.count
    } catch (error) {
      console.error('Error fetching counts:', error)
    }
  })
</script>

<style scoped>
  .dashboard .charts-container {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }

  .chart {
    flex: 1;
    text-align: center;
  }

  .chart-info {
    background: linear-gradient(to right, rgb(224, 0, 7), rgb(163, 20, 51));
    padding: 25px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    margin-top: 5px;
  }

  .chart-info2 {
    background: linear-gradient(to right, rgb(224, 0, 7), rgb(163, 20, 51));
    padding: 90px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    margin-top: 5px;
  }

  .chart-title,
  .chart-value {
    color: white;
  }
</style>

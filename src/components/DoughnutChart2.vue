<template>
  <div class="chart-doug">
    <canvas ref="doughnutCanvas"></canvas>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { Doughnut } from 'chart.js'
  import axios from '@/axios'

  const doughnutCanvas = ref(null)
  const chartData = {
    labels: ['Quantidade de Produtos', 'Quantidade de Produtos Ordenados'],
    datasets: [
      {
        label: 'Dados do painel',
        data: [0, 0],
        backgroundColor: ['#5B9F5D', '#CC3536'],
        hoverOffset: 4,
      },
    ],
  }
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    layout: {
      padding: {
        top: 29,
        left: -500,
        right: -300,
        bottom: -1,
      },
    },
  }

  let myDoughnutChart = null

  onMounted(async () => {
    const ctx = doughnutCanvas.value.getContext('2d')
    myDoughnutChart = new Doughnut(ctx, {
      data: chartData,
      options: options,
    })

    try {
      const responseLists = await axios.get(`/admin/v1/products/count`)
      const responseProducts = await axios.get(`/admin/v1/loads/0/orders/0/sorted_order_products/count`)

      chartData.datasets[0].data = [responseLists.data.count, responseProducts.data.count]
      myDoughnutChart.update()
    } catch (error) {
      console.error('Error ao buscar chart data:', error)
    }
  })
</script>
<style scoped>
  .chart-doug {
    width: 600px;
    height: 30px;
    transform: translateY(-50px);
  }
</style>

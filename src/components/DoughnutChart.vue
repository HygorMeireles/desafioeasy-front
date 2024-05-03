<template>
  <div>
    <doughnut-chart :chart-data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
  import { Doughnut } from 'vue-chartjs'

  export default {
    extends: Doughnut,
    props: ['data', 'options'],
    mounted() {
      this.renderChart(this.data, this.options)
    },
  }
</script>

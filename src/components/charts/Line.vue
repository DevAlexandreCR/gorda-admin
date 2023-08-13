<template>
  <Line
      id="my-chart-id"
  />
</template>

<script lang="ts" setup>
import {
  CategoryScale,
  Chart, ChartData,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js/dist/types'

Chart.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)
let globalChartData: ChartData
</script>

<style scoped>

</style>
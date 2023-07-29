<template>
  <Bar
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
  />
</template>

<script lang="ts" setup>

import {ChartData} from 'chart.js'

const chartData: ChartData = {
  labels: [],
}
</script>
<template>
  <div class="row">
    <div class="col-sm-6 chart">
      <Line
          v-if="loaded"
          id="my-chart-id"
          :options="chartOptions"
          :data="globalChartData"
      />
    </div>
    <div class="col-sm-6">
      <div class="chart">
        <canvas id="chart-bar" class="chart-canvas" height="170"></canvas>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Line} from 'vue-chartjs'
import {onBeforeMount, onMounted, ref, Ref} from 'vue'
import {useMetricsStore} from '@/services/stores/MetricsStore'
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement, ChartOptions, ChartData,
} from 'chart.js'
import {useI18n} from 'vue-i18n'

Chart.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, BarElement)
const {getCurrentYearMetric, globalYearMetric, canceledYearMetric, completedYearMetric} = useMetricsStore()
const {t} = useI18n()
const chartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
}
const loaded: Ref<boolean> = ref(false)

let globalChartData: ChartData

onBeforeMount(async () => {
  await getCurrentYearMetric()
  loaded.value = true
  globalChartData = {
    labels: Array.from(globalYearMetric.keys()),
    datasets: [
      {
        label: t('services.total'),
        data: Array.from(globalYearMetric.values()),
        backgroundColor: '#0c0808'
      },
      {
        label: t('services.statuses.completed'),
        data: Array.from(completedYearMetric.values()),
        backgroundColor: '#00ff05'
      },
      {
        label: t('services.statuses.canceled'),
        data: Array.from(canceledYearMetric.values()),
        backgroundColor: '#ff0000'
      }
    ]
  }
})
</script>
<template>
  <div class="row">
    <div class="col-sm-6 chart">
      <Line
          v-if="isLoaded"
          id="global-chart"
          :options="chartOptions"
          :data="globalChartData"
      />
    </div>
    <div class="col-sm-6">
      <div class="chart">
        <Bar
            v-if="isLoaded"
            id="percent-chart"
            :options="percentChartOptions"
            :data="percentChartData"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Bar, Line} from 'vue-chartjs'
import {onBeforeMount, ref, Ref} from 'vue'
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
const {getCurrentYearMetric, loaded, globalYearMetric, canceledYearMetric, completedYearMetric, percentYearMetric} = useMetricsStore()
const {t} = useI18n()
const percentChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    y: {
      ticks: {
        callback: function(value) {
          return value + '%';
        }
      }
    }
  }
}
const chartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: true
}
const isLoaded: Ref<boolean> = ref(false)

let globalChartData: ChartData
let percentChartData: ChartData

onBeforeMount(async () => {
  if (!loaded) await getCurrentYearMetric()
  isLoaded.value = true
  globalChartData = {
    labels: Array.from(globalYearMetric.keys()),
    datasets: [
      {
        label: t('services.total'),
        data: Array.from(globalYearMetric.values()),
        backgroundColor: '#ffd500'
      },
      {
        label: t('services.statuses.terminated'),
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
  percentChartData = {
    labels: Array.from(globalYearMetric.keys()),
    datasets: [
      {
        label: t('common.placeholders.cancel_percent'),
        data: Array.from(percentYearMetric.values()),
        backgroundColor: '#e81022'
      }
    ]
  }
})
</script>
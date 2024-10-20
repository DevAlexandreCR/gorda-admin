<template>
  <div class="row me-2">
    <div class="col-sm-6 col-xxl-4 mt-2">
      <div class="card">
        <div class="card-header">
          <h4>{{ t('common.placeholders.year_service_progress') }}</h4>
        </div>
        <div class="card-body justify-content-center align-items-center">
          <div class="chart">
            <Line
                v-if="isLoaded"
                id="global-chart"
                :options="chartOptions"
                :data="globalChartData"
            />
            <em v-else class="fa-solid fa-spinner fa-10x circle m-auto"></em>
          </div>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-xxl-4 mt-2">
      <div class="card">
        <div class="card-header">
          <h4>{{ t('common.placeholders.cancel_percent') }}</h4>
        </div>
        <div class="card-body justify-content-center align-items-center">
          <div class="chart">
            <Bar
                v-if="isLoaded"
                id="percent-chart"
                :options="percentChartOptions"
                :data="percentChartData"
            />
            <em v-else class="fa-solid fa-spinner fa-10x circle m-auto"></em>
          </div>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-xxl-4 mt-2">
      <div class="chart">
        <div class="card">
          <div class="card-header d-flex">
            <h4>{{ frequency == 'daily' ? t('common.placeholders.daily_top_5') : t('common.placeholders.weekly_top_5') }}</h4>
            <select v-model="frequency" class="form-control form-control-sm ms-auto w-25">
              <option value="daily">{{ t('common.placeholders.daily') }}</option>
              <option value="weekly">{{ t('common.placeholders.weekly') }}</option>
            </select>
          </div>
            <div class="card-body justify-content-center align-items-center">
              <div class="chart">
                <Bar
                  v-if="isLoaded"
                  id="daily-top-5-chart"
                  :options="dailyTop5chartOptions"
                  :data="dailyTop5ChartData"
                />
                <em v-else class="fa-solid fa-spinner fa-10x circle"></em>
              </div>
            </div>
        </div>
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
const {globalYearMetric, canceledYearMetric, completedYearMetric, percentYearMetric, top5DailyMetric, getTop5DailyMetric} = useMetricsStore()
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

const dailyTop5chartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  indexAxis: 'y'
}
const isLoaded: Ref<boolean> = ref(false)
const frequency = ref('daily')

let globalChartData: ChartData
let percentChartData: ChartData
let dailyTop5ChartData: ChartData

onBeforeMount(async () => {
  await getTop5DailyMetric()
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

  dailyTop5ChartData = {
    labels: Array.from(top5DailyMetric.keys()),
    datasets: [{
      indexAxis: 'y',
      label: t('common.placeholders.first_place'),
      data: Array.from(top5DailyMetric.values()),
      fill: false,
      backgroundColor: [
        '#ff0000',
        '#00ff',
        '#d505',
        '#cc0005',
        '#ffd500'
      ]
    }]
  } 
})
</script>
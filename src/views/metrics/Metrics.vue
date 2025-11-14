<template>
  <div class="row me-2">
    <div class="col-sm-6 col-xxl-4 mt-2">
      <div class="card">
        <div class="card-header">
          <h4>{{ t('common.placeholders.year_service_progress') }}</h4>
        </div>

        <div class="card-body">
          <div class="chart">
            <Line
                v-if="isLoaded"
                id="global-chart"
                :options="chartOptions"
                :data="globalChartData"
            />
          </div>
          <div class="d-flex justify-content-center">
            <em v-if="!isLoaded" class="fa-solid fa-spinner fa-10x circle"></em>
          </div>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-xxl-4 mt-2">
      <div class="card">
        <div class="card-header">
          <h4>{{ t('common.placeholders.cancel_percent') }}</h4>
        </div>
        <div class="card-body">
          <div class="chart">
            <Bar
                v-if="isLoaded"
                id="percent-chart"
                :options="percentChartOptions"
                :data="percentChartData"
            />
          </div>
          <div class="d-flex justify-content-center">
            <em v-if="!isLoaded" class="fa-solid fa-spinner fa-10x circle"></em>
          </div>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-xxl-4 mt-2">
      <div class="chart">
        <div class="card">
          <div class="card-header d-flex">
            <h4>{{ frequency == TopFrequency.Daily ? t('common.placeholders.daily_top_5') : t('common.placeholders.weekly_top_5') }}</h4>
            <select v-model="frequency" class="form-control form-control-sm ms-auto w-25">
              <option :value="TopFrequency.Daily">{{ t('common.placeholders.daily') }}</option>
              <option :value="TopFrequency.Weekly">{{ t('common.placeholders.weekly') }}</option>
            </select>
          </div>
            <div class="card-body">
              <div class="chart">
                <Bar
                  v-if="isTopLoaded"
                  id="daily-top-5-chart"
                  :options="dailyTop5chartOptions"
                  :data="dailyTop5ChartData"
                />
              </div>
              <div class="d-flex justify-content-center">
                <em v-if="!isTopLoaded" class="fa-solid fa-spinner fa-10x circle"></em>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Bar, Line} from 'vue-chartjs'
import {onBeforeMount, ref, Ref, watch} from 'vue'
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
import { TopFrequency } from '@/constants/TopFrequency'
import { useThemeStore } from '@/services/stores/ThemeStore'

Chart.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, BarElement)
const {getCurrentYearMetric, globalYearMetric, canceledYearMetric, completedYearMetric, percentYearMetric, top5DailyMetric, getTop5Metric, loaded, loading} = useMetricsStore()
const {t} = useI18n()
const theme = useThemeStore()

function gridColor(isDark: boolean): string {
  return isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'
}
function tickColor(isDark: boolean): string {
  return isDark ? 'rgba(255,255,255,0.7)' : '#6c757d'
}
function labelColor(isDark: boolean): string {
  return isDark ? 'rgba(255,255,255,0.8)' : '#212529'
}

function makeLineOptions(isDark: boolean): ChartOptions {
  return {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: { grid: { color: gridColor(isDark) }, ticks: { color: tickColor(isDark) } },
      y: { grid: { color: gridColor(isDark) }, ticks: { color: tickColor(isDark) } },
    },
    plugins: {
      legend: { labels: { color: tickColor(isDark) } },
      title: { color: labelColor(isDark) }
    }
  }
}

function makeBarOptions(isDark: boolean): ChartOptions {
  return {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'y',
    scales: {
      x: { grid: { color: gridColor(isDark) }, ticks: { color: tickColor(isDark) } },
      y: { grid: { color: gridColor(isDark) }, ticks: { color: tickColor(isDark) } },
    },
    plugins: {
      legend: { labels: { color: tickColor(isDark) } }
    }
  }
}

function makePercentOptions(isDark: boolean): ChartOptions {
  return {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: { grid: { color: gridColor(isDark) }, ticks: { color: tickColor(isDark) } },
      y: {
        grid: { color: gridColor(isDark) },
        ticks: {
          color: tickColor(isDark),
          callback: function(value) { return value + '%' }
        }
      }
    },
    plugins: {
      legend: { labels: { color: tickColor(isDark) } }
    }
  }
}

const percentChartOptions = ref<ChartOptions>(makePercentOptions(theme.isDark))
const chartOptions = ref<ChartOptions>(makeLineOptions(theme.isDark))
const dailyTop5chartOptions = ref<ChartOptions>(makeBarOptions(theme.isDark))
const isLoaded: Ref<boolean> = ref(false)
const isTopLoaded: Ref<boolean> = ref(false)
const frequency = ref<TopFrequency>(TopFrequency.Daily)

let globalChartData: ChartData
let percentChartData: ChartData
let dailyTop5ChartData: ChartData

watch(frequency, async (newFrequency) => {
  isTopLoaded.value = false
  await getTop5Metric(frequency.value)
  setTop5Metric()
  isTopLoaded.value = true
})

onBeforeMount(async () => {
  await getTop5Metric(frequency.value)
  if (!loaded && !loading) await getCurrentYearMetric()
  isLoaded.value = true
  isTopLoaded.value = true
  const yellow = '#ffd500'
  const green = '#00ff05'
  const red = '#ff0000'

  globalChartData = {
    labels: Array.from(globalYearMetric.keys()),
    datasets: [
      {
        label: t('services.total'),
        data: Array.from(globalYearMetric.values()),
        backgroundColor: yellow,
        borderColor: yellow,
        pointBackgroundColor: yellow,
        pointBorderColor: yellow,
        borderWidth: 2,
        tension: 0.3,
        fill: false
      },
      {
        label: t('services.statuses.terminated'),
        data: Array.from(completedYearMetric.values()),
        backgroundColor: green,
        borderColor: green,
        pointBackgroundColor: green,
        pointBorderColor: green,
        borderWidth: 2,
        tension: 0.3,
        fill: false
      },
      {
        label: t('services.statuses.canceled'),
        data: Array.from(canceledYearMetric.values()),
        backgroundColor: red,
        borderColor: red,
        pointBackgroundColor: red,
        pointBorderColor: red,
        borderWidth: 2,
        tension: 0.3,
        fill: false
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

  setTop5Metric()
})

// React to theme changes to update chart options
watch(() => theme.effective, (/*mode*/) => {
  chartOptions.value = makeLineOptions(theme.isDark)
  percentChartOptions.value = makePercentOptions(theme.isDark)
  dailyTop5chartOptions.value = makeBarOptions(theme.isDark)
})

function setTop5Metric(): void {
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
}
</script>

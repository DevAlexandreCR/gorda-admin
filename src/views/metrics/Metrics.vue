<template>
  <div>
    <div class="row g-3 mb-3 metrics-kpi-row">
      <div class="col-6 col-lg-3">
        <div class="card shadow h-100">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-8">
                <p class="text-sm mb-0 text-capitalize font-weight-bold">{{ t('common.placeholders.kpi_services_month') }}</p>
                <h5 class="font-weight-bolder mb-0">{{ servicesCurrentMonth.toLocaleString('es-CO') }}</h5>
                <span v-if="servicesDelta !== null" class="text-sm font-weight-bolder" :class="servicesDelta >= 0 ? 'text-success' : 'text-danger'">
                  <em :class="servicesDelta >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></em>
                  {{ round1(Math.abs(servicesDelta)) }}%
                </span>
              </div>
              <div class="col-4 text-end">
                <div class="icon icon-shape bg-gradient-info shadow text-center border-radius-md">
                  <em class="fas fa-route text-lg text-white"></em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-lg-3">
        <div class="card shadow h-100">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-8">
                <p class="text-sm mb-0 text-capitalize font-weight-bold">{{ t('common.placeholders.kpi_completion_rate') }}</p>
                <h5 class="font-weight-bolder mb-0">{{ round1(completionRate) }}%</h5>
                <span v-if="completionRateDelta !== null" class="text-sm font-weight-bolder" :class="completionRateDelta >= 0 ? 'text-success' : 'text-danger'">
                  <em :class="completionRateDelta >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></em>
                  {{ round1(Math.abs(completionRateDelta)) }} pp
                </span>
              </div>
              <div class="col-4 text-end">
                <div class="icon icon-shape bg-gradient-success shadow text-center border-radius-md">
                  <em class="fas fa-circle-check text-lg text-white"></em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-lg-3">
        <div class="card shadow h-100">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-8">
                <p class="text-sm mb-0 text-capitalize font-weight-bold">{{ t('common.placeholders.kpi_cancellation_rate') }}</p>
                <h5 class="font-weight-bolder mb-0">{{ round1(cancellationRate) }}%</h5>
                <span v-if="cancellationRateDelta !== null" class="text-sm font-weight-bolder" :class="cancellationRateDelta >= 0 ? 'text-success' : 'text-danger'">
                  <em :class="cancellationRateDelta >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></em>
                  {{ round1(Math.abs(cancellationRateDelta)) }} pp
                </span>
              </div>
              <div class="col-4 text-end">
                <div class="icon icon-shape bg-gradient-danger shadow text-center border-radius-md">
                  <em class="fas fa-ban text-lg text-white"></em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-lg-3">
        <div class="card shadow h-100">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-8">
                <p class="text-sm mb-0 text-capitalize font-weight-bold">{{ t('common.placeholders.kpi_leading_driver') }}</p>
                <h5 v-if="topDriverOfMonth" class="font-weight-bolder mb-0">{{ topDriverOfMonth.plate }}</h5>
                <h6 v-else class="font-weight-bolder mb-0 text-muted">{{ t('common.placeholders.kpi_leading_driver_empty') }}</h6>
                <span v-if="topDriverOfMonth" class="text-sm font-weight-bolder text-secondary">
                  {{ topDriverOfMonth.count }} {{ t('common.placeholders.kpi_services_unit') }}
                </span>
              </div>
              <div class="col-4 text-end">
                <div class="icon icon-shape bg-gradient-warning shadow text-center border-radius-md">
                  <em class="fas fa-trophy text-lg text-white"></em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-lg-3">
        <div class="card shadow h-100">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-8">
                <p class="text-sm mb-0 text-capitalize font-weight-bold">{{ t('common.placeholders.kpi_commission_income') }}</p>
                <h5 class="font-weight-bolder mb-0">{{ formatCurrency(commissionCurrentMonth) }}</h5>
                <span v-if="commissionDelta !== null" class="text-sm font-weight-bolder" :class="commissionDelta >= 0 ? 'text-success' : 'text-danger'">
                  <em :class="commissionDelta >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></em>
                  {{ round1(Math.abs(commissionDelta)) }}%
                </span>
              </div>
              <div class="col-4 text-end">
                <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                  <em class="fas fa-sack-dollar text-lg text-white"></em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-lg-3">
        <div class="card shadow h-100">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-8">
                <p class="text-sm mb-0 text-capitalize font-weight-bold">{{ t('common.placeholders.kpi_monthly_fee_income') }}</p>
                <h5 class="font-weight-bolder mb-0">{{ formatCurrency(monthlyFeeCurrentMonth) }}</h5>
                <span v-if="monthlyFeeDelta !== null" class="text-sm font-weight-bolder" :class="monthlyFeeDelta >= 0 ? 'text-success' : 'text-danger'">
                  <em :class="monthlyFeeDelta >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></em>
                  {{ round1(Math.abs(monthlyFeeDelta)) }}%
                </span>
                <p class="text-xs text-muted mb-0 mt-1">{{ payingDriverCount }} {{ t('common.placeholders.kpi_paying_drivers') }}</p>
              </div>
              <div class="col-4 text-end">
                <div class="icon icon-shape bg-gradient-dark shadow text-center border-radius-md">
                  <em class="fas fa-file-invoice-dollar text-lg text-white"></em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-lg-3">
        <div class="card shadow h-100">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-8">
                <p class="text-sm mb-0 text-capitalize font-weight-bold">{{ t('common.placeholders.kpi_cash_collected') }}</p>
                <h5 class="font-weight-bolder mb-0">{{ formatCurrency(rechargeCurrentMonth) }}</h5>
                <span v-if="rechargeDelta !== null" class="text-sm font-weight-bolder" :class="rechargeDelta >= 0 ? 'text-success' : 'text-danger'">
                  <em :class="rechargeDelta >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></em>
                  {{ round1(Math.abs(rechargeDelta)) }}%
                </span>
                <p class="text-xs text-muted mb-0 mt-1">{{ rechargeCount }} {{ t('common.placeholders.kpi_recharges_count') }}</p>
              </div>
              <div class="col-4 text-end">
                <div class="icon icon-shape bg-gradient-info shadow text-center border-radius-md">
                  <em class="fas fa-money-bill-wave text-lg text-white"></em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row me-2">
      <div class="col-sm-6 col-xxl-4 mt-2">
        <div class="card shadow">
          <div class="card-header d-flex align-items-center">
            <div class="icon icon-shape icon-sm bg-gradient-info shadow text-center border-radius-md d-flex align-items-center justify-content-center me-2">
              <em class="fas fa-chart-line text-white text-xs"></em>
            </div>
            <h4 class="mb-0">{{ t('common.placeholders.year_service_progress') }}</h4>
            <span v-if="loading" class="spinner-border spinner-border-sm text-info ms-auto" role="status"></span>
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
        <div class="card shadow">
          <div class="card-header d-flex align-items-center">
            <div class="icon icon-shape icon-sm bg-gradient-danger shadow text-center border-radius-md d-flex align-items-center justify-content-center me-2">
              <em class="fas fa-chart-column text-white text-xs"></em>
            </div>
            <h4 class="mb-0">{{ t('common.placeholders.cancel_percent') }}</h4>
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
              <h4>{{ frequency == TopFrequency.Daily ? t('common.placeholders.daily_top_5') : frequency == TopFrequency.Weekly ? t('common.placeholders.weekly_top_5') : t('common.placeholders.monthly_top_5') }}</h4>
              <select v-model="frequency" class="form-control form-control-sm ms-auto w-25">
                <option :value="TopFrequency.Daily">{{ t('common.placeholders.daily') }}</option>
                <option :value="TopFrequency.Weekly">{{ t('common.placeholders.weekly') }}</option>
                <option :value="TopFrequency.Monthly">{{ t('common.placeholders.monthly_frequency') }}</option>
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

    <div class="row g-3 mt-1">
      <div class="col-lg-7 mt-2">
        <div class="card shadow h-100">
          <div class="card-header d-flex align-items-center">
            <div class="icon icon-shape icon-sm bg-gradient-primary shadow text-center border-radius-md d-flex align-items-center justify-content-center me-2">
              <em class="fas fa-chart-bar text-white text-xs"></em>
            </div>
            <h4 class="mb-0">{{ t('common.placeholders.income_by_charge_type') }}</h4>
          </div>
          <div class="card-body">
            <div class="chart">
              <Bar
                  v-if="isLoaded"
                  id="income-chart"
                  :options="incomeChartOptions"
                  :data="incomeChartData"
              />
            </div>
            <div class="d-flex justify-content-center">
              <em v-if="!isLoaded" class="fa-solid fa-spinner fa-10x circle"></em>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-5 mt-2">
        <div class="card shadow h-100">
          <div class="card-header d-flex align-items-center">
            <div class="icon icon-shape icon-sm bg-gradient-dark shadow text-center border-radius-md d-flex align-items-center justify-content-center me-2">
              <em class="fas fa-list-ul text-white text-xs"></em>
            </div>
            <h4 class="mb-0">{{ t('common.placeholders.income_breakdown') }}</h4>
          </div>
          <div class="card-body">
            <ul class="list-group">
              <li class="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                <span class="text-sm font-weight-bold">{{ t('common.placeholders.kpi_commission_income') }}</span>
                <span class="text-sm font-weight-bolder">{{ formatCurrency(commissionCurrentMonth) }}</span>
              </li>
              <li class="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                <span class="text-sm font-weight-bold">{{ t('common.placeholders.kpi_monthly_fee_income') }}</span>
                <span class="text-sm font-weight-bolder">{{ formatCurrency(monthlyFeeCurrentMonth) }}</span>
              </li>
              <li class="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                <span class="text-sm font-weight-bold">{{ t('common.placeholders.kpi_cash_collected') }}</span>
                <span class="text-sm font-weight-bolder">{{ formatCurrency(rechargeCurrentMonth) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Bar, Line} from 'vue-chartjs'
import {onBeforeMount, ref, Ref, watch} from 'vue'
import {storeToRefs} from 'pinia'
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
const metricsStore = useMetricsStore()
const {getCurrentYearMetric, getTop5Metric, getTop5MonthlyMetric, getYearRevenueMetric} = metricsStore
const {
  globalYearMetric, canceledYearMetric, completedYearMetric, percentYearMetric, top5DailyMetric, loaded, loading,
  servicesCurrentMonth, servicesDelta, completionRate, completionRateDelta, cancellationRate, cancellationRateDelta,
  topDriverOfMonth,
  commissionCurrentMonth, commissionDelta, monthlyFeeCurrentMonth, monthlyFeeDelta, payingDriverCount,
  rechargeCurrentMonth, rechargeDelta, rechargeCount,
  commissionByMonth, monthlyFeeByMonth,
} = storeToRefs(metricsStore)
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

function round1(value: number): number {
  return Math.round(value * 10) / 10
}

function formatCurrency(value: number): string {
  return `${Math.round(value).toLocaleString('es-CO')} COP`
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

function makeIncomeOptions(isDark: boolean): ChartOptions {
  return {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: { grid: { color: gridColor(isDark) }, ticks: { color: tickColor(isDark) } },
      y: {
        grid: { color: gridColor(isDark) },
        ticks: {
          color: tickColor(isDark),
          callback: function(value) { return Number(value).toLocaleString('es-CO') }
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
const incomeChartOptions = ref<ChartOptions>(makeIncomeOptions(theme.isDark))
const isLoaded: Ref<boolean> = ref(false)
const isTopLoaded: Ref<boolean> = ref(false)
const frequency = ref<TopFrequency>(TopFrequency.Daily)

let globalChartData: ChartData
let percentChartData: ChartData
let dailyTop5ChartData: ChartData
let incomeChartData: ChartData

watch(frequency, async (newFrequency) => {
  isTopLoaded.value = false
  await getTop5Metric(frequency.value)
  setTop5Metric()
  isTopLoaded.value = true
})

onBeforeMount(async () => {
  await getTop5Metric(frequency.value)
  if (!loaded.value && !loading.value) await getCurrentYearMetric()
  try {
    await getTop5MonthlyMetric()
  } catch (e) {
    // silent fail — leading-driver card and monthly Top 5 fall back to empty state, non-critical for the rest of the page
  }
  try {
    await getYearRevenueMetric()
  } catch (e) {
    // silent fail — revenue cards/chart degrade to zeros, non-critical for the rest of the page
  }
  isLoaded.value = true
  isTopLoaded.value = true
  const secondary = '#8392ab'
  const success = '#82d616'
  const danger = '#ea0606'
  const primary = '#cb0c9f'
  const dark = '#3a416f'

  globalChartData = {
    labels: Array.from(globalYearMetric.value.keys()),
    datasets: [
      {
        label: t('services.total'),
        data: Array.from(globalYearMetric.value.values()),
        backgroundColor: secondary,
        borderColor: secondary,
        pointBackgroundColor: secondary,
        pointBorderColor: secondary,
        borderWidth: 2,
        borderDash: [5, 4],
        pointRadius: 2,
        pointHoverRadius: 4,
        tension: 0.3,
        fill: false
      },
      {
        label: t('services.statuses.terminated'),
        data: Array.from(completedYearMetric.value.values()),
        backgroundColor: success,
        borderColor: success,
        pointBackgroundColor: success,
        pointBorderColor: success,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.3,
        fill: false
      },
      {
        label: t('services.statuses.canceled'),
        data: Array.from(canceledYearMetric.value.values()),
        backgroundColor: danger,
        borderColor: danger,
        pointBackgroundColor: danger,
        pointBorderColor: danger,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.3,
        fill: false
      }
    ]
  }
  percentChartData = {
    labels: Array.from(globalYearMetric.value.keys()),
    datasets: [
      {
        label: t('common.placeholders.cancel_percent'),
        data: Array.from(percentYearMetric.value.values()),
        backgroundColor: danger,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 28
      }
    ]
  }
  incomeChartData = {
    labels: Array.from(commissionByMonth.value.keys()),
    datasets: [
      {
        label: t('common.placeholders.kpi_commission_income'),
        data: Array.from(commissionByMonth.value.values()),
        backgroundColor: primary,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 24
      },
      {
        label: t('common.placeholders.kpi_monthly_fee_income'),
        data: Array.from(monthlyFeeByMonth.value.values()),
        backgroundColor: dark,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 24
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
  incomeChartOptions.value = makeIncomeOptions(theme.isDark)
})

function setTop5Metric(): void {
  dailyTop5ChartData = {
    labels: Array.from(top5DailyMetric.value.keys()),
    datasets: [{
      indexAxis: 'y',
      label: t('common.placeholders.first_place'),
      data: Array.from(top5DailyMetric.value.values()),
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

<template>
  <div class="container-fluid py-4 px-4 metrics-view">
    <div class="mb-2">
      <p class="metrics-eyebrow text-uppercase font-weight-bolder text-secondary letter-spacing-1 mb-2">{{ t('common.placeholders.kpi_group_service') }}</p>
      <div class="row g-3 metrics-kpi-row">
        <div class="col-6 col-lg-3">
          <div class="card shadow h-100">
            <div class="card-body p-3">
              <div class="d-flex align-items-start justify-content-between mb-2">
                <p class="text-xs text-uppercase font-weight-bolder text-secondary mb-0">{{ t('common.placeholders.kpi_services_month') }}</p>
                <div class="icon icon-shape bg-gradient-info shadow d-flex align-items-center justify-content-center flex-shrink-0 ms-2 border-radius-md">
                  <em class="fas fa-route text-lg text-white"></em>
                </div>
              </div>
              <div class="d-flex align-items-baseline flex-wrap">
                <h5 class="font-weight-bolder mb-0 me-2">{{ servicesCurrentMonth.toLocaleString('es-CO') }}</h5>
                <span v-if="servicesDelta !== null" class="text-sm font-weight-bolder" :class="servicesDelta >= 0 ? 'text-success' : 'text-danger'">
                  <em :class="servicesDelta >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></em>
                  {{ round1(Math.abs(servicesDelta)) }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6 col-lg-3">
          <div class="card shadow h-100">
            <div class="card-body p-3">
              <div class="d-flex align-items-start justify-content-between mb-2">
                <p class="text-xs text-uppercase font-weight-bolder text-secondary mb-0">{{ t('common.placeholders.kpi_completion_rate') }}</p>
                <div class="icon icon-shape bg-gradient-success shadow d-flex align-items-center justify-content-center flex-shrink-0 ms-2 border-radius-md">
                  <em class="fas fa-circle-check text-lg text-white"></em>
                </div>
              </div>
              <div class="d-flex align-items-baseline flex-wrap">
                <h5 class="font-weight-bolder mb-0 me-2">{{ round1(completionRate) }}%</h5>
                <span v-if="completionRateDelta !== null" class="text-sm font-weight-bolder" :class="completionRateDelta >= 0 ? 'text-success' : 'text-danger'">
                  <em :class="completionRateDelta >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></em>
                  {{ round1(Math.abs(completionRateDelta)) }} pp
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6 col-lg-3">
          <div class="card shadow h-100">
            <div class="card-body p-3">
              <div class="d-flex align-items-start justify-content-between mb-2">
                <p class="text-xs text-uppercase font-weight-bolder text-secondary mb-0">{{ t('common.placeholders.kpi_cancellation_rate') }}</p>
                <div class="icon icon-shape bg-gradient-danger shadow d-flex align-items-center justify-content-center flex-shrink-0 ms-2 border-radius-md">
                  <em class="fas fa-ban text-lg text-white"></em>
                </div>
              </div>
              <div class="d-flex align-items-baseline flex-wrap">
                <h5 class="font-weight-bolder mb-0 me-2">{{ round1(cancellationRate) }}%</h5>
                <span v-if="cancellationRateDelta !== null" class="text-sm font-weight-bolder" :class="cancellationRateDelta >= 0 ? 'text-success' : 'text-danger'">
                  <em :class="cancellationRateDelta >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></em>
                  {{ round1(Math.abs(cancellationRateDelta)) }} pp
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6 col-lg-3">
          <div class="card shadow h-100">
            <div class="card-body p-3">
              <div class="d-flex align-items-start justify-content-between mb-2">
                <p class="text-xs text-uppercase font-weight-bolder text-secondary mb-0">{{ t('common.placeholders.kpi_leading_driver') }}</p>
                <div class="icon icon-shape bg-gradient-warning shadow d-flex align-items-center justify-content-center flex-shrink-0 ms-2 border-radius-md">
                  <em class="fas fa-trophy text-lg text-white"></em>
                </div>
              </div>
              <div class="d-flex align-items-baseline flex-wrap">
                <h5 v-if="topDriverOfMonth" class="font-weight-bolder mb-0 me-2">{{ topDriverOfMonth.plate }}</h5>
                <h6 v-else class="font-weight-bolder mb-0 text-muted">{{ t('common.placeholders.kpi_leading_driver_empty') }}</h6>
                <span v-if="topDriverOfMonth" class="text-sm font-weight-bolder text-secondary">
                  {{ topDriverOfMonth.count }} {{ t('common.placeholders.kpi_services_unit') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-3">
      <p class="metrics-eyebrow text-uppercase font-weight-bolder text-secondary letter-spacing-1 mb-2">{{ t('common.placeholders.kpi_group_revenue') }}</p>
      <div class="row g-3 metrics-kpi-row">
        <div class="col-6 col-lg-3">
          <div class="card shadow h-100">
            <div class="card-body p-3">
              <div class="d-flex align-items-start justify-content-between mb-2">
                <p class="text-xs text-uppercase font-weight-bolder text-secondary mb-0">{{ t('common.placeholders.kpi_commission_income') }}</p>
                <div class="icon icon-shape bg-gradient-success shadow d-flex align-items-center justify-content-center flex-shrink-0 ms-2 border-radius-md">
                  <em class="fas fa-percent text-lg text-white"></em>
                </div>
              </div>
              <div class="d-flex align-items-baseline flex-wrap">
                <h5 class="font-weight-bolder mb-0 me-2">{{ formatCurrencyCompact(commissionCurrentMonth) }}</h5>
                <span v-if="commissionDelta !== null" class="text-sm font-weight-bolder" :class="commissionDelta >= 0 ? 'text-success' : 'text-danger'">
                  <em :class="commissionDelta >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></em>
                  {{ round1(Math.abs(commissionDelta)) }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6 col-lg-3">
          <div class="card shadow h-100">
            <div class="card-body p-3">
              <div class="d-flex align-items-start justify-content-between mb-2">
                <p class="text-xs text-uppercase font-weight-bolder text-secondary mb-0">{{ t('common.placeholders.kpi_monthly_fee_income') }}</p>
                <div class="icon icon-shape bg-gradient-dark shadow d-flex align-items-center justify-content-center flex-shrink-0 ms-2 border-radius-md">
                  <em class="fas fa-file-invoice-dollar text-lg text-white"></em>
                </div>
              </div>
              <div class="d-flex align-items-baseline flex-wrap">
                <h5 class="font-weight-bolder mb-0 me-2">{{ formatCurrencyCompact(monthlyFeeCurrentMonth) }}</h5>
                <span v-if="monthlyFeeDelta !== null" class="text-sm font-weight-bolder" :class="monthlyFeeDelta >= 0 ? 'text-success' : 'text-danger'">
                  <em :class="monthlyFeeDelta >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></em>
                  {{ round1(Math.abs(monthlyFeeDelta)) }}%
                </span>
              </div>
              <p class="text-xs text-muted mb-0 mt-1">{{ payingDriverCount }} {{ t('common.placeholders.kpi_paying_drivers') }}</p>
            </div>
          </div>
        </div>

        <div class="col-6 col-lg-3">
          <div class="card shadow h-100">
            <div class="card-body p-3">
              <div class="d-flex align-items-start justify-content-between mb-2">
                <p class="text-xs text-uppercase font-weight-bolder text-secondary mb-0">{{ t('common.placeholders.kpi_cash_collected') }}</p>
                <div class="icon icon-shape bg-gradient-info shadow d-flex align-items-center justify-content-center flex-shrink-0 ms-2 border-radius-md">
                  <em class="fas fa-money-bill-wave text-lg text-white"></em>
                </div>
              </div>
              <div class="d-flex align-items-baseline flex-wrap">
                <h5 class="font-weight-bolder mb-0 me-2">{{ formatCurrencyCompact(rechargeCurrentMonth) }}</h5>
                <span v-if="rechargeDelta !== null" class="text-sm font-weight-bolder" :class="rechargeDelta >= 0 ? 'text-success' : 'text-danger'">
                  <em :class="rechargeDelta >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></em>
                  {{ round1(Math.abs(rechargeDelta)) }}%
                </span>
              </div>
              <p class="text-xs text-muted mb-0 mt-1">{{ rechargeCount }} {{ t('common.placeholders.kpi_recharges_count') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3 mb-3">
      <div class="col-sm-6 col-xxl-4">
        <div class="card shadow">
          <div class="card-header d-flex align-items-center">
            <div class="icon icon-shape icon-sm bg-gradient-info shadow text-center border-radius-md d-flex align-items-center justify-content-center me-2">
              <em class="fas fa-chart-line text-white text-xs"></em>
            </div>
            <h6 class="mb-0 font-weight-bolder">{{ t('common.placeholders.year_service_progress') }}</h6>
            <span v-if="loading" class="spinner-border spinner-border-sm text-info ms-auto" role="status"></span>
          </div>

          <div class="card-body">
            <div class="metrics-legend">
              <span class="metrics-legend-item">
                <span class="metrics-legend-swatch metrics-legend-swatch--square bg-secondary"></span>
                <span class="metrics-legend-label">{{ t('services.total') }}</span>
              </span>
              <span class="metrics-legend-item">
                <span class="metrics-legend-swatch bg-success"></span>
                <span class="metrics-legend-label">{{ t('services.statuses.terminated') }}</span>
              </span>
              <span class="metrics-legend-item">
                <span class="metrics-legend-swatch bg-danger"></span>
                <span class="metrics-legend-label">{{ t('services.statuses.canceled') }}</span>
              </span>
            </div>
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
      <div class="col-sm-6 col-xxl-4">
        <div class="card shadow">
          <div class="card-header d-flex align-items-center">
            <div class="icon icon-shape icon-sm bg-gradient-danger shadow text-center border-radius-md d-flex align-items-center justify-content-center me-2">
              <em class="fas fa-chart-column text-white text-xs"></em>
            </div>
            <h6 class="mb-0 font-weight-bolder">{{ t('common.placeholders.cancel_percent') }}</h6>
          </div>
          <div class="card-body">
            <div class="metrics-legend">
              <span class="metrics-legend-item">
                <span class="metrics-legend-swatch bg-danger"></span>
                <span class="metrics-legend-label">{{ t('common.placeholders.cancel_percent') }}</span>
              </span>
            </div>
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
      <div class="col-sm-6 col-xxl-4">
        <div class="card shadow">
          <div class="card-header d-flex align-items-center">
            <div class="icon icon-shape icon-sm bg-gradient-primary shadow text-center border-radius-md d-flex align-items-center justify-content-center me-2">
              <em class="fas fa-ranking-star text-white text-xs"></em>
            </div>
            <h6 class="mb-0 font-weight-bolder">{{ t('common.placeholders.top5_title') }}</h6>
            <div class="metrics-segment ms-auto" role="group">
              <button
                  type="button"
                  class="metrics-segment__btn"
                  :class="{ 'metrics-segment__btn--active': frequency === TopFrequency.Daily }"
                  @click="frequency = TopFrequency.Daily"
              >{{ t('common.placeholders.top5_period_day') }}</button>
              <button
                  type="button"
                  class="metrics-segment__btn"
                  :class="{ 'metrics-segment__btn--active': frequency === TopFrequency.Weekly }"
                  @click="frequency = TopFrequency.Weekly"
              >{{ t('common.placeholders.top5_period_week') }}</button>
              <button
                  type="button"
                  class="metrics-segment__btn"
                  :class="{ 'metrics-segment__btn--active': frequency === TopFrequency.Monthly }"
                  @click="frequency = TopFrequency.Monthly"
              >{{ t('common.placeholders.top5_period_month') }}</button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="isTopLoaded">
              <p v-if="top5Ranked.length === 0" class="text-xs text-muted mb-0">{{ t('common.placeholders.top5_empty') }}</p>
              <div v-else class="metrics-top5-list">
                <div v-for="(item, index) in top5Ranked" :key="item.plate" class="metrics-top5-row">
                  <span class="metrics-top5-rank" :class="{ 'metrics-top5-rank--first': index === 0 }">{{ index + 1 }}</span>
                  <span class="metrics-top5-plate">{{ item.plate }}</span>
                  <div class="metrics-top5-track">
                    <div class="metrics-top5-fill" :style="{ width: top5BarWidth(item.count) + '%', opacity: 1 - index * 0.15 }"></div>
                  </div>
                  <span class="metrics-top5-count">{{ item.count }}</span>
                </div>
              </div>
            </div>
            <div v-else class="d-flex justify-content-center">
              <em class="fa-solid fa-spinner fa-10x circle"></em>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-lg-7">
        <div class="card shadow h-100">
          <div class="card-header d-flex align-items-center">
            <div class="icon icon-shape icon-sm bg-gradient-success shadow text-center border-radius-md d-flex align-items-center justify-content-center me-2">
              <em class="fas fa-sack-dollar text-white text-xs"></em>
            </div>
            <h6 class="mb-0 font-weight-bolder">{{ t('common.placeholders.income_by_charge_type') }}</h6>
          </div>
          <div class="card-body">
            <div class="metrics-legend">
              <span class="metrics-legend-item">
                <span class="metrics-legend-swatch bg-success"></span>
                <span class="metrics-legend-label">{{ t('common.placeholders.income_series_commission') }}</span>
              </span>
              <span class="metrics-legend-item">
                <span class="metrics-legend-swatch metrics-legend-swatch--dark-navy"></span>
                <span class="metrics-legend-label">{{ t('common.placeholders.income_series_monthly_fee') }}</span>
              </span>
            </div>
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
      <div class="col-lg-5">
        <div class="card shadow h-100">
          <div class="card-header d-flex align-items-center">
            <div class="icon icon-shape icon-sm metrics-icon-slate shadow text-center border-radius-md d-flex align-items-center justify-content-center me-2">
              <em class="fas fa-scale-balanced text-white text-xs"></em>
            </div>
            <h6 class="mb-0 font-weight-bolder">{{ t('common.placeholders.income_breakdown') }}</h6>
          </div>
          <div class="card-body">
            <div class="metrics-revenue-list">
              <div class="metrics-revenue-row">
                <div class="d-flex justify-content-between align-items-baseline mb-1">
                  <div>
                    <div class="metrics-revenue-label">{{ t('common.placeholders.income_series_commission') }}</div>
                  </div>
                  <div class="text-end">
                    <div class="metrics-revenue-value">{{ formatCurrency(commissionCurrentMonth) }}</div>
                    <div class="metrics-revenue-pct">{{ revenueBreakdown.commissionPct }}%</div>
                  </div>
                </div>
                <div class="metrics-revenue-track">
                  <div class="metrics-revenue-fill bg-success" :style="{ width: revenueBreakdown.commissionPct + '%' }"></div>
                </div>
              </div>

              <div class="metrics-revenue-row">
                <div class="d-flex justify-content-between align-items-baseline mb-1">
                  <div>
                    <div class="metrics-revenue-label">{{ t('common.placeholders.income_series_monthly_fee') }}</div>
                    <div class="metrics-revenue-sub">{{ payingDriverCount }} {{ t('common.placeholders.kpi_paying_drivers') }}</div>
                  </div>
                  <div class="text-end">
                    <div class="metrics-revenue-value">{{ formatCurrency(monthlyFeeCurrentMonth) }}</div>
                    <div class="metrics-revenue-pct">{{ revenueBreakdown.monthlyFeePct }}%</div>
                  </div>
                </div>
                <div class="metrics-revenue-track">
                  <div class="metrics-revenue-fill metrics-revenue-fill--dark-navy" :style="{ width: revenueBreakdown.monthlyFeePct + '%' }"></div>
                </div>
              </div>

              <div class="metrics-revenue-row">
                <div class="d-flex justify-content-between align-items-baseline mb-1">
                  <div>
                    <div class="metrics-revenue-label">{{ t('common.placeholders.kpi_cash_collected') }}</div>
                    <div class="metrics-revenue-sub">{{ rechargeCount }} {{ t('common.placeholders.kpi_recharges_count') }}</div>
                  </div>
                  <div class="text-end">
                    <div class="metrics-revenue-value">{{ formatCurrency(rechargeCurrentMonth) }}</div>
                    <div class="metrics-revenue-pct">{{ revenueBreakdown.rechargePct }}%</div>
                  </div>
                </div>
                <div class="metrics-revenue-track">
                  <div class="metrics-revenue-fill bg-info" :style="{ width: revenueBreakdown.rechargePct + '%' }"></div>
                </div>
              </div>

              <hr class="metrics-revenue-divider" />

              <div class="d-flex justify-content-between align-items-baseline">
                <span class="metrics-revenue-total-label">{{ t('common.placeholders.income_total') }}</span>
                <span class="metrics-revenue-total-value">{{ formatCurrency(revenueBreakdown.total) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Bar, Line} from 'vue-chartjs'
import {computed, onBeforeMount, ref, Ref, watch} from 'vue'
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

function formatCurrencyCompact(value: number): string {
  if (value >= 1000000) {
    const millions = Math.round(value / 100000) / 10
    return `$${millions.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`
  }
  return `$${Math.round(value).toLocaleString('es-CO')}`
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
      legend: { display: false },
      title: { color: labelColor(isDark) }
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
      legend: { display: false }
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
      legend: { display: false }
    }
  }
}

const percentChartOptions = ref<ChartOptions>(makePercentOptions(theme.isDark))
const chartOptions = ref<ChartOptions>(makeLineOptions(theme.isDark))
const incomeChartOptions = ref<ChartOptions>(makeIncomeOptions(theme.isDark))
const isLoaded: Ref<boolean> = ref(false)
const isTopLoaded: Ref<boolean> = ref(false)
const frequency = ref<TopFrequency>(TopFrequency.Daily)

let globalChartData: ChartData
let percentChartData: ChartData
let incomeChartData: ChartData

const top5Ranked = computed(() => Array.from(top5DailyMetric.value.entries())
  .map(([plate, count]) => ({ plate, count }))
  .sort((a, b) => b.count - a.count))

const top5Max = computed(() => {
  const counts = top5Ranked.value.map(item => item.count)
  return counts.length ? Math.max(...counts) : 0
})

function top5BarWidth(count: number): number {
  if (top5Max.value <= 0) return 0
  return (count / top5Max.value) * 100
}

const revenueBreakdown = computed(() => {
  const commission = commissionCurrentMonth.value
  const monthlyFee = monthlyFeeCurrentMonth.value
  const recharge = rechargeCurrentMonth.value
  const total = commission + monthlyFee + recharge
  const pct = (value: number) => total > 0 ? Math.round((value / total) * 100) : 0
  return {
    commissionPct: pct(commission),
    monthlyFeePct: pct(monthlyFee),
    rechargePct: pct(recharge),
    total,
  }
})

watch(frequency, async () => {
  isTopLoaded.value = false
  await getTop5Metric(frequency.value)
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
        label: t('common.placeholders.income_series_commission'),
        data: Array.from(commissionByMonth.value.values()),
        backgroundColor: success,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 24
      },
      {
        label: t('common.placeholders.income_series_monthly_fee'),
        data: Array.from(monthlyFeeByMonth.value.values()),
        backgroundColor: dark,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 24
      }
    ]
  }
})

// React to theme changes to update chart options
watch(() => theme.effective, (/*mode*/) => {
  chartOptions.value = makeLineOptions(theme.isDark)
  percentChartOptions.value = makePercentOptions(theme.isDark)
  incomeChartOptions.value = makeIncomeOptions(theme.isDark)
})
</script>

<style scoped>
.metrics-eyebrow {
  font-size: 0.7rem;
}

.metrics-view {
  --metrics-muted-surface: var(--surface-input);
  --metrics-active-surface: var(--surface-card);
  --metrics-heading: var(--text-heading);
  --metrics-secondary: var(--text-secondary);
  --metrics-shadow: var(--shadow-sm);
  --metrics-border: var(--border-subtle);
  --metrics-accent-gradient: var(--gradient-primary);
}
body.dark-version .metrics-view {
  --metrics-muted-surface: var(--surface-input);
  --metrics-active-surface: var(--surface-card);
  --metrics-heading: var(--text-heading);
  --metrics-secondary: var(--text-secondary);
  --metrics-shadow: var(--shadow-sm);
  --metrics-border: var(--border-subtle);
}

.metrics-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.9rem;
}
.metrics-legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.metrics-legend-swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex: none;
}
.metrics-legend-swatch--square {
  border-radius: 2px;
}
.metrics-legend-swatch--dark-navy {
  background-color: #3a416f;
}
.metrics-legend-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--metrics-secondary);
}

.metrics-icon-slate {
  background: linear-gradient(310deg, #627594, #a8b8d8);
}

.metrics-segment {
  display: flex;
  gap: 2px;
  padding: 2px;
  border-radius: 0.5rem;
  background-color: var(--metrics-muted-surface);
}
.metrics-segment__btn {
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  padding: 0.32rem 0.6rem;
  font-size: 0.68rem;
  font-weight: 700;
  background-color: transparent;
  color: var(--metrics-secondary);
  transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}
.metrics-segment__btn--active {
  background-color: var(--metrics-active-surface);
  color: var(--metrics-heading);
  box-shadow: var(--metrics-shadow);
}

.metrics-top5-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.metrics-top5-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.metrics-top5-rank {
  width: 22px;
  height: 22px;
  flex: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  background-color: var(--metrics-muted-surface);
  color: var(--metrics-secondary);
}
.metrics-top5-rank--first {
  background: var(--metrics-accent-gradient);
  color: #ffffff;
}
.metrics-top5-plate {
  width: 62px;
  flex: none;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--metrics-heading);
  letter-spacing: 0.02em;
}
.metrics-top5-track {
  flex: 1;
  height: 8px;
  border-radius: 50rem;
  background-color: var(--metrics-muted-surface);
  overflow: hidden;
}
.metrics-top5-fill {
  height: 100%;
  border-radius: 50rem;
  background: var(--metrics-accent-gradient);
}
.metrics-top5-count {
  width: 30px;
  flex: none;
  text-align: right;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--metrics-secondary);
}

.metrics-revenue-list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
.metrics-revenue-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--metrics-heading);
}
.metrics-revenue-sub {
  font-size: 0.68rem;
  color: var(--metrics-secondary);
}
.metrics-revenue-value {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--metrics-heading);
}
.metrics-revenue-pct {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--metrics-secondary);
}
.metrics-revenue-track {
  height: 7px;
  border-radius: 50rem;
  background-color: var(--metrics-muted-surface);
  overflow: hidden;
}
.metrics-revenue-fill {
  height: 100%;
  border-radius: 50rem;
}
.metrics-revenue-fill--dark-navy {
  background-color: #3a416f;
}
.metrics-revenue-divider {
  border: none;
  border-top: 1px solid var(--metrics-border);
  margin: 0.15rem 0 0.6rem;
  opacity: 1;
}
.metrics-revenue-total-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--metrics-secondary);
}
.metrics-revenue-total-value {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--metrics-heading);
}
</style>

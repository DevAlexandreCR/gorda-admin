import {defineStore} from 'pinia'
import {Metric, RevenuePeriod} from '@/types/Metric'
import DateHelper from '@/helpers/DateHelper'
import {MetricItem} from '@/types/MetricItem'
import {ServiceStatus} from '@/types/ServiceStatus'
import MetricRepository from '@/repositories/MetricRepository'
import { useDriversStore } from './DriversStore'
import { TopFrequency } from '@/constants/TopFrequency'

/**
 * Month-over-month percent delta, guarded against a zero/absent previous value.
 * Shared across revenue and service KPI getters so none of them ever surface NaN/Infinity.
 */
export function calculateMonthOverMonthDelta(current: number, previous: number): number | null {
	if (!previous) return null
	return ((current - previous) / previous) * 100
}

function findRevenuePeriod(periods: RevenuePeriod[], period: string): RevenuePeriod | undefined {
	return periods.find((entry) => entry.period === period)
}

export const useMetricsStore = defineStore('metricsStore', {
	state: () => {
		return {
			globalMetric: Array<Metric>(),
			globalYearMetric: new Map<string, number>(),
			completedYearMetric: new Map<string, number>(),
			canceledYearMetric: new Map<string, number>(),
			percentYearMetric: new Map<string, number>(),
			top5DailyMetric: new Map<string, number>(),
			top5MonthlyMetric: new Map<string, number>(),
			revenueMetric: Array<RevenuePeriod>(),
			commissionByMonth: new Map<string, number>(),
			monthlyFeeByMonth: new Map<string, number>(),
			loaded: false,
			loading: false
		}
	},
	getters: {
		commissionCurrentMonth: (state): number =>
			findRevenuePeriod(state.revenueMetric, DateHelper.stringNow('YYYY-MM'))?.commissionSum ?? 0,
		commissionDelta: (state): number | null => {
			const current = findRevenuePeriod(state.revenueMetric, DateHelper.stringNow('YYYY-MM'))?.commissionSum ?? 0
			const previous = findRevenuePeriod(state.revenueMetric, DateHelper.previousPeriod('YYYY-MM'))?.commissionSum ?? 0
			return calculateMonthOverMonthDelta(current, previous)
		},
		monthlyFeeCurrentMonth: (state): number =>
			findRevenuePeriod(state.revenueMetric, DateHelper.stringNow('YYYY-MM'))?.monthlyFeeSum ?? 0,
		monthlyFeeDelta: (state): number | null => {
			const current = findRevenuePeriod(state.revenueMetric, DateHelper.stringNow('YYYY-MM'))?.monthlyFeeSum ?? 0
			const previous = findRevenuePeriod(state.revenueMetric, DateHelper.previousPeriod('YYYY-MM'))?.monthlyFeeSum ?? 0
			return calculateMonthOverMonthDelta(current, previous)
		},
		payingDriverCount: (state): number =>
			findRevenuePeriod(state.revenueMetric, DateHelper.stringNow('YYYY-MM'))?.payingDriverCount ?? 0,
		rechargeCurrentMonth: (state): number =>
			findRevenuePeriod(state.revenueMetric, DateHelper.stringNow('YYYY-MM'))?.rechargeSum ?? 0,
		rechargeDelta: (state): number | null => {
			const current = findRevenuePeriod(state.revenueMetric, DateHelper.stringNow('YYYY-MM'))?.rechargeSum ?? 0
			const previous = findRevenuePeriod(state.revenueMetric, DateHelper.previousPeriod('YYYY-MM'))?.rechargeSum ?? 0
			return calculateMonthOverMonthDelta(current, previous)
		},
		rechargeCount: (state): number =>
			findRevenuePeriod(state.revenueMetric, DateHelper.stringNow('YYYY-MM'))?.rechargeCount ?? 0,

		servicesCurrentMonth: (state): number =>
			state.globalYearMetric.get(DateHelper.stringNow('YYYY-MMM')) ?? 0,
		servicesDelta: (state): number | null => {
			const current = state.globalYearMetric.get(DateHelper.stringNow('YYYY-MMM')) ?? 0
			const previous = state.globalYearMetric.get(DateHelper.previousPeriod('YYYY-MMM')) ?? 0
			return calculateMonthOverMonthDelta(current, previous)
		},
		completionRate: (state): number => {
			const key = DateHelper.stringNow('YYYY-MMM')
			const total = state.globalYearMetric.get(key) ?? 0
			const completed = state.completedYearMetric.get(key) ?? 0
			return total ? (completed / total) * 100 : 0
		},
		completionRateDelta: (state): number | null => {
			const currentKey = DateHelper.stringNow('YYYY-MMM')
			const previousKey = DateHelper.previousPeriod('YYYY-MMM')
			const previousTotal = state.globalYearMetric.get(previousKey) ?? 0
			if (!previousTotal) return null
			const currentTotal = state.globalYearMetric.get(currentKey) ?? 0
			const currentRate = currentTotal ? ((state.completedYearMetric.get(currentKey) ?? 0) / currentTotal) * 100 : 0
			const previousRate = ((state.completedYearMetric.get(previousKey) ?? 0) / previousTotal) * 100
			return currentRate - previousRate
		},
		cancellationRate: (state): number => {
			const key = DateHelper.stringNow('YYYY-MMM')
			const total = state.globalYearMetric.get(key) ?? 0
			const canceled = state.canceledYearMetric.get(key) ?? 0
			return total ? (canceled / total) * 100 : 0
		},
		cancellationRateDelta: (state): number | null => {
			const currentKey = DateHelper.stringNow('YYYY-MMM')
			const previousKey = DateHelper.previousPeriod('YYYY-MMM')
			const previousTotal = state.globalYearMetric.get(previousKey) ?? 0
			if (!previousTotal) return null
			const currentTotal = state.globalYearMetric.get(currentKey) ?? 0
			const currentRate = currentTotal ? ((state.canceledYearMetric.get(currentKey) ?? 0) / currentTotal) * 100 : 0
			const previousRate = ((state.canceledYearMetric.get(previousKey) ?? 0) / previousTotal) * 100
			return currentRate - previousRate
		},
		topDriverOfMonth: (state): { plate: string; count: number } | null => {
			let leader: { plate: string; count: number } | null = null
			state.top5MonthlyMetric.forEach((count, plate) => {
				if (!leader || count > leader.count) {
					leader = { plate, count }
				}
			})
			return leader
		}
	},
	actions: {
		getGlobalMetric(startDate: string, endDate: string): Promise<void> {
			this.loading = true
			const lastMetricQuery = sessionStorage.getItem('lastMetricQuery')
			this.globalMetric.splice(0, this.globalMetric.length)

			if (this.metricWasQueryedToday(lastMetricQuery as string)) {
				const storedMetrics = sessionStorage.getItem('globalMetric')
				if (storedMetrics) {
					const parsedMetrics = JSON.parse(storedMetrics) as Metric[]
					parsedMetrics.forEach((metric) => {
						this.globalMetric.push(metric)
					})
					this.loaded = true
					this.loading = false
					return Promise.resolve()
				} else {
					this.loaded = false
					this.loading = true
				}
			}

			return new Promise((resolve, reject) => {
				MetricRepository.getGlobal(startDate, endDate).then((metrics) => {
					this.setMetricQueryToday('lastMetricQuery')
					this.loading = false
					this.loaded = true
					metrics.forEach((metric: Metric) => {
						this.globalMetric.push(metric)
					})
					sessionStorage.setItem('globalMetric', JSON.stringify(this.globalMetric))
					resolve()
				}).catch(e => {
					this.loading = false
					console.log(e.message)
					reject(e)
				})
			})
		},
		async getCurrentYearMetric(): Promise<void> {
			const monthLastYear = DateHelper.lastYear()
			const currentMonth = DateHelper.stringNow()
			this.loading = true
			await this.getGlobalMetric(monthLastYear, currentMonth)
			this.loading = false
			this.groupAndSumByMonth()
		},
		groupAndSumByMonth(): void {
			const globalData: MetricItem[] = []
			const canceledData: MetricItem[] = []
			const completedData: MetricItem[] = []
			this.globalMetric.forEach((metric: Metric) => {
				const metricItem: MetricItem = {
					date: metric.date,
					amount: metric.count
				}
				if (metric.status === ServiceStatus.Terminated) completedData.push(metricItem)
				else canceledData.push(metricItem)
				globalData.push(metricItem)
			})
			this.setMapMetric(globalData, this.globalYearMetric)
			this.setMapMetric(canceledData, this.canceledYearMetric)
			this.setMapMetric(completedData, this.completedYearMetric)
			this.globalYearMetric.forEach((value, month) => {
				const canceledCount = this.canceledYearMetric.get(month)	?? 0
				const percent = Math.round((canceledCount/value) * 100)
				this.percentYearMetric.set(month, percent)
			})
		},
		
		setMapMetric(data: MetricItem[], metric: Map<string, number>): void {
			data.forEach((item) => {
				const key = DateHelper.getDayjsFromDate(item.date).format('YYYY-MMM')
				
				if (metric.has(key)) {
					const amount = metric.get(key) ?? 0
					metric.set(key, amount + item.amount);
				} else {
					metric.set(key, item.amount);
				}
			})
		},

		mapDriversToPlates(metrics: Map<string, number>): Map<string, number> {
			const { findById } = useDriversStore()
			const result = new Map<string, number>()
			metrics.forEach((count, driverId) => {
				const driver = findById(driverId)
				if (driver) {
					const key = driver.selected_vehicle?.plate || driver.active_vehicle_id || driverId
					result.set(key, count)
				}
			})
			return result
		},

		async getTop5Metric(frequency: TopFrequency): Promise<void> {
			this.loading = true
			this.top5DailyMetric.clear()
			const lastWeeklyMetricQuery = sessionStorage.getItem('lastWeeklyMetricQuery')

			if (frequency === TopFrequency.Weekly && this.metricWasQueryedToday(lastWeeklyMetricQuery as string)) {
				const storedMetrics = sessionStorage.getItem('top5WeeklyMetric')
				if (storedMetrics) {
					const parsedMetrics = JSON.parse(storedMetrics) as [string, number][]
					parsedMetrics.forEach(([key, value]) => {
						this.top5DailyMetric.set(key, value)
					})
					this.loading = false
					return Promise.resolve()
				} else {
					this.loading = true
				}
			}

			let from = DateHelper.startOfDayUnix()
			let apiFrequency: 'daily' | 'weekly' | 'monthly' = 'daily'
			if (frequency === TopFrequency.Weekly) {
				from = DateHelper.startOfWeekUnix()
				apiFrequency = 'weekly'
			} else if (frequency === TopFrequency.Monthly) {
				from = DateHelper.startOfMonthUnix()
				apiFrequency = 'monthly'
			}
			const endOfDay = DateHelper.endOfDayUnix()
			const metrics = await MetricRepository.getTopDrivers(from, endOfDay, apiFrequency)
			this.loading = false

			this.mapDriversToPlates(metrics).forEach((count, key) => {
				this.top5DailyMetric.set(key, count)
			})

			if (frequency === TopFrequency.Weekly) {
				this.setMetricQueryToday('lastWeeklyMetricQuery')
				sessionStorage.setItem('top5WeeklyMetric', JSON.stringify(Array.from(this.top5DailyMetric.entries())))
			}
		},

		/**
		 * Dedicated monthly fetch for the leading-driver KPI card, independent of the
		 * Day/Week/Month top-5 toggle so switching frequency never clears the leader.
		 */
		async getTop5MonthlyMetric(): Promise<void> {
			const from = DateHelper.startOfMonthUnix()
			const endOfDay = DateHelper.endOfDayUnix()
			const metrics = await MetricRepository.getTopDrivers(from, endOfDay, 'monthly')
			this.top5MonthlyMetric.clear()
			this.mapDriversToPlates(metrics).forEach((count, key) => {
				this.top5MonthlyMetric.set(key, count)
			})
		},

		getRevenueMetric(from: string, to: string): Promise<void> {
			this.loading = true
			const lastRevenueQuery = sessionStorage.getItem('lastRevenueQuery')
			this.revenueMetric.splice(0, this.revenueMetric.length)

			if (this.metricWasQueryedToday(lastRevenueQuery as string)) {
				const storedRevenue = sessionStorage.getItem('revenueMetric')
				if (storedRevenue) {
					const parsedRevenue = JSON.parse(storedRevenue) as RevenuePeriod[]
					parsedRevenue.forEach((period) => {
						this.revenueMetric.push(period)
					})
					this.loaded = true
					this.loading = false
					return Promise.resolve()
				} else {
					this.loaded = false
					this.loading = true
				}
			}

			return new Promise((resolve, reject) => {
				MetricRepository.getRevenue(from, to).then((periods) => {
					this.setMetricQueryToday('lastRevenueQuery')
					this.loading = false
					this.loaded = true
					periods.forEach((period: RevenuePeriod) => {
						this.revenueMetric.push(period)
					})
					sessionStorage.setItem('revenueMetric', JSON.stringify(this.revenueMetric))
					resolve()
				}).catch(e => {
					this.loading = false
					console.log(e.message)
					reject(e)
				})
			})
		},

		async getYearRevenueMetric(): Promise<void> {
			const from = DateHelper.lastYear('YYYY-MM')
			const to = DateHelper.stringNow('YYYY-MM')
			this.loading = true
			await this.getRevenueMetric(from, to)
			this.loading = false
			this.groupRevenueByMonth()
		},

		groupRevenueByMonth(): void {
			this.commissionByMonth.clear()
			this.monthlyFeeByMonth.clear()
			this.revenueMetric.forEach((period: RevenuePeriod) => {
				const key = DateHelper.getDayjsFromDate(period.period, 'YYYY-MM').format('YYYY-MMM')
				this.commissionByMonth.set(key, period.commissionSum)
				this.monthlyFeeByMonth.set(key, period.monthlyFeeSum)
			})
		},

		setMetricQueryToday(query: string): void {
			sessionStorage.setItem(query, DateHelper.stringNow())
		},

		metricWasQueryedToday(query: string): boolean {
			const today = DateHelper.stringNow()
			return query === today
		}
	},
})

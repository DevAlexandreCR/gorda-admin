import {defineStore} from 'pinia'
import axios from 'axios'
import {Metric} from '@/types/Metric'
import DateHelper from '@/helpers/DateHelper'
import {MetricItem} from '@/types/MetricItem'
import {ServiceStatus} from '@/types/ServiceStatus'
import {useLoadingState} from '@/services/stores/LoadingState'
import MetricRepository from '@/repositories/MetricRepository'
import { useDriversStore } from './DriversStore'
import { TopFrequency } from '@/constants/TopFrequency'

const GLOBAL_METRIC_PATH = '/metrics/global'

export const useMetricsStore = defineStore('metricsStore', {
	state: () => {
		return {
			globalMetric: Array<Metric>(),
			globalYearMetric: new Map<string, number>(),
			completedYearMetric: new Map<string, number>(),
			canceledYearMetric: new Map<string, number>(),
			percentYearMetric: new Map<string, number>(),
			top5DailyMetric: new Map<string, number>(),
			loaded: false,
			loading: false
		}
	},
	actions: {
		getGlobalMetric(startDate: string, endDate: string): Promise<void> {
			const { setLoading } = useLoadingState()
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
					return Promise.resolve()
				} else {
					this.loaded = false
					this.loading = true
				}
			}

			return new Promise((resolve, reject) => {
				setLoading(true)
				axios.get(process.env.VUE_APP_GORDA_API_URL + GLOBAL_METRIC_PATH, {
					params: {
						startDate: startDate,
						endDate: endDate,
					},
				}).then((res) => {
					this.setMetricQueryToday('lastMetricQuery')
					setLoading(false)
					this.loading = false
					this.loaded = true
					res.data.data.forEach((metric: Metric) => {
						this.globalMetric.push(metric)
					})
					sessionStorage.setItem('globalMetric', JSON.stringify(this.globalMetric))
					resolve()
				}).catch(e => {
					this.loading = false
					setLoading(false)
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

			const { findById } = useDriversStore()
			let from = DateHelper.startOfDayUnix()
			if (frequency === TopFrequency.Weekly) {
				from = DateHelper.startOfWeekUnix()
			}
			const endOfDay = DateHelper.endOfDayUnix()
			const metrics = await MetricRepository.getDailyTopFive(from, endOfDay)
			this.loading = false
				
			Array.from(metrics.entries()).forEach(([driverId, metric]) => {
				const driver = findById(driverId)
				if (driver) this.top5DailyMetric.set(driver.vehicle.plate, metric.count)
			})
			
			if (frequency === TopFrequency.Weekly) {
				this.setMetricQueryToday('lastWeeklyMetricQuery')
				sessionStorage.setItem('top5WeeklyMetric', JSON.stringify(Array.from(this.top5DailyMetric.entries())))
			}
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
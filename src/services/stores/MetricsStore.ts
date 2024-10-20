import {defineStore} from 'pinia'
import axios from 'axios'
import {Metric} from '@/types/Metric'
import DateHelper from '@/helpers/DateHelper'
import {MetricItem} from '@/types/MetricItem'
import {ServiceStatus} from '@/types/ServiceStatus'
import {useLoadingState} from '@/services/stores/LoadingState'
import { get } from 'firebase/database'
import MetricRepository from '@/repositories/MetricRepository'
import { useDriversStore } from './DriversStore'

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
			top5WeeklyMetric: new Map<string, number>(),
			loaded: false,
		}
	},
	actions: {
		getGlobalMetric(startDate: string, endDate: string): Promise<void> {
			const {setLoading} = useLoadingState()
			return new Promise((resolve, reject) => {
				setLoading(true)
				axios.get(process.env.VUE_APP_GORDA_API_URL + GLOBAL_METRIC_PATH, {
					params: {
						startDate: startDate,
						endDate: endDate,
					},
				}).then((res) => {
					setLoading(false)
					this.loaded = true
					res.data.data.forEach((metric: Metric) => {
						this.globalMetric.push(metric)
					})
					resolve()
				}).catch(e => {
					setLoading(false)
					console.log(e.message)
					reject(e)
				})
			})
		},
		async getCurrentYearMetric(): Promise<void> {
			const monthLastYear = DateHelper.lastYear()
			const currentMonth = DateHelper.stringNow()
			await this.getGlobalMetric(monthLastYear, currentMonth)
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

		async getTop5DailyMetric(): Promise<void> {
			const { findById } = useDriversStore()
			
			const startOfDay = DateHelper.startOfDayUnix()
			const endOfDay = DateHelper.endOfDayUnix()
			const metrics = await MetricRepository.getDailyTopFive(startOfDay, endOfDay)
				
			Array.from(metrics.entries()).forEach(([driverId, metric]) => {
				const driver = findById(driverId)
				if (driver) this.top5DailyMetric.set(driver.vehicle.plate, metric.count)
			})
		}
	},
})
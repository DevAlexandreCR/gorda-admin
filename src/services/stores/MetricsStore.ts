import {defineStore} from 'pinia'
import axios from 'axios'
import {Metric} from '@/types/Metric'

const GLOBAL_METRIC_PATH = 'metrics/global'

export const useMetricsStore = defineStore('metricsStore', {
	state: () => {
		return {
			globalMetric: Array<Metric>()
		}
	},
	actions: {
		getGlobalMetric(startDate: string, endDate: string): Promise<void> {
			return new Promise((resolve, reject) => {
				axios.get(process.env.VUE_APP_GORDA_API_URL + GLOBAL_METRIC_PATH, {
					params: {
						startDate: startDate,
						endDate: endDate
					}
				}).then((res) => {
					console.log(res.data)
					res.data.forEach((metric: Metric) => {
						this.globalMetric.push(metric)
					})
					resolve()
				}).catch(e => {
					console.log(e.message)
					reject(e)
				})
			})
		}
	}
})
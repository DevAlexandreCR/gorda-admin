import {ServiceStatus} from '@/types/ServiceStatus'
import {MetricType} from '@/types/MetricType'

export type Metric = {
	date: string
	type: MetricType
	status: ServiceStatus
	count: number
}

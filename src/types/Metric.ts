import {ServiceStatus} from '@/types/ServiceStatus'
import {MetricType} from '@/types/MetricType'

export type Metric = {
	date: string
	type: MetricType
	status: ServiceStatus
	count: number
}

export type RevenuePeriod = {
	period: string
	commissionSum: number
	monthlyFeeSum: number
	payingDriverCount: number
	rechargeSum: number
	rechargeCount: number
}

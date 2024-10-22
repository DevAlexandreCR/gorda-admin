import { ServiceInterface } from '@/types/ServiceInterface'
import FSService from '@/services/FSService'
import {
	getDocs as get,
	query as queryFS,
	Query,
	where,
} from 'firebase/firestore'
import { Metric } from '@/types/Metric'
import { MetricType } from '@/types/MetricType'
import { ServiceStatus } from '@/types/ServiceStatus'

class MetricRepository {

	/* istanbul ignore next */
	async getDailyTopFive(from: number, to: number): Promise<Map<string, Metric>> {
		const query = this.betweenDate(from, to)
		const snapshot = await get(this.byStatus('terminated', query))

		const driverServiceCount = new Map<string, number>()

		snapshot.forEach((doc) => {
			const service = <ServiceInterface>doc.data()
			const driverId = service.driver_id ?? 'non-driver'

			if (driverServiceCount.has(driverId)) {
				driverServiceCount.set(driverId, (driverServiceCount.get(driverId) ?? 0) + 1)
			} else {
				driverServiceCount.set(driverId, 1)
			}
		})

		const topFive = new Map<string, Metric>()

		Array.from(driverServiceCount.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.forEach(([driverId, count]) => {
				const metric: Metric = {
					date: new Date().toISOString(),
					type: MetricType.Top_Five_Daily,
					status: ServiceStatus.Terminated,
					count: count
				}
				topFive.set(driverId, metric)
			})

		return topFive
	}

	/* istanbul ignore next */
	betweenDate(from: number, to: number, query?: Query): Query {
		if (query === undefined) query = FSService.servicesCollection()
		return queryFS(query,
			where('created_at', '>=', from),
			where('created_at', '<=', to)
		);
	}

	/* istanbul ignore next */
	byStatus(status: string, query?: Query): Query {
		if (query === undefined) query = FSService.servicesCollection()
		return queryFS(query,
			where('status', '==', status)
		);
	}
}

export default new MetricRepository()
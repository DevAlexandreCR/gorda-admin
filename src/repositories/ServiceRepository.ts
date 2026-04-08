import {
	child,
	DataSnapshot,
	equalTo,
	get,
	onChildAdded,
	onChildChanged,
	onChildRemoved,
	orderByChild,
	push,
	query,
	ref,
	set,
	update as updateDB,
	remove,
} from 'firebase/database'
import DBService from '@/services/DBService'
import { ServiceInterface } from '@/types/ServiceInterface'
import Service from '@/models/Service'
import AuthService from '@/services/AuthService'
import { ServiceCursor } from '@/types/ServiceCursor'
import {LocationType} from '@/types/LocationType'
import serverApi, { ApiResponse } from '@/services/gordaApi/server/ServerApi'

type HistoryPageResponse = {
	services: Service[]
	totalCount: number
	terminatedCount: number
	canceledCount: number
}

class ServiceRepository {

	/* istanbul ignore next */
	async getService(id: string): Promise<ServiceInterface> {
		const snapshot: DataSnapshot = await get(child(DBService.dbServices(), id))
		return <ServiceInterface>snapshot.val()
	}

	/* istanbul ignore next */
	async getHistoryPage(options: {
		from: number
		to: number
		driverId: string | null
		clientId: string | null
		perPage: number
		cursor: ServiceCursor
		next: boolean
	}): Promise<HistoryPageResponse> {
		const hasCursor = options.cursor.id !== '' && options.cursor.created > 0
		const response = await serverApi.get<ApiResponse<{
			services: Service[]
			totalCount: number
			terminatedCount: number
			canceledCount: number
		}>>('/services/history', {
			params: {
				from: options.from,
				to: options.to,
				driverId: options.driverId ?? undefined,
				clientId: options.clientId ?? undefined,
				perPage: options.perPage,
				cursorCreated: hasCursor ? options.cursor.created : undefined,
				cursorId: hasCursor ? options.cursor.id : undefined,
				direction: options.next ? 'next' : 'prev',
			},
		})

		const services = response.data.data.services.map((payload) => {
			const service = new Service()
			Object.assign(service, payload)
			return service
		})

		return {
			services,
			totalCount: response.data.data.totalCount,
			terminatedCount: response.data.data.terminatedCount,
			canceledCount: response.data.data.canceledCount,
		}
	}

	/* istanbul ignore next */
	async getPaginated(options: {
		from: number
		to: number
		driverId: string | null
		clientId: string | null
		perPage: number
		cursor: ServiceCursor
		next: boolean
	}, _contain = false): Promise<Array<Service>> {
		const response = await this.getHistoryPage(options)
		return response.services
	}

	/* istanbul ignore next */
	async getCount(
		from: number,
		to: number,
		clientId: string | null,
		driverId?: string | null,
		status: string | null = null
	): Promise<number> {
		const response = await this.getHistoryPage({
			from,
			to,
			driverId: driverId ?? null,
			clientId,
			perPage: 1,
			cursor: {
				id: '',
				created: 0,
			},
			next: true,
		})

		if (status === Service.STATUS_TERMINATED) {
			return response.terminatedCount
		}

		if (status === Service.STATUS_CANCELED) {
			return response.canceledCount
		}

		return response.totalCount
	}

	/* istanbul ignore next */
	update(service: ServiceInterface): Promise<void> {
		if (!service.id) return Promise.reject(new Error('Id is necessary'))
		return set(ref(DBService.db, 'services/'.concat(service.id)), service)
	}

	/* istanbul ignore next */
	updateStartLocation(serviceId: string, startLocation: LocationType): Promise<void> {
		if (!serviceId) return Promise.reject(new Error('Id is necessary'))
		return updateDB(child(DBService.dbServices(), serviceId), {
			start_loc: startLocation
		})
	}

	/* istanbul ignore next */
	updateComment(serviceId: string, comment: string | null): Promise<void> {
		if (!serviceId) return Promise.reject(new Error('Id is necessary'))
		return updateDB(child(DBService.dbServices(), serviceId), {
			comment: comment
		})
	}

	/* istanbul ignore next */
	async assign(serviceId: string, driverId: string): Promise<void> {
		return updateDB(ref(DBService.db, 'services/'.concat(serviceId)), {
			driver_id: driverId,
			status: Service.STATUS_IN_PROGRESS,
			assigned_by: AuthService.getCurrentUser()?.id ?? null
		}).then(async () => {
			await set(ref(DBService.db, 'drivers_assigned/'.concat(driverId)), serviceId)
		})
	}

	/* istanbul ignore next */
	async release(serviceId: string): Promise<void> {
		return updateDB(child(DBService.dbServices(), serviceId), {
			driver_id: null,
			status: Service.STATUS_PENDING,
			applicants: null,
			metadata: null
		})
	}

	/* istanbul ignore next */
	async restart(service: ServiceInterface): Promise<void> {
		if (!service.id) return Promise.reject(new Error('Id is necessary'))
		if (service.driver_id) return Promise.reject(new Error('Service has a driver assigned'))
		if (this.hasApplicants(service.applicants as unknown)) return Promise.reject(new Error('Service has applicants'))
		const newService = new Service()
		newService.start_loc = service.start_loc
		newService.end_loc = service.end_loc
		newService.phone = service.phone
		newService.name = service.name
		newService.comment = service.comment
		newService.wp_client_id = service.wp_client_id
		newService.client_id = service.client_id
		newService.amount = service.amount ?? null
		newService.applicants = service.applicants ?? null
		newService.metadata = service.metadata ?? null

		await remove(child(DBService.dbServices(), service.id))
		return this.create(newService)
	}

	private hasApplicants(applicants: unknown): boolean {
		if (!applicants) return false
		if (Array.isArray(applicants)) return applicants.length > 0
		if (typeof applicants === 'object') return Object.keys(applicants as Record<string, unknown>).length > 0
		return true
	}

	/* istanbul ignore next */
	updateStatus(serviceId: string, status: string): Promise<void> {
		return updateDB(ref(DBService.db, 'services/'.concat(serviceId)), {
			status: status,
			canceled_by: AuthService.getCurrentUser()?.id ?? null
		})
	}

	/* istanbul ignore next */
	pendingListener(added: (data: DataSnapshot) => void, removed: (data: DataSnapshot) => void, changed: (data: DataSnapshot) => void = () => undefined): void {
		const pendingQuery = query(DBService.dbServices(), orderByChild('status'), equalTo(Service.STATUS_PENDING))
		onChildAdded(pendingQuery, added)
		onChildRemoved(pendingQuery, removed)
		onChildChanged(pendingQuery, changed)
	}

	/* istanbul ignore next */
	inProgressListener(added: (data: DataSnapshot) => void, removed: (data: DataSnapshot) => void): void {
		onChildAdded(query(DBService.dbServices(), orderByChild('status'), equalTo(Service.STATUS_IN_PROGRESS)), added)
		onChildRemoved(query(DBService.dbServices(), orderByChild('status'), equalTo(Service.STATUS_IN_PROGRESS)), removed)
	}

	/* istanbul ignore next */
	async create(service: ServiceInterface, count = 1): Promise<void> {
		for (let time = 1; time <= count; time++) {
			const res = await push(DBService.dbServices(), service).catch(e => Promise.reject(e))
			service.id = res.key
			service.created_by = AuthService.getCurrentUser()?.id ?? null
			await this.update(service).catch(e => Promise.reject(e))
		}
		await Promise.resolve()
	}
}

export default new ServiceRepository()

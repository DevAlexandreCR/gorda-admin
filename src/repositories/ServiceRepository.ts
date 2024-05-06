import {
	child,
	DataSnapshot,
	equalTo,
	get,
	onChildAdded,
	onChildRemoved,
	orderByChild,
	push,
	query,
	ref,
	set,
	update as updateDB,
} from 'firebase/database'
import DBService from '@/services/DBService'
import {ServiceInterface} from '@/types/ServiceInterface'
import Service from '@/models/Service'
import FSService from '@/services/FSService'
import {
	CollectionReference,
	endBefore,
	getCountFromServer,
	getDocs,
	limit,
	limitToLast,
	orderBy,
	query as queryFS,
	Query,
	startAfter,
	startAt,
	where,
} from 'firebase/firestore'
import {ServiceCursor} from '@/types/ServiceCursor'
import DriverRepository from '@/repositories/DriverRepository'

class ServiceRepository {

  /* istanbul ignore next */
  async getService(id: string): Promise<ServiceInterface> {
    const snapshot: DataSnapshot = await get(child(DBService.dbServices(), id))
    return <ServiceInterface>snapshot.val()
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
	byClientId(clientId: string, query?: Query): Query {
		if (query === undefined) query = FSService.servicesCollection()
		return queryFS(query,
			where('client_id', '==', clientId)
		);
	}
	
	/* istanbul ignore next */
	byStatus(status: string, query?: Query): Query {
		if (query === undefined) query = FSService.servicesCollection()
		return queryFS(query,
			where('status', '==', status)
		);
	}

	/* istanbul ignore next */
	async getCount(from: number, to: number, clientId: string|null, driverId?: string|null, status: string|null = null): Promise<number> {
		let query = this.betweenDate(
			from,
			to
		)

		if (clientId) query = this.byClientId(clientId, query)

		if (driverId) query = this.byDriverId(driverId, query)

		if (status) query = this.byStatus(status, query)

		return getCountFromServer(query).then(snapshot => {
			return Promise.resolve(snapshot.data().count)
		}).catch(e => {
			return Promise.reject(e)
		})
	}

	/* istanbul ignore next */
	byDriverId(driverId: string, query?: Query): Query {
		if (query === undefined) query = FSService.servicesCollection()
		return queryFS(query,
			where('driver_id', '==', driverId)
		);
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
  }, contain: boolean): Promise<Array<Service>> {
    let query: Query | CollectionReference = this.betweenDate(
      options.from,
      options.to
    )

    if (options.clientId) query = this.byClientId(options.clientId, query)

    if (options.driverId) query = this.byDriverId(options.driverId, query)

    query = queryFS(
			query,
			orderBy('created_at', 'desc'),
			orderBy('id', 'desc'),
			options.next? contain? startAt(options.cursor.created, options.cursor.id) : startAfter(options.cursor.created, options.cursor.id) : endBefore(options.cursor.created, options.cursor.id),
			options.next? limit(options.perPage) : limitToLast(options.perPage)
		)

		return await getDocs(query).then(docs => {
			const services = Array<Service>()
			docs.forEach(dataSnapshot => {
				const service = new Service()
				Object.assign(service, dataSnapshot.data())
				services.push(service)
			})

			return Promise.resolve(services)
		}).catch(e => Promise.reject(e))
  }

  /* istanbul ignore next */
  update(service: ServiceInterface): Promise<void> {
    if (!service.id) return Promise.reject(new Error('Id is necessary'))
    return set(ref(DBService.db, 'services/'.concat(service.id)), service)
  }

	/* istanbul ignore next */
	async release(serviceId: string, driverId: string): Promise<void> {
		return updateDB(child(DBService.dbServices(), serviceId), {
			driver_id: null,
			status: Service.STATUS_PENDING,
			applicants: null,
			metadata: null
		})
	}

  /* istanbul ignore next */
  updateStatus(serviceId: string, status: string): Promise<void> {
    return set(ref(DBService.db, 'services/' + serviceId + '/status'), status)
  }

  /* istanbul ignore next */
  pendingListener(added: (data: DataSnapshot) => void, removed: (data: DataSnapshot) => void): void {
    onChildAdded(query(DBService.dbServices(), orderByChild('status'), equalTo(Service.STATUS_PENDING)), added)
    onChildRemoved(query(DBService.dbServices(), orderByChild('status'), equalTo(Service.STATUS_PENDING)), removed)
  }

  /* istanbul ignore next */
  inProgressListener(added: (data: DataSnapshot) => void, removed: (data: DataSnapshot) => void): void {
    onChildAdded(query(DBService.dbServices(), orderByChild('status'), equalTo(Service.STATUS_IN_PROGRESS)), added)
    onChildRemoved(query(DBService.dbServices(), orderByChild('status'), equalTo(Service.STATUS_IN_PROGRESS)), removed)
  }

  /* istanbul ignore next */
  async create(service: ServiceInterface, count = 1): Promise<void> {
		for (let time = 1; time <= count; time ++ ) {
			const res = await push(DBService.dbServices(), service).catch(e => Promise.reject(e))
			service.id = res.key
			await this.update(service).catch(e => Promise.reject(e));
		}
		await Promise.resolve()
  }
}

export default new ServiceRepository()
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
} from 'firebase/database'
import DBService from '@/services/DBService'
import {ServiceInterface} from '@/types/ServiceInterface'
import Service from '@/models/Service'
import FSService from '@/services/FSService'
import {getDocs, query as queryFS, Query, QuerySnapshot, where, startAfter, orderBy, limit, endBefore, limitToLast, DocumentData, CollectionReference} from 'firebase/firestore'

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
	byDriverId(driverId: string, query?: Query): Query {
		if (query === undefined) query = FSService.servicesCollection()
		return queryFS(query,
			where('driver_id', '==', driverId)
		);
	}

/* istanbul ignore next */
async getAll(
	from: number,
	to: number,
	driverId: string | null = null,
	clientId: string | null = null,
	limit: number, 
	startAfterCursor?: string, 
	endBeforeCursor?: string, 
  ): Promise<QuerySnapshot<DocumentData>> {
	let query: Query | CollectionReference = this.betweenDate(from, to);
  
	if (clientId) query = this.byClientId(clientId, query);
	if (driverId) query = this.byDriverId(driverId, query);

	query = queryFS(query, orderBy('created_at'))
  
	if (startAfterCursor) {
	query = queryFS(query, startAfter(query, startAfterCursor));
	} else if (endBeforeCursor) {
	query = queryFS(query, endBefore(query, endBeforeCursor));
	}
  
	query = queryFS(query, limitToLast(limit));
  
	const snapshot: QuerySnapshot<DocumentData> = await getDocs(query);
	return snapshot;
  }

  /* istanbul ignore next */
  update(service: ServiceInterface): Promise<void> {
    if (!service.id) return Promise.reject(new Error('Id is necessary'))
    return set(ref(DBService.db, 'services/'.concat(service.id)), service)
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
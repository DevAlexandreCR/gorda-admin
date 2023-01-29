import {
  get,
  child,
  DataSnapshot,
  set,
  ref,
  push,
  onChildAdded,
  query,
  startAfter,
  endBefore,
  orderByChild,
  equalTo,
  onChildRemoved
} from 'firebase/database'
import DBService from '@/services/DBService'
import {ServiceInterface} from '@/types/ServiceInterface'
import Service from '@/models/Service'

class ServiceRepository {

  /* istanbul ignore next */
  async getService(id: string): Promise<ServiceInterface> {
    const snapshot: DataSnapshot = await get(child(DBService.dbServices(), id))
    return <ServiceInterface>snapshot.val()
  }

  /* istanbul ignore next */
  async getAll(): Promise<Array<ServiceInterface>> {
    const snapshot: DataSnapshot = await get(DBService.dbServices())
    return <Array<ServiceInterface>>snapshot.val()
  }

  /* istanbul ignore next */
  update(service: ServiceInterface): Promise<void> {
    if (!service.id) return Promise.reject(new Error('Id is necessary'))
    return set(ref(DBService.db, 'services/'.concat(service.id)), service);
  }

  /* istanbul ignore next */
  updateStatus(serviceId: string, status: string): Promise<void> {
    return set(ref(DBService.db, 'services/' + serviceId + '/status'), status);
  }
  
  /* istanbul ignore next */
  historyListener(startAtl: number, endAt: number): Promise<DataSnapshot> {
    return get(query(DBService.dbServices(), orderByChild('created_at'), startAfter(startAtl, 'created_at'), endBefore(endAt, 'created_at')))
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
  async create(service: ServiceInterface): Promise<void> {
    const res = await push(DBService.dbServices(), service)
    service.id = res.key
    return this.update(service);
  }
}

export default new ServiceRepository()
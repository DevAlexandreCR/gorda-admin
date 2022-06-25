import {get, child, DataSnapshot, set, ref, push, onChildAdded, onChildChanged, query, startAfter, orderByChild} from 'firebase/database'
import DBService from '@/services/DBService'
import {ServiceInterface} from '@/types/ServiceInterface'

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
    return set(ref(DBService.db, 'services/'.concat(service.id!!)), service);
  }

  /* istanbul ignore next */
  updateStatus(serviceId: string, status: string): Promise<void> {
    return set(ref(DBService.db, 'services/' + serviceId + '/status'), status);
  }
  
  /* istanbul ignore next */
  serviceListener(added: (data: DataSnapshot) => void, changed: (data: DataSnapshot) => void, startAtl: number): void {
    onChildAdded(query(DBService.dbServices(), orderByChild('created_at'), startAfter(startAtl, 'created_at')), added)
    onChildChanged(query(DBService.dbServices(), orderByChild('created_at'), startAfter(startAtl, 'created_at')), changed)
  }

  /* istanbul ignore next */
  async create(service: ServiceInterface): Promise<void> {
    const res = await push(DBService.dbServices(), service)
    service.id = res.key
    return this.update(service);
  }
}

export default new ServiceRepository()
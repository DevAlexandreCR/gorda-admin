import {get, child, DataSnapshot, set, ref, push, onChildAdded, onChildChanged, query, equalTo, orderByChild, startAfter} from 'firebase/database'
import DBService from '@/services/DBService'
import {ServiceInterface} from '@/entities/ServiceInterface'
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
    return set(ref(DBService.db, 'services/' + service.id), service);
  }

  pendingListener(added: (data: DataSnapshot) => void, changed: (data: DataSnapshot) => void, startAt: number): void {
    onChildAdded(query(DBService.dbServices(), orderByChild('created_at'), startAfter(startAt, 'created_at')), added)
    onChildChanged(DBService.dbServices(), changed)
  }

  inProgressListener(added: (data: DataSnapshot) => void, changed: (data: DataSnapshot) => void, startAt: number): void {
    onChildAdded(query(DBService.dbServices(), orderByChild('created_at'), startAfter(startAt, 'created_at')), added)
    onChildChanged(DBService.dbServices(), changed)
  }

  /* istanbul ignore next */
  async create(service: ServiceInterface): Promise<void> {
    const res = await push(DBService.dbServices(), service)
    service.id = res.key
    return await this.update(service);
  }
}

export default new ServiceRepository()
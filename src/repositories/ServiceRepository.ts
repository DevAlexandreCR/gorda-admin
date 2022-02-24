import {get, child, DataSnapshot, set, ref, push, onChildAdded, onChildChanged} from 'firebase/database'
import DBService from '@/services/DBService'
import {ServiceInterface} from '@/entities/ServiceInterface'

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

  serviceListener(added: (data: DataSnapshot) => void, changed: (data: DataSnapshot) => void): void {
    onChildAdded(DBService.dbServices(), added)
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
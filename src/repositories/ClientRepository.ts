import {get, DataSnapshot, push, set, child, ref} from 'firebase/database'
import DBService from '@/services/DBService'
import {ClientInterface} from '@/types/ClientInterface'
import {ServiceInterface} from '@/types/ServiceInterface'

class ClientRepository {

/* istanbul ignore next */
  async getAll(): Promise<Array<ClientInterface>> {
    const snapshot: DataSnapshot = await get(DBService.dbClients())
    return Object.values(snapshot.val())
  }
  
  /* istanbul ignore next */
  async create(client: ClientInterface): Promise<ClientInterface> {
    const key = '57'.concat(client.phone)
    client.id = key.concat('@c.us')
    return new Promise((resolve, rejected) => {
      set(ref(DBService.db, 'clients/'.concat(key)), client).then(() => {
        resolve(client)
      }).catch(e => {
        rejected(e)
      })
    })
  }
}

export default new ClientRepository()
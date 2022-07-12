import {get, DataSnapshot, set, ref, onChildAdded} from 'firebase/database'
import DBService from '@/services/DBService'
import {ClientInterface} from '@/types/ClientInterface'
import Client from '@/models/Client'

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
  
  /* istanbul ignore next */
  onAll(onClientAdded: (place: Client) => void): void {
    onChildAdded(DBService.dbClients(), (snapshot) => {
      const client: ClientInterface = snapshot.val() as ClientInterface
      const clientTmp = new Client()
      Object.assign(clientTmp, client)
      onClientAdded(clientTmp)
    })
  }
}

export default new ClientRepository()
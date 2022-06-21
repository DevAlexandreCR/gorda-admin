import {get, DataSnapshot} from 'firebase/database'
import DBService from '@/services/DBService'
import {ClientInterface} from '@/types/ClientInterface'

class ClientRepository {

/* istanbul ignore next */
  async getAll(): Promise<Array<ClientInterface>> {
    const snapshot: DataSnapshot = await get(DBService.dbClients())
    return Object.values(snapshot.val())
  }
}

export default new ClientRepository()
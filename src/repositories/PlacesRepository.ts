import {get, DataSnapshot, push} from 'firebase/database'
import DBService from '@/services/DBService'
import {PlacesInterface} from '@/types/PlacesInterface'

class PlacesRepository {

/* istanbul ignore next */
  async getAll(): Promise<Array<PlacesInterface>> {
    const snapshot: DataSnapshot = await get(DBService.dbPlaces())
    return Object.values(snapshot.val())
  }

    /* istanbul ignore next */
    async create(Places: PlacesInterface): Promise<string> {
        const res = await push(DBService.dbPlaces(), Places)
        return res.key as string
    }
}

export default new PlacesRepository()
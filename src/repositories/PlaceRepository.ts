import {get, DataSnapshot, push} from 'firebase/database'
import DBService from '@/services/DBService'
import {PlaceInterface} from '@/types/PlaceInterface'

class PlaceRepository {

/* istanbul ignore next */
  async getAll(): Promise<Array<PlaceInterface>> {
    const snapshot: DataSnapshot = await get(DBService.dbPlaces())
    return Object.values(snapshot.val())
  }

  /* istanbul ignore next */
  async create(Places: PlaceInterface): Promise<string> {
      const res = await push(DBService.dbPlaces(), Places)
      return res.key as string
  }
}

export default new PlaceRepository()
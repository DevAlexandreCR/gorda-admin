import {get, DataSnapshot, push, onChildAdded} from 'firebase/database'
import DBService from '@/services/DBService'
import {PlaceInterface} from '@/types/PlaceInterface'
import Place from '@/models/Place'

class PlaceRepository {

/* istanbul ignore next */
  async getAll(): Promise<Array<PlaceInterface>> {
    const snapshot: DataSnapshot = await get(DBService.dbPlaces())
    return Object.values(snapshot.val())
  }
  
  onAll(onPlaceAdded: (place: Place) => void): void {
    onChildAdded(DBService.dbPlaces(), (snapshot) => {
      const place: PlaceInterface = snapshot.val() as PlaceInterface
      const placeTmp = new Place()
      Object.assign(placeTmp, place)
      onPlaceAdded(placeTmp)
    })
  }

  /* istanbul ignore next */
  async create(Places: PlaceInterface): Promise<string> {
      const res = await push(DBService.dbPlaces(), Places)
      return res.key as string
  }
}

export default new PlaceRepository()
import {get, DataSnapshot, push, onChildAdded, child, remove} from 'firebase/database'
import DBService from '@/services/DBService'
import {PlaceInterface} from '@/types/PlaceInterface'
import Place from '@/models/Place'

class PlaceRepository {

 /* istanbul ignore next */
  async getAll(): Promise<Array<PlaceInterface>> {
    const snapshot: DataSnapshot = await get(DBService.dbPlaces())
    return Object.values(snapshot.val())
  }
  
  /* istanbul ignore next */
  onAll(onPlaceAdded: (place: Place) => void): void {
    onChildAdded(DBService.dbPlaces(), (snapshot) => {
      const place: PlaceInterface = snapshot.val() as PlaceInterface
      const placeTmp = new Place()
      Object.assign(placeTmp, place)
      placeTmp.key = snapshot.key?? ''
      onPlaceAdded(placeTmp)
    })
  }

  /* istanbul ignore next */
  async create(place: PlaceInterface): Promise<string> {
      const res = await push(DBService.dbPlaces(), place)
      return res.key as string
  }
  
  /* istanbul ignore next */
  async remove(place: PlaceInterface): Promise<void> {
    if (place.key) await remove(child(DBService.dbPlaces(), place.key).ref)
    else return Promise.reject(new Error('Non place key'))
  }
}

export default new PlaceRepository()
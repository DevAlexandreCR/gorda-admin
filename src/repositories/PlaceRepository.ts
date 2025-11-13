import { onChildAdded } from 'firebase/database'
import DBService from '@/services/DBService'
import { PlaceInterface } from '@/types/PlaceInterface'
import Place from '@/models/Place'
import PlacesApiService from '@/services/gordaApi/server/PlacesApiService'

class PlaceRepository {

  /* istanbul ignore next */
  async getAll(cityId: string): Promise<Array<PlaceInterface>> {
    return PlacesApiService.index(cityId)
      .then(response => {
        if (!response?.data) {
          console.warn('Invalid response structure from PlacesApiService.index')
          return []
        }

        const { data } = response

        if (!data.success) {
          console.error('API returned error:', data.message || 'Unknown error')
          return []
        }

        const places = data.data?.places

        if (!Array.isArray(places)) {
          console.warn('Places data is not an array or is missing')
          return []
        }

        return places as Array<PlaceInterface>
      })
      .catch(error => {
        console.error('Error fetching places:', error)
        return []
      })
  }

  /**
   * @deprecated This function is deprecated cause we are now using the PlacesApiService to manage places.
   * istanbul ignore next
   */
  onAll(onPlaceAdded: (place: Place) => void): void {
    onChildAdded(DBService.dbPlaces(), (snapshot) => {
      const place: PlaceInterface = snapshot.val() as PlaceInterface
      const placeTmp = new Place()
      Object.assign(placeTmp, place)
      placeTmp.key = snapshot.key ?? ''
      onPlaceAdded(placeTmp)
    })
  }

  /* istanbul ignore next */
  async create(place: PlaceInterface, cityId: string): Promise<string> {
    const response = await PlacesApiService.store(place, cityId)
    if (response.data.success && response.data.data.place.id) {
      return response.data.data.place.id as string
    } else {
      return Promise.reject(new Error(response.data.message ?? 'Error storing place'))
    }
  }

  /* istanbul ignore next */
  async remove(place: PlaceInterface): Promise<void> {
    if (place.key) await PlacesApiService.delete(place.key)
  }
}

export default new PlaceRepository()
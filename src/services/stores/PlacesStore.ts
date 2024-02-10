import {defineStore} from 'pinia'
import PlaceRepository from '@/repositories/PlaceRepository'
import Place from '@/models/Place'
import {PlaceInterface} from '@/types/PlaceInterface'
import {useLoadingState} from '@/services/stores/LoadingState'

export const usePlacesStore = defineStore('placesStore', {
  state: () => {

    return {
      places: Array<Place>()
    }
  },
  actions: {
    findByName(name: string): Place {
      const place = this.places.find(el => el.name == name)
      return place ?? new Place()
    },
    async getPlaces() {
      PlaceRepository.onAll(async (place) => {
        this.places.push(place)
      })
    },
    remove(place: Place): void {
      const placeIndex = this.places.findIndex(placeST => placeST.key == place.key)
      this.places.splice(placeIndex, 1)
    },
    async create(place: PlaceInterface): Promise<PlaceInterface> {
      const { setLoading } = useLoadingState()
      setLoading(true)
      place.key  = await PlaceRepository.create(place).finally(() => setLoading(false))
      return Promise.resolve(place)
    }
  }
})
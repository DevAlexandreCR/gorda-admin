import {Loader} from '@googlemaps/js-api-loader'
import GoogleLoader from '@/services/maps/GoogleLoader'
import {PlaceInterface} from '@/types/PlaceInterface'

export class RemoteAutocomplete {
  public autocomplete: google.maps.places.Autocomplete
  private readonly options: google.maps.places.AutocompleteOptions
  private loader: Loader
  constructor() {
    this.loader = GoogleLoader.getInstance()
    const lat = parseFloat(process.env.VUE_APP_MAP_CENTER_LAT ?? '0')
    const lng = parseFloat(process.env.VUE_APP_MAP_CENTER_LNG ?? '0')
    const distanceVert = parseFloat(process.env.VUE_APP_MAP_DISTANCE_VERT ?? '0')
    const distanceHor = parseFloat(process.env.VUE_APP_MAP_DISTANCE_HOR ?? '0')
    const center = { lat: lat, lng: lng }
    const defaultBounds = {
      north: center.lat + distanceVert,
      south: center.lat - distanceVert,
      east: center.lng + distanceHor,
      west: center.lng - distanceHor,
    }
    this.options = {
      bounds: defaultBounds,
      componentRestrictions: { country: "co" },
      fields: ['geometry', 'name'],
      strictBounds: true,
    }
  }

  public async initPlaces(id: string): Promise<void> {
    const input = document.getElementById(id) as HTMLInputElement
    await this.loader.importLibrary('places').then((places) => {
      this.autocomplete = new places.Autocomplete(input, this.options)
    })
  }

  public onPlaceChanged(fn: (place: Partial<PlaceInterface>) => void): void {
    this.autocomplete.addListener('place_changed', () => {
      const gPlace = this.autocomplete.getPlace()
      if (gPlace.geometry != undefined) {
        const place: Partial<PlaceInterface> = {
          name: gPlace.name?? '',
          lat: gPlace.geometry.location?.lat()?? 0,
          lng: gPlace.geometry.location?.lng()?? 0
        }
        fn(place)
      }
    })
  }
}
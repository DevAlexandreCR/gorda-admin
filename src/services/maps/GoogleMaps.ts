import {Loader} from '@googlemaps/js-api-loader'
import {PlaceInterface} from '@/types/PlaceInterface'

export class GoogleMaps {
  
  loader: Loader
  map: google.maps.Map
  markers: Array<google.maps.Marker> = []
  
  constructor() {
    this.loader = new Loader({
      apiKey: process.env.VUE_APP_GOOGLE_API_KEY?? '',
      version: "weekly"
    })
  }
  
  /* istanbul ignore next */
  async initMap(id: string): Promise<google.maps.Map> {
    await this.loader.load().then((google)=> {
      const options: google.maps.MapOptions = {
        center: { lat: 2.4448143, lng: -76.6147395 },
        zoom: 14
      }
      this.map = new google.maps.Map(document.getElementById(id) as HTMLElement, options)
    }).catch(error => console.error(error))
    
    return Promise.resolve(this.map)
  }
  /* istanbul ignore next */
  addMarker(place: PlaceInterface): void {
    const marker = new google.maps.Marker({
      position: {
        lat: place.lat,
        lng: place.lng
      },
      map: this.map,
      title: place.name
    });
    this.markers.push(marker)
  }
  
  /* istanbul ignore next */
  moveCamera(place: PlaceInterface): void {
    this.map.panTo(new google.maps.LatLng(place.lat, place.lng))
  }
  
  addListener(listener: (latLng: google.maps.LatLng) => void): void {
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      const marker = new google.maps.Marker()
      if (event.latLng) {
        this.clearMap()
        marker.setPosition(event.latLng)
        marker.setMap(this.map)
        this.markers.push(marker)
        this.map.panTo(event.latLng)
        listener(event.latLng)
      }
    })
  }
  
  clearMap(): void {
    this.markers.forEach(marker => marker.setMap(null))
    this.markers = []
  }
}
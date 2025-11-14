import { Loader } from '@googlemaps/js-api-loader'
import { PlaceInterface } from '@/types/PlaceInterface'

export class GoogleMaps {
  loader: Loader
  map: google.maps.Map
  markers: Array<google.maps.Marker> = []
  icon: string
  center: google.maps.LatLngLiteral

  static DARK_STYLE: google.maps.MapTypeStyle[] = [
    { elementType: 'geometry', stylers: [{ color: '#1f2530' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1f2530' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8f9bb3' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#c0c8d2' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#c0c8d2' }],
    },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1b202a' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#8f9bb3' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a3040' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#3a4256' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#b0bac8' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2a3040' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f1623' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#8f9bb3' }] },
  ]

  constructor(icon: string, lat: number, lng: number) {
    this.center = { lat: lat, lng: lng }
    this.loader = new Loader({
      apiKey: process.env.VUE_APP_GOOGLE_API_KEY ?? '',
      version: 'weekly',
    })
    this.icon = icon
  }

  /* istanbul ignore next */
  async initMap(id: string): Promise<google.maps.Map> {
    await this.loader
      .load()
      .then((google) => {
        const options: google.maps.MapOptions = {
          center: this.center,
          zoom: 14,
          styles: document.body.classList.contains('dark-version')
            ? GoogleMaps.DARK_STYLE
            : [],
        }
        this.map = new google.maps.Map(document.getElementById(id) as HTMLElement, options)
      })
      .catch((error) => console.error(error))

    return Promise.resolve(this.map)
  }

  /* istanbul ignore next */
  addMarker(place: PlaceInterface): void {
    const infoWindow = new google.maps.InfoWindow({
      content: place.name,
      disableAutoPan: true,
    })
    const markerOptions: google.maps.MarkerOptions = {
      position: {
        lat: place.lat,
        lng: place.lng,
      },
      map: this.map,
      icon: {
        url: this.icon,
        scaledSize: new google.maps.Size(30, 30),
      },
      title: place.name,
      optimized: true,
    }
    const marker = new google.maps.Marker(markerOptions)

    // Wrap content to allow dark-mode styling of InfoWindow
    const wrappedContent =
      place.color !== undefined
        ? `<div class="gorda-infowindow"><span class="badge bg-${place.color}">${place.name}</span></div>`
        : `<div class="gorda-infowindow">${place.name}</div>`
    infoWindow.setContent(wrappedContent)
    infoWindow.open(this.map, marker)
    this.markers.push(marker)
  }

  updateMarker(place: PlaceInterface): void {
    const markerIndex = this.findMarkerIndexByTitle(place.name)
    const latlng = new google.maps.LatLng(place.lat, place.lng)
    if (markerIndex >= 0) this.markers[markerIndex].setPosition(latlng)
  }

  removeMarker(place: PlaceInterface): void {
    const markerIndex = this.findMarkerIndexByTitle(place.name)
    if (markerIndex >= 0) {
      this.markers[markerIndex].setMap(null)
      this.markers.splice(markerIndex, 1)
    }
  }

  findMarkerIndexByTitle(title: string): number {
    return this.markers.findIndex((marker) => marker.getTitle() == title)
  }

  /* istanbul ignore next */
  moveCamera(place: PlaceInterface): void {
    this.map.panTo(new google.maps.LatLng(place.lat, place.lng))
  }

  /* istanbul ignore next */
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

  /* istanbul ignore next */
  printRoute(routeString: string): void {
    const route = JSON.parse(routeString)
    const routeCoordinates = Object.keys(route).map((key: string) => {
      const point = route[key]
      return new google.maps.LatLng(point.lat, point.lng)
    })

    const routePath = new google.maps.Polyline({
      path: routeCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 4,
    })

    routePath.setMap(this.map)
  }

  /* istanbul ignore next */
  clearMap(): void {
    this.markers.forEach((marker) => marker.setMap(null))
    this.markers = []
  }

  /* istanbul ignore next */
  setDarkMode(isDark: boolean): void {
    if (!this.map) return
    this.map.setOptions({ styles: isDark ? GoogleMaps.DARK_STYLE : [] })
  }
}


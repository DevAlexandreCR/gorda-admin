import { Loader } from '@googlemaps/js-api-loader'
import { PlaceInterface } from '@/types/PlaceInterface'

interface MarkerEntry {
  key: string
  marker: google.maps.Marker
  infoWindow: google.maps.InfoWindow
}

const VEHICLE_ICON_PATH =
  'M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32H346.6c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2V400v48c0 17.7-14.3 32-32 32H448c-17.7 0-32-14.3-32-32V400H96v48c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V400 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z'

export function vehicleIconColor(color?: string): string {
  return color === 'danger' ? '#ea0606' : '#82d616'
}

export function platePillClass(color?: string): string {
  return color === 'danger' ? 'gorda-plate-pill--busy' : 'gorda-plate-pill--free'
}

export class GoogleMaps {
  loader: Loader
  map: google.maps.Map
  markers: Array<MarkerEntry> = []
  icon: string
  center: google.maps.LatLngLiteral
  coloredVehicle: boolean

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

  constructor(icon: string, lat: number, lng: number, coloredVehicle = false) {
    this.center = { lat: lat, lng: lng }
    this.loader = new Loader({
      apiKey: process.env.VUE_APP_GOOGLE_API_KEY ?? '',
      version: 'weekly',
    })
    this.icon = icon
    this.coloredVehicle = coloredVehicle
  }

  private buildVehicleIcon(color?: string): google.maps.Icon {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path fill='${vehicleIconColor(color)}' d='${VEHICLE_ICON_PATH}'/></svg>`
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
      scaledSize: new google.maps.Size(34, 34),
      anchor: new google.maps.Point(17, 17),
    }
  }

  private buildInfoWindowContent(place: PlaceInterface): string {
    if (this.coloredVehicle) {
      return `<div class="gorda-infowindow gorda-infowindow--vehicle"><span class="gorda-plate-pill ${platePillClass(place.color)}">${place.name}</span></div>`
    }

    return place.color !== undefined
      ? `<div class="gorda-infowindow"><span class="badge bg-${place.color}">${place.name}</span></div>`
      : `<div class="gorda-infowindow">${place.name}</div>`
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
      ...(this.coloredVehicle ? { pixelOffset: new google.maps.Size(0, -20) } : {}),
    })
    const markerOptions: google.maps.MarkerOptions = {
      position: {
        lat: place.lat,
        lng: place.lng,
      },
      map: this.map,
      icon: this.coloredVehicle
        ? this.buildVehicleIcon(place.color)
        : {
            url: this.icon,
            scaledSize: new google.maps.Size(30, 30),
          },
      title: place.name,
      optimized: true,
    }
    const marker = new google.maps.Marker(markerOptions)

    // Wrap content to allow dark-mode styling of InfoWindow
    infoWindow.setContent(this.buildInfoWindowContent(place))
    infoWindow.open(this.map, marker)
    this.markers.push({
      key: place.key,
      marker,
      infoWindow,
    })
  }

  updateMarker(place: PlaceInterface): void {
    const markerIndex = this.findMarkerIndexByKey(place.key)
    const latlng = new google.maps.LatLng(place.lat, place.lng)
    if (markerIndex < 0) {
      return
    }

    const markerEntry = this.markers[markerIndex]

    markerEntry.marker.setPosition(latlng)
    markerEntry.marker.setTitle(place.name)
    if (this.coloredVehicle) {
      markerEntry.marker.setIcon(this.buildVehicleIcon(place.color))
    }
    markerEntry.infoWindow.setContent(this.buildInfoWindowContent(place))
    markerEntry.infoWindow.open(this.map, markerEntry.marker)
  }

  removeMarker(place: PlaceInterface): void {
    const markerIndex = this.findMarkerIndexByKey(place.key)
    if (markerIndex >= 0) {
      this.markers[markerIndex].marker.setMap(null)
      this.markers.splice(markerIndex, 1)
    }
  }

  findMarkerIndexByKey(key: string): number {
    return this.markers.findIndex((markerEntry) => markerEntry.key === key)
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
        this.markers.push({
          key: `listener-marker-${Date.now()}`,
          marker,
          infoWindow: new google.maps.InfoWindow(),
        })
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
    this.markers.forEach((markerEntry) => markerEntry.marker.setMap(null))
    this.markers = []
  }

  /* istanbul ignore next */
  setDarkMode(isDark: boolean): void {
    if (!this.map) return
    this.map.setOptions({ styles: isDark ? GoogleMaps.DARK_STYLE : [] })
  }
}

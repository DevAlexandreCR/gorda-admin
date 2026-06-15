jest.mock('@googlemaps/js-api-loader', () => ({
  Loader: jest.fn().mockImplementation(() => ({
    load: jest.fn(),
  })),
}))

import { GoogleMaps } from '@/services/maps/GoogleMaps'
import { PlaceInterface } from '@/types/PlaceInterface'

class MockInfoWindow {
  content: string
  disableAutoPan: boolean
  setContent: jest.Mock
  open: jest.Mock

  constructor(options: { content?: string; disableAutoPan?: boolean } = {}) {
    this.content = options.content ?? ''
    this.disableAutoPan = options.disableAutoPan ?? false
    this.setContent = jest.fn((content: string) => {
      this.content = content
    })
    this.open = jest.fn()
  }
}

class MockMarker {
  title: string
  position: unknown
  setPosition: jest.Mock
  setTitle: jest.Mock
  setMap: jest.Mock
  getTitle: jest.Mock

  constructor(options: { title?: string; position?: unknown } = {}) {
    this.title = options.title ?? ''
    this.position = options.position
    this.setPosition = jest.fn((position: unknown) => {
      this.position = position
    })
    this.setTitle = jest.fn((title: string) => {
      this.title = title
    })
    this.setMap = jest.fn()
    this.getTitle = jest.fn(() => this.title)
  }
}

class MockLatLng {
  latValue: number
  lngValue: number

  constructor(lat: number, lng: number) {
    this.latValue = lat
    this.lngValue = lng
  }
}

describe('GoogleMaps', () => {
  beforeEach(() => {
    (window as any).google = {
      maps: {
        InfoWindow: MockInfoWindow,
        Marker: MockMarker,
        Size: class {},
        LatLng: MockLatLng,
        Polyline: class {
          setMap = jest.fn()
        },
      },
    }
  })

  function buildPlace(overrides: Partial<PlaceInterface> = {}): PlaceInterface {
    return {
      id: 'driver-1',
      key: 'driver-1',
      name: 'fallback',
      lat: 1,
      lng: 2,
      ...overrides,
    }
  }

  it('looks up markers by stable key', () => {
    const googleMaps = new GoogleMaps('icon.png', 0, 0)
    googleMaps.map = {} as any

    googleMaps.addMarker(buildPlace())

    expect(googleMaps.findMarkerIndexByKey('driver-1')).toBe(0)
  })

  it('refreshes marker position, title, and info window content on update', () => {
    const googleMaps = new GoogleMaps('icon.png', 0, 0)
    googleMaps.map = {} as any
    googleMaps.addMarker(buildPlace())

    googleMaps.updateMarker(
      buildPlace({
        name: 'ABC123',
        lat: 5,
        lng: 6,
        color: 'danger',
      })
    )

    const markerEntry = googleMaps.markers[0]
    expect(markerEntry.marker.setPosition).toHaveBeenCalledWith(expect.any(MockLatLng))
    expect(markerEntry.marker.setTitle).toHaveBeenCalledWith('ABC123')
    expect(markerEntry.infoWindow.setContent).toHaveBeenCalledWith(
      '<div class="gorda-infowindow"><span class="badge bg-danger">ABC123</span></div>'
    )
    expect(markerEntry.infoWindow.open).toHaveBeenCalledWith(googleMaps.map, markerEntry.marker)
  })
})

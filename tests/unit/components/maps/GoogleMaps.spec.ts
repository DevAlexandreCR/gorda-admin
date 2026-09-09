jest.mock('@googlemaps/js-api-loader', () => ({
  Loader: jest.fn().mockImplementation(() => ({
    load: jest.fn(),
  })),
}))

import { GoogleMaps } from '@/services/maps/GoogleMaps'
import { PlaceInterface } from '@/types/PlaceInterface'

class MockMarker {
  title: string
  position: unknown
  label: unknown
  icon: unknown
  opacity: unknown
  setPosition: jest.Mock
  setTitle: jest.Mock
  setLabel: jest.Mock
  setIcon: jest.Mock
  setOpacity: jest.Mock
  setMap: jest.Mock
  getTitle: jest.Mock

  constructor(
    options: { title?: string; position?: unknown; label?: unknown; icon?: unknown; opacity?: unknown } = {}
  ) {
    this.title = options.title ?? ''
    this.position = options.position
    this.label = options.label
    this.icon = options.icon
    this.opacity = options.opacity
    this.setPosition = jest.fn((position: unknown) => {
      this.position = position
    })
    this.setTitle = jest.fn((title: string) => {
      this.title = title
    })
    this.setLabel = jest.fn((label: unknown) => {
      this.label = label
    })
    this.setIcon = jest.fn((icon: unknown) => {
      this.icon = icon
    })
    this.setOpacity = jest.fn((opacity: unknown) => {
      this.opacity = opacity
    })
    this.setMap = jest.fn()
    this.getTitle = jest.fn(() => this.title)
  }
}

class MockMap {
  panTo: jest.Mock

  constructor() {
    this.panTo = jest.fn()
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
        Marker: MockMarker,
        Map: MockMap,
        Size: class {},
        Point: class {
          x: number
          y: number
          constructor(x: number, y: number) {
            this.x = x
            this.y = y
          }
        },
        LatLng: MockLatLng,
        Polyline: class {
          setMap = jest.fn()
        },
        event: {
          trigger: jest.fn(),
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

    expect(googleMaps.getMarker('driver-1')?.key).toBe('driver-1')
  })

  it('renders the plate label (no info window) when a marker is added', () => {
    const googleMaps = new GoogleMaps('icon.png', 0, 0)
    googleMaps.map = {} as any

    googleMaps.addMarker(buildPlace({ name: 'KFV605' }))

    const markerEntry = googleMaps.getMarker('driver-1')!
    expect((markerEntry.marker as any).label).toEqual({
      text: 'KFV605',
      className: 'gorda-plate-pill gorda-plate-pill--free',
      color: '#ffffff',
      fontSize: '11px',
      fontWeight: '700',
    })
    expect((markerEntry as any).infoWindow).toBeUndefined()
  })

  it('refreshes marker position, title, and label on update', () => {
    const googleMaps = new GoogleMaps('icon.png', 0, 0)
    googleMaps.map = {} as any
    googleMaps.addMarker(buildPlace())

    googleMaps.updateMarker(
      buildPlace({
        name: 'ABC123',
        lat: 5,
        lng: 6,
        color: 'danger',
        freshness: 'aging',
      })
    )

    const markerEntry = googleMaps.getMarker('driver-1')!
    expect(markerEntry.marker.setPosition).toHaveBeenCalledWith(expect.any(MockLatLng))
    expect(markerEntry.marker.setTitle).toHaveBeenCalledWith('ABC123')
    expect(markerEntry.marker.setLabel).toHaveBeenCalledWith({
      text: 'ABC123',
      className: 'gorda-plate-pill gorda-plate-pill--busy gorda-plate-pill--aging',
      color: '#ffffff',
      fontSize: '11px',
      fontWeight: '700',
    })
  })

  it('update with identical place calls no setter', () => {
    const googleMaps = new GoogleMaps('icon.png', 0, 0)
    googleMaps.map = {} as any
    const place = buildPlace({ name: 'KFV605', color: 'danger', freshness: 'aging' })
    googleMaps.addMarker(place)

    googleMaps.updateMarker(buildPlace({ name: 'KFV605', color: 'danger', freshness: 'aging' }))

    const markerEntry = googleMaps.getMarker('driver-1')!
    expect(markerEntry.marker.setPosition).not.toHaveBeenCalled()
    expect(markerEntry.marker.setTitle).not.toHaveBeenCalled()
    expect(markerEntry.marker.setLabel).not.toHaveBeenCalled()
    expect((markerEntry.marker as any).setIcon).not.toHaveBeenCalled()
    expect((markerEntry.marker as any).setOpacity).not.toHaveBeenCalled()
  })

  it('position-only change calls only setPosition', () => {
    const googleMaps = new GoogleMaps('icon.png', 0, 0)
    googleMaps.map = {} as any
    googleMaps.addMarker(buildPlace({ name: 'KFV605', color: 'danger', freshness: 'aging' }))

    googleMaps.updateMarker(
      buildPlace({ name: 'KFV605', color: 'danger', freshness: 'aging', lat: 9, lng: 10 })
    )

    const markerEntry = googleMaps.getMarker('driver-1')!
    expect(markerEntry.marker.setPosition).toHaveBeenCalledTimes(1)
    expect(markerEntry.marker.setTitle).not.toHaveBeenCalled()
    expect(markerEntry.marker.setLabel).not.toHaveBeenCalled()
    expect((markerEntry.marker as any).setIcon).not.toHaveBeenCalled()
    expect((markerEntry.marker as any).setOpacity).not.toHaveBeenCalled()
  })

  it('resize with markers does not pan', () => {
    const googleMaps = new GoogleMaps('icon.png', 1, 2)
    googleMaps.map = new (window as any).google.maps.Map()
    googleMaps.addMarker(buildPlace())

    googleMaps.resize()

    expect((window as any).google.maps.event.trigger).toHaveBeenCalledWith(googleMaps.map, 'resize')
    expect((googleMaps.map as any).panTo).not.toHaveBeenCalled()
  })

  it('resize with no markers pans to center', () => {
    const googleMaps = new GoogleMaps('icon.png', 1, 2)
    googleMaps.map = new (window as any).google.maps.Map()

    googleMaps.resize()

    expect((window as any).google.maps.event.trigger).toHaveBeenCalledWith(googleMaps.map, 'resize')
    expect((googleMaps.map as any).panTo).toHaveBeenCalledWith({ lat: 1, lng: 2 })
  })
})

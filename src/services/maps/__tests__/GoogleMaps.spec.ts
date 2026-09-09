import { vehicleIconColor, markerOpacity, platePillClass } from '../GoogleMaps'

describe('vehicleIconColor', () => {
	it('returns the danger color when color is danger', () => {
		expect(vehicleIconColor('danger')).toBe('#ea0606')
	})

	it('returns the default color when color is undefined', () => {
		expect(vehicleIconColor(undefined)).toBe('#82d616')
	})

	it('returns the default color for any non-danger color', () => {
		expect(vehicleIconColor('success')).toBe('#82d616')
	})
})

describe('markerOpacity', () => {
	it('returns 1 for fresh', () => {
		expect(markerOpacity('fresh')).toBe(1)
	})

	it('returns 1 when freshness is undefined', () => {
		expect(markerOpacity(undefined)).toBe(1)
	})

	it('returns 0.55 for aging', () => {
		expect(markerOpacity('aging')).toBe(0.55)
	})

	it('returns 0.4 for stale', () => {
		expect(markerOpacity('stale')).toBe(0.4)
	})
})

describe('platePillClass', () => {
	it('returns the base and busy class when color is danger', () => {
		expect(platePillClass('danger')).toBe('gorda-plate-pill gorda-plate-pill--busy')
	})

	it('returns the base and free class when color is undefined', () => {
		expect(platePillClass(undefined)).toBe('gorda-plate-pill gorda-plate-pill--free')
	})

	it('returns the base and free class for any non-danger color', () => {
		expect(platePillClass('whatever')).toBe('gorda-plate-pill gorda-plate-pill--free')
	})

	it('appends the aging modifier when freshness is aging', () => {
		expect(platePillClass('danger', 'aging')).toBe('gorda-plate-pill gorda-plate-pill--busy gorda-plate-pill--aging')
	})

	it('appends the stale modifier when freshness is stale', () => {
		expect(platePillClass(undefined, 'stale')).toBe('gorda-plate-pill gorda-plate-pill--free gorda-plate-pill--stale')
	})

	it('adds no freshness modifier when freshness is fresh', () => {
		expect(platePillClass('danger', 'fresh')).toBe('gorda-plate-pill gorda-plate-pill--busy')
	})
})

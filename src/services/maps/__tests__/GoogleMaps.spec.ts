import { vehicleIconColor, platePillClass } from '../GoogleMaps'

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

describe('platePillClass', () => {
	it('returns the busy class when color is danger', () => {
		expect(platePillClass('danger')).toBe('gorda-plate-pill--busy')
	})

	it('returns the free class when color is undefined', () => {
		expect(platePillClass(undefined)).toBe('gorda-plate-pill--free')
	})

	it('returns the free class for any non-danger color', () => {
		expect(platePillClass('whatever')).toBe('gorda-plate-pill--free')
	})
})

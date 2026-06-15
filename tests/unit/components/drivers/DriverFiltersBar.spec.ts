import { mount, VueWrapper } from '@vue/test-utils'
import DriverFiltersBar from '@/components/drivers/DriverFiltersBar.vue'
import i18n from '@/plugins/i18n'
import { nextTick } from 'vue'
import type { ActiveFilters } from '@/types/ActiveFilters'

describe('DriverFiltersBar.vue', () => {
  const createWrapper = (props: {
    filters?: ActiveFilters
    search?: string
  } = {}): VueWrapper<any> => {
    return mount(DriverFiltersBar, {
      global: {
        plugins: [i18n],
      },
      props: {
        filters: props.filters ?? {},
        search: props.search ?? '',
      },
    })
  }

  // ── Chip rendering ──────────────────────────────────────────────────────────

  it('renders no chips when filters is empty', () => {
    const wrapper = createWrapper({ filters: {} })
    // The badge chips are rendered as spans with class badge
    const chips = wrapper.findAll('span.badge')
    expect(chips).toHaveLength(0)
  })

  it('renders a chip for an active status filter', () => {
    const wrapper = createWrapper({ filters: { status: 'enabled' } })
    const chips = wrapper.findAll('span.badge')
    expect(chips).toHaveLength(1)
    // Chip should contain the status label (translated in es locale: "Estado: Habilitado")
    expect(chips[0].text()).toContain('Estado')
    expect(chips[0].text()).toContain('Habilitado')
  })

  it('renders a chip for an active paymentMode filter', () => {
    const wrapper = createWrapper({ filters: { paymentMode: 'monthly' } })
    const chips = wrapper.findAll('span.badge')
    expect(chips).toHaveLength(1)
    expect(chips[0].text()).toContain('Pago')
    expect(chips[0].text()).toContain('Mensualidad')
  })

  it('renders a chip for an active inactiveDays filter', () => {
    const wrapper = createWrapper({ filters: { inactiveDays: 7 } })
    const chips = wrapper.findAll('span.badge')
    expect(chips).toHaveLength(1)
    expect(chips[0].text()).toContain('7')
  })

  it('renders a chip for an active needsVehicle filter', () => {
    const wrapper = createWrapper({ filters: { needsVehicle: true } })
    const chips = wrapper.findAll('span.badge')
    expect(chips).toHaveLength(1)
    // Chip should contain "vehicle" in some form (locale is es)
    expect(chips[0].text().toLowerCase()).toContain('veh')
  })

  it('renders a chip for each active filter when all four are set', () => {
    const wrapper = createWrapper({
      filters: { status: 'enabled', paymentMode: 'percentage', inactiveDays: 30, needsVehicle: true },
    })
    const chips = wrapper.findAll('span.badge')
    expect(chips).toHaveLength(4)
  })

  // ── Chip removal ────────────────────────────────────────────────────────────

  it('emits update:filters with status removed when its × button is clicked', async () => {
    const initialFilters: ActiveFilters = { status: 'enabled', paymentMode: 'monthly' }
    const wrapper = createWrapper({ filters: initialFilters })
    const chips = wrapper.findAll('span.badge')
    // First chip is status — click its close button
    const closeBtn = chips[0].find('button.btn-close')
    await closeBtn.trigger('click')
    const emitted = wrapper.emitted('update:filters')
    expect(emitted).toBeTruthy()
    const updatedFilters = emitted?.[0]?.[0] as ActiveFilters
    expect(updatedFilters.status).toBeUndefined()
    expect(updatedFilters.paymentMode).toBe('monthly')
  })

  it('emits update:filters with paymentMode removed when its × button is clicked', async () => {
    const initialFilters: ActiveFilters = { status: 'disabled', paymentMode: 'percentage' }
    const wrapper = createWrapper({ filters: initialFilters })
    const chips = wrapper.findAll('span.badge')
    // Second chip is paymentMode
    const closeBtn = chips[1].find('button.btn-close')
    await closeBtn.trigger('click')
    const emitted = wrapper.emitted('update:filters')
    expect(emitted).toBeTruthy()
    const updatedFilters = emitted?.[0]?.[0] as ActiveFilters
    expect(updatedFilters.paymentMode).toBeUndefined()
    expect(updatedFilters.status).toBe('disabled')
  })

  it('emits update:filters with inactiveDays removed when its × button is clicked', async () => {
    const initialFilters: ActiveFilters = { inactiveDays: 7 }
    const wrapper = createWrapper({ filters: initialFilters })
    const chips = wrapper.findAll('span.badge')
    const closeBtn = chips[0].find('button.btn-close')
    await closeBtn.trigger('click')
    const emitted = wrapper.emitted('update:filters')
    expect(emitted).toBeTruthy()
    const updatedFilters = emitted?.[0]?.[0] as ActiveFilters
    expect(updatedFilters.inactiveDays).toBeUndefined()
  })

  // ── Add filter dropdown ─────────────────────────────────────────────────────

  it('shows the Add filter dropdown when no filters are active', () => {
    const wrapper = createWrapper({ filters: {} })
    const dropdown = wrapper.find('.dropdown')
    expect(dropdown.exists()).toBe(true)
  })

  it('does not show the Add filter dropdown when all filters are active', () => {
    const wrapper = createWrapper({
      filters: { status: 'enabled', paymentMode: 'monthly', inactiveDays: 7, needsVehicle: true },
    })
    const dropdown = wrapper.find('.dropdown')
    // dropdown is hidden by v-if when availableFilters is empty
    expect(dropdown.exists()).toBe(false)
  })

  it('emits update:filters with status added when a status value is selected', async () => {
    const wrapper = createWrapper({ filters: {} })
    // Open picker for "status"
    const vm = wrapper.vm as any
    vm.openPicker('status')
    await nextTick()
    // Click the 'enabled' status option
    vm.applyStatusFilter('enabled')
    await nextTick()
    const emitted = wrapper.emitted('update:filters')
    expect(emitted).toBeTruthy()
    const updatedFilters = emitted?.[0]?.[0] as ActiveFilters
    expect(updatedFilters.status).toBe('enabled')
  })

  it('emits update:filters with paymentMode added when a payment value is selected', async () => {
    const wrapper = createWrapper({ filters: {} })
    const vm = wrapper.vm as any
    vm.openPicker('paymentMode')
    await nextTick()
    vm.applyPaymentFilter('percentage')
    await nextTick()
    const emitted = wrapper.emitted('update:filters')
    expect(emitted).toBeTruthy()
    const updatedFilters = emitted?.[0]?.[0] as ActiveFilters
    expect(updatedFilters.paymentMode).toBe('percentage')
  })

  it('emits update:filters with inactiveDays added when a canned day count is selected', async () => {
    const wrapper = createWrapper({ filters: {} })
    const vm = wrapper.vm as any
    vm.openPicker('inactiveDays')
    await nextTick()
    vm.applyInactiveFilter(7)
    await nextTick()
    const emitted = wrapper.emitted('update:filters')
    expect(emitted).toBeTruthy()
    const updatedFilters = emitted?.[0]?.[0] as ActiveFilters
    expect(updatedFilters.inactiveDays).toBe(7)
  })

  // ── Search debounce ─────────────────────────────────────────────────────────

  it('emits update:search after 300ms debounce when typing in the search input', async () => {
    jest.useFakeTimers()
    const wrapper = createWrapper({ search: '' })
    const input = wrapper.find('input[type="text"]')

    await input.setValue('john')
    await input.trigger('input')

    // Should not emit immediately
    expect(wrapper.emitted('update:search')).toBeFalsy()

    // Advance timers past debounce
    jest.advanceTimersByTime(300)
    await nextTick()

    const emitted = wrapper.emitted('update:search')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]).toEqual(['john'])

    jest.useRealTimers()
  })

  it('does not emit update:search before the debounce delay elapses', async () => {
    jest.useFakeTimers()
    const wrapper = createWrapper({ search: '' })
    const input = wrapper.find('input[type="text"]')

    await input.setValue('te')
    await input.trigger('input')

    jest.advanceTimersByTime(200)
    await nextTick()

    expect(wrapper.emitted('update:search')).toBeFalsy()

    jest.useRealTimers()
  })

  it('resets the debounce when the user keeps typing', async () => {
    jest.useFakeTimers()
    const wrapper = createWrapper({ search: '' })
    const input = wrapper.find('input[type="text"]')

    await input.setValue('te')
    await input.trigger('input')
    jest.advanceTimersByTime(200)

    // Type more before debounce fires
    await input.setValue('test')
    await input.trigger('input')
    jest.advanceTimersByTime(200)
    await nextTick()

    // Still should not have emitted
    expect(wrapper.emitted('update:search')).toBeFalsy()

    // Now let the full debounce fire
    jest.advanceTimersByTime(100)
    await nextTick()

    const emitted = wrapper.emitted('update:search')
    expect(emitted).toBeTruthy()
    // Should emit the final value
    expect(emitted?.[0]).toEqual(['test'])

    jest.useRealTimers()
  })
})

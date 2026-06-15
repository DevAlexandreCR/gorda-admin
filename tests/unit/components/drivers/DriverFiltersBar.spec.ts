import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import DriverFiltersBar from '@/components/drivers/DriverFiltersBar.vue'
import i18n from '@/plugins/i18n'
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

  it('renders inline status, payment, and inactivity controls with no add-filter UI or chips', () => {
    const wrapper = createWrapper({
      filters: { status: 'enabled', paymentMode: 'monthly', inactiveDays: 7 },
    })

    expect(wrapper.find('.filter-add-dropdown').exists()).toBe(false)
    expect(wrapper.findAll('span.badge')).toHaveLength(0)
    expect(wrapper.find('select.filter-control__select--status').exists()).toBe(true)
    expect(wrapper.find('select.filter-control__select--payment').exists()).toBe(true)
    expect(wrapper.find('select.filter-control__select--inactive').exists()).toBe(true)
  })

  it('clears the status filter when selecting "Todos"', async () => {
    const wrapper = createWrapper({ filters: { status: 'enabled', paymentMode: 'monthly' } })

    await wrapper.find('select.filter-control__select--status').setValue('')

    const emitted = wrapper.emitted('update:filters')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]?.[0]).toEqual({ paymentMode: 'monthly' })
  })

  it('clears the payment filter when selecting "Todos"', async () => {
    const wrapper = createWrapper({ filters: { status: 'disabled', paymentMode: 'percentage' } })

    await wrapper.find('select.filter-control__select--payment').setValue('')

    const emitted = wrapper.emitted('update:filters')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]?.[0]).toEqual({ status: 'disabled' })
  })

  it('clears the inactivity filter when selecting "Ninguno"', async () => {
    const wrapper = createWrapper({ filters: { inactiveDays: 7 } })

    await wrapper.find('select.filter-control__select--inactive').setValue('')

    const emitted = wrapper.emitted('update:filters')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]?.[0]).toEqual({})
  })

  it('keeps a custom inactivity option when one is already active', () => {
    const wrapper = createWrapper({ filters: { inactiveDays: 14 } })
    const options = wrapper.find('select.filter-control__select--inactive').findAll('option')
    const values = options.map((option) => option.attributes('value'))

    expect(values).toContain('14')
  })

  it('emits update:search after 300ms debounce when typing in the search input', async () => {
    jest.useFakeTimers()
    const wrapper = createWrapper({ search: '' })

    await wrapper.find('input[type="text"]').setValue('john')

    expect(wrapper.emitted('update:search')).toBeFalsy()

    jest.advanceTimersByTime(300)
    await nextTick()

    expect(wrapper.emitted('update:search')?.[0]).toEqual(['john'])
    jest.useRealTimers()
  })
})

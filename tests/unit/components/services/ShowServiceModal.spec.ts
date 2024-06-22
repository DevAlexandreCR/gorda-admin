import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import i18n from '@/plugins/i18n'
import ShowServiceModal from '@/components/services/ShowServiceModal.vue'
import ServiceMock from '../../../mocks/entities/ServiceMock'
import { ServiceList } from '@/models/ServiceList'

describe('ShowServiceModal.vue', () => {
  let wrapper: VueWrapper<any>
  let service: ServiceList

  beforeEach(async () => {
    service = new ServiceMock()
    wrapper = mount(ShowServiceModal, {
      props: {
        service: service,
      },
      global: {
        plugins: [i18n],
        mocks: {
          AuthService: {
            getCurrentUser: jest.fn().mockReturnValue({ name: 'Test User' }),
          },
        },
      },
    })
    await nextTick()
  })

  it('renders service start location name correctly', async () => {
    expect(wrapper.find('.modal-title').text()).toContain(service.start_loc.name)
  })

  it('renders status-related fields based on service status', async () => {
    const status = wrapper.vm.$t(`services.statuses.${service.status}`)
    expect(wrapper.text()).toContain(status)
    if (service.status === 'canceled' || service.status === 'terminated') {
      expect(wrapper.text()).toContain('Sistema')
      expect(wrapper.text()).toContain(service.canceled_by ? 'Admin 1' : 'Sistema')
    } else {
      expect(wrapper.text()).not.toContain('canceled_by')
      expect(wrapper.text()).not.toContain('terminated_by')
    }
  })

  it('renders status-related fields based on service status', async () => {
    const status = wrapper.vm.$t(`services.statuses.${service.status}`)
    expect(wrapper.text()).toContain(status)
    if (service.status === 'canceled' || service.status === 'terminated') {
      expect(wrapper.text()).toContain('Sistema')
    } else {
      expect(wrapper.text()).not.toContain('canceled_by')
      expect(wrapper.text()).not.toContain('terminated_by')
    }
  })

  it('renders driver information when driver is present', async () => {
    expect(wrapper.text()).toContain(service.driver?.name)
    expect(wrapper.text()).toContain(service.driver?.vehicle.plate)
  })

  it('does not render driver information when driver is not present', async () => {
    const serviceWithoutDriver = { ...service, driver: null }
    await wrapper.setProps({ service: serviceWithoutDriver })
    await nextTick()
    expect(wrapper.text()).not.toContain('drivers.fields.driver_name')
    expect(wrapper.text()).not.toContain('drivers.fields.plate')
  })

  it('computes time correctly based on service metadata', async () => {
    const serviceWithMetadata = { ...service, metadata: { start_trip_at: 1624160000, end_trip_at: 1624161800 } }
    await wrapper.setProps({ service: serviceWithMetadata })
    await nextTick()
    expect(wrapper.text()).toContain('30min')
  })
  
  it('computes fee correctly based on service metadata', async () => {
    const serviceWithMetadata = { ...service, metadata: { trip_fee: 5000 } }
    await wrapper.setProps({ service: serviceWithMetadata })
    await nextTick()
    expect(wrapper.text()).toContain('5000COP')
  })

  it('computes date correctly based on service created_at', async () => {
    const formattedDate = '02-13 19:31:30'
    const serviceWithCreatedAt = { ...service, created_at: 1234567890 }
    await wrapper.setProps({ service: serviceWithCreatedAt })
    await nextTick()
    console.log(wrapper.text())
    expect(wrapper.text()).toContain(formattedDate)
  })
  
  it('computes createdBy correctly based on service created_by', async () => {
    const serviceWithCreatedBy = { ...service, created_by: true }
    await wrapper.setProps({ service: serviceWithCreatedBy })
    await nextTick()
    expect(wrapper.text()).toContain('Admin 1')
  })
  
  it('computes canceledBy correctly based on service canceled_by', async () => {
    const serviceWithCanceledBy = { ...service, canceled_by: true }
    await wrapper.setProps({ service: serviceWithCanceledBy })
    await nextTick()
    expect(wrapper.text()).toContain('Admin 1')
  })
  
  it('computes terminatedBy correctly based on service terminated_by', async () => {
    const serviceWithTerminatedBy = { ...service, terminated_by: true }
    await wrapper.setProps({ service: serviceWithTerminatedBy })
    await nextTick()
    expect(wrapper.text()).toContain('Admin 1')
  })
  
  it('computes assignedBy correctly based on service assigned_by', async () => {
    const serviceWithAssignedBy = { ...service, assigned_by: true }
    await wrapper.setProps({ service: serviceWithAssignedBy })
    await nextTick()
    expect(wrapper.text()).toContain('Admin 1')
  })
})

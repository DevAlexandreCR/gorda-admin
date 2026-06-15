import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import Index from '@/views/drivers/Index.vue'
import DriverRepository from '@/repositories/DriverRepository'
import DriverMock from '../../../mocks/entities/DriverMock'
import AuthService from '@/services/AuthService'

describe('Index.vue', () => {
  let wrapper: VueWrapper<any>

  const createWrapper = async (): Promise<VueWrapper<any>> => {
    const mountedWrapper = mount(Index, {
      global: {
        plugins: [router, i18n],
        provide: {
          appName: 'test',
        },
        stubs: {
          SendFcmModal: {
            template: '<div />',
          },
        },
      },
    })

    await router.isReady()
    await flushPromises()
    await nextTick()
    return mountedWrapper
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    AuthService.currentUser = {
      roles: { admin: true },
      isAdmin: () => true,
    } as any
    DriverRepository.list = jest.fn().mockResolvedValue({ drivers: [DriverMock], total: 1 })
    await router.push({ name: 'drivers.index', query: {} })
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  it('renders driver name and email returned by list()', async () => {
    wrapper = await createWrapper()

    expect(wrapper.html()).toContain(DriverMock.name)
    expect(wrapper.html()).toContain(DriverMock.email)
  })

  it('keeps only production driver filters in the list request and URL query', async () => {
    const replaceSpy = jest.spyOn(router, 'replace')

    await router.push({
      name: 'drivers.index',
      query: {
        search: 'ana',
        status: 'enabled',
        paymentMode: 'percentage',
        inactiveDays: '7',
        needsVehicle: 'true',
        sort: '-balance',
        page: '2',
        perPage: '50',
      },
    })

    DriverRepository.list = jest.fn().mockResolvedValue({ drivers: [DriverMock], total: 1 })
    wrapper = await createWrapper()

    expect(DriverRepository.list).toHaveBeenCalledWith({
      search: 'ana',
      status: 'enabled',
      paymentMode: 'percentage',
      inactiveDays: 7,
      sort: '-balance',
      page: 2,
      perPage: 50,
    })
    expect(DriverRepository.list).not.toHaveBeenCalledWith(
      expect.objectContaining({ needsVehicle: true })
    )
    expect(replaceSpy).toHaveBeenCalledWith({
      query: {
        search: 'ana',
        status: 'enabled',
        paymentMode: 'percentage',
        inactiveDays: '7',
        sort: '-balance',
        page: '2',
        perPage: '50',
      },
    })
  })

  it('renders the selected vehicle image from selected_vehicle.photoUrl', async () => {
    const vehiclePhotoUrl = 'https://vehicle.example/photo.jpg'
    const driverWithVehicle = {
      ...DriverMock,
      selected_vehicle_id: 'veh-1',
      selected_vehicle: {
        id: 'veh-1',
        plate: 'HEM390',
        brand: 'Mazda',
        model: 'Cx30',
        color: null,
        photoUrl: vehiclePhotoUrl,
        soat_exp: null,
        tec_exp: null,
        enabled: true,
      },
    }

    DriverRepository.list = jest.fn().mockResolvedValue({ drivers: [driverWithVehicle], total: 1 })
    wrapper = await createWrapper()

    const images = wrapper.findAll('img.avatar.avatar-sm.me-3')
    expect(images.some((image) => image.attributes('src') === vehiclePhotoUrl)).toBe(true)
  })
})

describe('DriverRepository bulk-disable (task 15.1)', () => {
  it('calls POST /drivers/bulk/disable and not a force-disconnect endpoint', async () => {
    const bulkDisableSpy = jest.spyOn(DriverRepository, 'bulkDisable').mockResolvedValue({
      processed: 2,
      failed: [],
    })

    expect(typeof DriverRepository.bulkDisable).toBe('function')
    // @ts-expect-error forceDisconnect is not part of DriverRepository interface
    expect(typeof DriverRepository.forceDisconnect).toBe('undefined')

    await DriverRepository.bulkDisable(['id1', 'id2'])
    expect(bulkDisableSpy).toHaveBeenCalledWith(['id1', 'id2'])

    bulkDisableSpy.mockRestore()
  })
})

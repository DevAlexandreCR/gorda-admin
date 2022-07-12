import {flushPromises, shallowMount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import Index from '@/views/drivers/Index.vue'
import DriverRepository from "@/repositories/DriverRepository";
import DriverMock from "../../../mocks/entities/DriverMock";
import {useDriversStore} from '@/services/stores/DriversStore'

DriverRepository.getAll = jest.fn().mockResolvedValue([DriverMock])

describe('Index.vue', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    const driverStore = useDriversStore()
    driverStore.getDrivers()
    wrapper = shallowMount(Index,
      {
        global: {
          plugins: [router, i18n],
          provide: {
            'appName': 'test'
          }
        },
      })
    await router.isReady()
  })
  it('an user can show users list', async () => {
    await wrapper.vm.$nextTick()
    await flushPromises()
    expect(wrapper.html()).toContain(DriverMock.name)
    expect(wrapper.html()).toContain(DriverMock.email)
    expect(wrapper.html()).toContain(DriverMock.photoUrl)
  })
})
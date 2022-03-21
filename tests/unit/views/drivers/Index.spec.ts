import {mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import Index from '@/views/drivers/Index.vue'
import DriverRepository from "@/repositories/DriverRepository";
import DriverMock from "../../../mocks/entities/DriverMock";

DriverRepository.getAll = jest.fn().mockResolvedValue([DriverMock])

describe('Index.vue', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = mount(Index,
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
    wrapper.vm.$nextTick()
    expect(wrapper.html()).toContain(DriverMock.name)
    expect(wrapper.html()).toContain(DriverMock.email)
    expect(wrapper.html()).toContain(DriverMock.photoUrl)
  })
})
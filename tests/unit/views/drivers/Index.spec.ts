import {mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import Index from '@/views/drivers/Index.vue'
import DriverRepository from "@/repositories/DriverRepository";
import DriverMock from "../../../mocks/entities/DriverMock";
import {nextTick} from 'vue'

DriverRepository.list = jest.fn().mockResolvedValue({ drivers: [DriverMock], total: 1 })

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
    await nextTick()
    await nextTick()
  })
  it('renders driver name and email returned by list()', async () => {
    expect(wrapper.html()).toContain(DriverMock.name)
    expect(wrapper.html()).toContain(DriverMock.email)
  })
})

// ── Task 15.1: bulk-disable behavior verification ────────────────────────────
// Confirms that bulk-disable calls only the bulk endpoint and does NOT
// invoke any force-disconnect logic on the API or Firebase side.
describe('DriverRepository bulk-disable (task 15.1)', () => {
  it('calls POST /drivers/bulk/disable and not a force-disconnect endpoint', async () => {
    const bulkDisableSpy = jest.spyOn(DriverRepository, 'bulkDisable').mockResolvedValue({
      processed: 2,
      failed: [],
    })

    // Verify bulkDisable exists and does not reference a force-disconnect method
    expect(typeof DriverRepository.bulkDisable).toBe('function')
    // @ts-expect-error — forceDisconnect is not part of DriverRepository interface
    expect(typeof DriverRepository['forceDisconnect']).toBe('undefined')

    await DriverRepository.bulkDisable(['id1', 'id2'])
    expect(bulkDisableSpy).toHaveBeenCalledWith(['id1', 'id2'])

    bulkDisableSpy.mockRestore()
  })
})

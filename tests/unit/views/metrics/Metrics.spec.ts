import {flushPromises, mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import {nextTick} from 'vue'
import Metrics from '@/views/metrics/Metrics.vue'
import MetricRepository from '@/repositories/MetricRepository'
import {ServiceStatus} from '@/types/ServiceStatus'
import waitForExpect from 'wait-for-expect'

describe('Metrics.vue', () => {
	let wrapper: VueWrapper<any>
	beforeEach(async () => {
		MetricRepository.getGlobal = jest.fn().mockResolvedValue([
			{
				count: 30,
				date: '2023-01-01',
				type: 0,
				status: ServiceStatus.Terminated
			},
			{
				count: 15,
				date: '2023-01-01',
				type: 0,
				status: ServiceStatus.Canceled
			}
		])
		MetricRepository.getTopDrivers = jest.fn().mockResolvedValue(new Map())
		wrapper = mount(Metrics,
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
	it('an user can show metrics', async () => {
		await nextTick()
		await flushPromises()
		await waitForExpect(() => {
			expect(wrapper.find('#global-chart').exists()).toBeTruthy()
			expect(wrapper.find('#percent-chart').exists()).toBeTruthy()
		})
	})
})

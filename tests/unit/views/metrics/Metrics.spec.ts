import {flushPromises, mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import DriverRepository from '@/repositories/DriverRepository';
import DriverMock from '../../../mocks/entities/DriverMock';
import {nextTick} from 'vue'
import Metrics from '@/views/metrics/Metrics.vue'
import {useMetricsStore} from '@/services/stores/MetricsStore'
import axios from 'axios'
import {ServiceStatus} from '@/types/ServiceStatus'
import waitForExpect from 'wait-for-expect'

axios.get = jest.fn().mockResolvedValue({
	data: {
		data: [
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
		]
	}
})

describe('Metrics.vue', () => {
	let wrapper: VueWrapper<any>
	beforeEach(async () => {
		const metricsStore = useMetricsStore()
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

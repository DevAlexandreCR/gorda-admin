import {flushPromises, mount, VueWrapper} from '@vue/test-utils'
import Dashboard from '@/views/Dashboard.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import AuthService from '@/services/AuthService'
import User from '@/models/User'
import UserInterface from '../../mocks/entities/UserMock'
import DriverRepository from '@/repositories/DriverRepository'
import ServiceRepository from '@/repositories/ServiceRepository'
import ServiceMock from '../../mocks/entities/ServiceMock'
import SettingsRepository from "@/repositories/SettingsRepository";

jest.mock('@/services/stores/PlacesStore', () => ({
  usePlacesStore: () => ({
    getPlaces: jest.fn().mockResolvedValue(undefined),
  }),
}))

jest.mock('@/services/stores/ClientsStore', () => ({
  useClientsStore: () => ({
    getClients: jest.fn().mockResolvedValue(undefined),
  }),
}))

jest.mock('@/services/stores/DriversStore', () => ({
  useDriversStore: () => ({
    getDrivers: jest.fn().mockResolvedValue(undefined),
  }),
}))

jest.mock('@/services/stores/ServiceStore', () => ({
  useServicesStore: () => ({
    getHistoryServices: jest.fn().mockResolvedValue(undefined),
    getPendingServices: jest.fn().mockResolvedValue(undefined),
    getInProgressServices: jest.fn().mockResolvedValue(undefined),
  }),
}))

jest.mock('@/services/stores/WpClientStore', () => ({
  useWpClientsStore: () => ({
    getWpClients: jest.fn().mockResolvedValue(undefined),
    getDefault: jest.fn(),
  }),
}))

jest.mock('@/services/stores/SettingsStore', () => ({
  useSettingsStore: () => ({
    getBranches: jest.fn().mockResolvedValue(undefined),
    getRideFees: jest.fn().mockResolvedValue(undefined),
  }),
}))

jest.mock('@/services/stores/MetricsStore', () => ({
  useMetricsStore: () => ({
    getCurrentYearMetric: jest.fn().mockResolvedValue(undefined),
  }),
}))

describe('Dashboard.vue', () => {
  AuthService.currentUser = new User()
  Object.assign(AuthService.currentUser, UserInterface)
  DriverRepository.onlineDriverListener = jest.fn()
	ServiceRepository.getPaginated = jest.fn().mockResolvedValue([ServiceMock])
  ServiceRepository.getCount = jest.fn().mockResolvedValue(1)
  SettingsRepository.getWpClients = jest.fn().mockResolvedValue([])
	let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = mount(Dashboard,
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
  it('an user can show dashboard', async () => {
    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(wrapper.exists()).toBeTruthy()
  })
})

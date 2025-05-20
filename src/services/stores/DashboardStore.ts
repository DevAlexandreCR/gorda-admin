import { DriverPaymentMode } from '@/constants/DriverPaymentMode';
import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    driverFilters: {
      search: '',
      enabled: -1,
      currentPage: 1,
      paymentMode: false as DriverPaymentMode | false,
    }
  }),
  actions: {
    setDriversState(state: { search?: string; enabled?: number; currentPage?: number, paymentMode: DriverPaymentMode | false }) {
      this.driverFilters = {
        ...this.driverFilters,
        ...state
      }
    }
  },
})

import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    drivers: {
      search: '',
      enabled: -1,
      currentPage: 1
    }
  }),
  actions: {
    setDriversState(state: { search?: string; enabled?: number; currentPage?: number }) {
      this.drivers = {
        ...this.drivers,
        ...state
      }
    }
  },
})

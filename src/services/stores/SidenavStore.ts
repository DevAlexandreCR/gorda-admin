import {defineStore} from 'pinia'

const STORAGE_KEY = 'sidenav-rail'

export const useSidenavStore = defineStore('sidenav', {
  state: () => ({
    railCollapsed: localStorage.getItem(STORAGE_KEY) === 'true',
  }),
  actions: {
    toggle(): void {
      this.setCollapsed(!this.railCollapsed)
    },
    setCollapsed(value: boolean): void {
      this.railCollapsed = value
      localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false')
    },
  },
})

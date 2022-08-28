import {defineStore} from 'pinia'

export const useLoadingState = defineStore('clientsState', {
  state: () => {
    return {
      isLoading: false
    }
  },
  actions: {
    setLoading(loading: boolean): void {
      this.isLoading = loading
    }
  }
})
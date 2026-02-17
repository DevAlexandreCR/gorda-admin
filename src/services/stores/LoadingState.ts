import { defineStore } from 'pinia'

export const useLoadingState = defineStore('clientsState', {
  state: () => {
    return {
      isLoading: false,
      loadingCount: 0
    }
  },
  actions: {
    setLoading(loading: boolean): void {
      if (loading) {
        this.loadingCount += 1
      } else {
        this.loadingCount = Math.max(0, this.loadingCount - 1)
      }
      this.isLoading = this.loadingCount > 0
    }
  }
})

import {defineStore} from 'pinia'
import StorageService from '@/services/StorageService'

export const useStorage = defineStore('storage', {
  state: () => {
    return {
      logoUrl: ''
    }
  },
  actions: {
    async getLogoUrl(): Promise<void> {
      this.logoUrl = await StorageService.getDownloadUrl('assets/logo.png')
    }
  }
})
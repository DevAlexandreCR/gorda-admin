import {defineStore} from 'pinia'
import StorageService from '@/services/StorageService'

export const useStorage = defineStore('storage', {
  state: () => {
    return {
      logoUrl: '',
      photoUrl: ''
    }
  },
  actions: {
    async getLogoUrl(): Promise<void> {
      this.logoUrl = await StorageService.getDownloadUrl('assets/logo.png')
    },
    async getDefaultPhotoUrl(): Promise<void> {
      this.photoUrl = await StorageService.getDownloadUrl('assets/default_user.png')
    }
  }
})
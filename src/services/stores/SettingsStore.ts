import {defineStore} from 'pinia'
import SettingsRepository from '@/repositories/SettingsRepository'
import {useLoadingState} from '@/services/stores/LoadingState'

export const useSettingsStore = defineStore('settingsStore', {
  state: () => {
    return {
      settings: {
				wpNotifications: false
			}
    }
  },
  actions: {
    enableWpNotifications(enabled: boolean): void {
			const {setLoading} = useLoadingState()
			setLoading(true)
			SettingsRepository.enableWpNotifications(enabled).then(() => {
				this.settings.wpNotifications = enabled
			}).finally(() => setLoading(false))
    },
		
		async getSettings(): Promise<void> {
			this.settings = await SettingsRepository.getSettings()
		}
  }
})
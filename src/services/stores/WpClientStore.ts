import {defineStore} from 'pinia'
import SettingsRepository from '@/repositories/SettingsRepository'
import {useLoadingState} from '@/services/stores/LoadingState'
import {WpClient} from "@/types/WpClient";
import {ClientDictionary} from "@/types/ClientDiccionary";
import {DataSnapshot} from "firebase/database";

export const useWpClientsStore = defineStore('settingsStore', {
  state: () => {
    return {
      clients: {} as ClientDictionary
    }
  },
  actions: {
    enableWpNotifications(client: WpClient, enabled: boolean): void {
			const {setLoading} = useLoadingState()
			setLoading(true)
			SettingsRepository.enableWpNotifications(client.id, enabled).then(() => {
				this.clients[client.id].wpNotifications = enabled
			}).finally(() => setLoading(false))
    },
		
    async getWpClients(): Promise<void> {
      this.clients = await SettingsRepository.getWpClients()
      console.log(this.clients)
    },

    onWpNotification(client: WpClient): void {
      SettingsRepository.onWpNotifications(client, (snapshot: DataSnapshot) => {
        this.clients[client.id].wpNotifications = snapshot.val()
      })
    },

    offWpNotifications(client: WpClient): void {
      SettingsRepository.offWpNotifications(client)
    }
  }
})
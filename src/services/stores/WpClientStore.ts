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
    },

    onWpNotification(client: WpClient): void {
      SettingsRepository.onWpNotifications(client, (snapshot: DataSnapshot) => {
        this.clients[client.id].wpNotifications = snapshot.val()
      })
    },

    offWpNotifications(client: WpClient): void {
      SettingsRepository.offWpNotifications(client)
    },

    async createClient(client: WpClient): Promise<void> {
      const {setLoading} = useLoadingState()
      setLoading(true)
      await SettingsRepository.createClient(client).then(() => {
        this.clients[client.id] = client
      }).finally(() => setLoading(false))
    },

    async deleteClient(client: WpClient): Promise<void> {
      const {setLoading} = useLoadingState()
      setLoading(true)
      await SettingsRepository.deleteClient(client).then(() => {
        delete this.clients[client.id]
        console.log(this.clients)
      }).finally(() => setLoading(false))
    }
  }
})
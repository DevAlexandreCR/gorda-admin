import {defineStore} from 'pinia'
import Client from '@/models/Client'
import ClientRepository from '@/repositories/ClientRepository'
import countryCodes from '../../assets/location/CountryCodes.json'
import {CountryCodeType} from '@/types/CountryCodeType'
import {ClientInterface} from '@/types/ClientInterface'

interface ClientsState {
	clients: Array<Client>
	countryCodes: Array<CountryCodeType>
}
export const useClientsStore = defineStore('clientsStore', {
  state: (): ClientsState => {
    return {
      clients: Array<Client>(),
			countryCodes: countryCodes
    }
  },
  actions: {
    async getClients() {
      ClientRepository.onAll(async (client) => {
        this.clients.push(client)
      })
    },
    findById(id: string): Client {
      const client = this.clients.find(el => el.id == id)
      return client ?? new Client()
    },
		
		updateClient(client: ClientInterface): void {
			const index = this.clients.findIndex(cl => client.id === cl.id)
			if (index >= 0) {
				this.clients[index] = client
			}
		}
  }
})
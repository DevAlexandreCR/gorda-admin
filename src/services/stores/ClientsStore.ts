import {defineStore} from 'pinia'
import Client from '@/models/Client'
import ClientRepository from '@/repositories/ClientRepository'
import countryCodes from '../../assets/location/CountryCodes.json'
import {CountryCodeType} from '@/types/CountryCodeType'
import {ClientInterface} from '@/types/ClientInterface'
import ClientCache from '@/services/ClientCache'

interface ClientsState {
  clients: Array<Client>
  clientsById: Map<string, Client>
  countryCodes: Array<CountryCodeType>
  currentSearch: string
}
export const useClientsStore = defineStore('clientsStore', {
  state: (): ClientsState => {
    return {
      clients: Array<Client>(),
      clientsById: new Map<string, Client>(),
      countryCodes: countryCodes,
      currentSearch: ''
    }
  },
  actions: {
    buildClient(client: ClientInterface): Client {
      const clientTmp = new Client()
      Object.assign(clientTmp, client)
      return clientTmp
    },
    async getClients(): Promise<void> {
      this.clients = []
      const clients = await ClientRepository.getAll()
      await ClientCache.replaceAll(clients).catch(() => {
        // Swallow cache errors to avoid blocking UI
      })
      await this.searchClients(this.currentSearch)
    },
    async searchClients(term: string): Promise<Array<Client>> {
      this.currentSearch = term
      const results = await ClientCache.search(term)
      this.clients = results.map(client => {
        const built = this.buildClient(client)
        this.clientsById.set(built.id, built)
        return built
      })
      // Ensure reactivity for clientsById updates
      this.clientsById = new Map(this.clientsById)
      return this.clients
    },
    async findById(id: string): Promise<Client | null> {
      const cached = this.clientsById.get(id)
      if (cached) {
        return cached
      }
      const client = await ClientCache.getById(id)
      if (client) {
        const built = this.buildClient(client)
        this.clientsById.set(id, built)
        this.clientsById = new Map(this.clientsById)
        return built
      }
      return null
    },
    async updateClient(client: ClientInterface): Promise<void> {
      const built = this.buildClient(client)
      this.clientsById.set(client.id, built)
      this.clientsById = new Map(this.clientsById)
      await ClientCache.upsert(client).catch(() => {
        // Ignore cache errors
      })
      const index = this.clients.findIndex(cl => client.id === cl.id)
      if (index >= 0) {
        this.clients[index] = built
      }
    }
  }
})

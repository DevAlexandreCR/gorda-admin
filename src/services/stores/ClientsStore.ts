import { defineStore } from 'pinia'
import Client from '@/models/Client'
import ClientRepository from '@/repositories/ClientRepository'
import countryCodes from '../../assets/location/CountryCodes.json'
import { CountryCodeType } from '@/types/CountryCodeType'
import { ClientInterface } from '@/types/ClientInterface'
import ClientCache from '@/services/ClientCache'

interface ClientsState {
  clients: Array<Client>
  results: Array<Client>
  resultsById: Map<string, Client>
  countryCodes: Array<CountryCodeType>
  currentSearch: string
  isHydrating: boolean
  isReady: boolean
  lastSyncedAt: number | null
}

let hydrationPromise: Promise<void> | null = null

export const useClientsStore = defineStore('clientsStore', {
  state: (): ClientsState => {
    return {
      clients: Array<Client>(),
      results: Array<Client>(),
      resultsById: new Map<string, Client>(),
      countryCodes,
      currentSearch: '',
      isHydrating: false,
      isReady: false,
      lastSyncedAt: null,
    }
  },
  actions: {
    buildClient(client: ClientInterface): Client {
      const clientTmp = new Client()
      Object.assign(clientTmp, client)
      return clientTmp
    },
    async syncHydrationState(): Promise<void> {
      const { isReady, lastSyncedAt } = await ClientCache.getHydrationState()
      this.isReady = isReady
      this.lastSyncedAt = lastSyncedAt
    },
    setResults(clients: ClientInterface[]): Array<Client> {
      const nextResultsById = new Map(this.resultsById)
      const nextResults = clients.map((client) => {
        const built = this.buildClient(client)
        nextResultsById.set(built.id, built)
        return built
      })
      this.results = nextResults
      this.clients = nextResults
      this.resultsById = nextResultsById
      return this.results
    },
    async hydrateClientsInBackground(): Promise<void> {
      await this.syncHydrationState()

      if (hydrationPromise) {
        return hydrationPromise
      }

      this.isHydrating = true
      hydrationPromise = (async () => {
        try {
          const clients = await ClientRepository.getAll()
          await ClientCache.replaceAll(clients)
          await this.syncHydrationState()
          await this.searchClients(this.currentSearch, Math.max(this.results.length, 100))
        } finally {
          this.isHydrating = false
          hydrationPromise = null
        }
      })()

      return hydrationPromise
    },
    async getClients(): Promise<void> {
      await this.hydrateClientsInBackground()
    },
    async searchClients(term: string, limit = 100): Promise<Array<Client>> {
      this.currentSearch = term
      await this.syncHydrationState()
      if (!this.isReady && this.clients.length > 0) {
        const normalizedTerm = term.toLowerCase()
        const numericTerm = term.replace(/\D/g, '')
        const fallbackResults = this.clients.filter((client) => {
          const matchesName = normalizedTerm ? client.name.toLowerCase().includes(normalizedTerm) : true
          const matchesPhone = numericTerm ? client.phone.replace(/\D/g, '').includes(numericTerm) : true
          return matchesName || matchesPhone
        }).slice(0, limit)
        this.results = [...fallbackResults]
        return this.results
      }
      const results = await ClientCache.search(term, limit)
      return this.setResults(results)
    },
    async findById(id: string): Promise<Client | null> {
      const cached = this.resultsById.get(id)
      if (cached) {
        return cached
      }
      const client = await ClientCache.getById(id)
      if (client) {
        const built = this.buildClient(client)
        this.resultsById = new Map(this.resultsById).set(id, built)
        return built
      }
      const fallback = this.clients.find((currentClient) => currentClient.id === id) ?? null
      if (fallback) {
        this.resultsById = new Map(this.resultsById).set(id, fallback)
      }
      return fallback
    },
    async updateClient(client: ClientInterface): Promise<void> {
      const built = this.buildClient(client)
      this.resultsById = new Map(this.resultsById).set(client.id, built)
      await ClientCache.upsert(client).catch(() => {
        // Ignore cache errors
      })

      const index = this.results.findIndex((currentClient) => client.id === currentClient.id)
      if (index >= 0) {
        const nextResults = [...this.results]
        nextResults[index] = built
        this.results = nextResults
        this.clients = nextResults
        return
      }

      const normalizedSearch = this.currentSearch.toLowerCase()
      const numericSearch = this.currentSearch.replace(/\D/g, '')
      const matchesCurrentSearch =
        !this.currentSearch ||
        built.name.toLowerCase().includes(normalizedSearch) ||
        built.phone.replace(/\D/g, '').includes(numericSearch)

      if (matchesCurrentSearch && this.results.length > 0) {
        const nextResults = [built, ...this.results].slice(0, this.results.length)
        this.results = nextResults
        this.clients = nextResults
      }
    },
  },
})

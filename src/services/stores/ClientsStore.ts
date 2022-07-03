import {defineStore} from 'pinia'
import Client from '@/models/Client'
import ClientRepository from '@/repositories/ClientRepository'

export const useClientsStore = defineStore('clientsStore', {
  state: () => {
    return {
      clients: Array<Client>()
    }
  },
  actions: {
    async getClients() {
      const clients: Array<Client> = []
      ClientRepository.onAll(async (client) => {
        clients.push(client)
      })
      this.clients = clients
    },
    findById(id: string): Client {
      const client = this.clients.find(el => el.id == id)
      return client ?? new Client()
    }
  }
})
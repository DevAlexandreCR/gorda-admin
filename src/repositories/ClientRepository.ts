import { ClientInterface } from '@/types/ClientInterface'
import ClientsApiService from '@/services/gordaApi/server/ClientsApiService'

class ClientRepository {

  /* istanbul ignore next */
  async getAll(): Promise<Array<ClientInterface>> {
    return ClientsApiService.index()
      .then(response => {
        if (!response?.data) {
          console.warn('Invalid response structure from ClientsApiService.index')
          return []
        }

        const { data } = response
        if (!data.success) {
          console.error('API returned error:', data.message || 'Unknown error')
          return []
        }

        const clients = data.data?.clients
        if (!Array.isArray(clients)) {
          console.warn('Clients data is not an array or is missing')
          return []
        }

        return clients as Array<ClientInterface>
      })
      .catch(error => {
        console.error('Error fetching clients:', error)
        return []
      })
  }

  /* istanbul ignore next */
  async create(client: ClientInterface): Promise<ClientInterface> {
    return ClientsApiService.store(client)
      .then(response => {
        if (response?.data?.success && response.data.data?.client) {
          return response.data.data.client as ClientInterface
        }

        throw new Error(response?.data?.message ?? 'Error storing client')
      })
      .catch(error => {
        console.error('Error storing client:', error)
        throw error
      })
  }
}

export default new ClientRepository()

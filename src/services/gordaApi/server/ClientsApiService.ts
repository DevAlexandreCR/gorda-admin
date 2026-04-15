import { ClientInterface } from '@/types/ClientInterface'
import { AxiosResponse } from 'axios'
import serverApi, { ApiResponse } from './ServerApi'

export default {
  async index(): Promise<AxiosResponse<ApiResponse<{ clients: ClientInterface[] }>>> {
    return serverApi.get<ApiResponse<{ clients: ClientInterface[] }>>('/clients')
  },

  async store(client: ClientInterface): Promise<AxiosResponse<ApiResponse<{ client: ClientInterface }>>> {
    return serverApi.post<ApiResponse<{ client: ClientInterface }>>('/clients', {
      id: client.id,
      name: client.name,
      phone: client.phone,
    })
  },
}

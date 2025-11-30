import { ClientInterface } from '@/types/ClientInterface'
import axios, { AxiosResponse } from 'axios'

const API_BASE = process.env.VUE_APP_WP_CLIENT_API_URL
const API_PORT = process.env.VUE_APP_WP_CLIENT_API_PORT
const API_KEY = process.env.VUE_APP_GORDA_API_KEY

axios.defaults.headers.common['Authorization'] = `Bearer ${API_KEY}`

export interface ApiResponse {
  success: boolean
  message?: string
  data: { [key: string]: any }
}

export default {
  async index(): Promise<AxiosResponse<ApiResponse>> {
    return axios.get<ApiResponse>(`${API_BASE}:${API_PORT}/clients`)
  },

  async store(client: ClientInterface): Promise<AxiosResponse<ApiResponse>> {
    return axios.post<ApiResponse>(`${API_BASE}:${API_PORT}/clients`, {
      id: client.id,
      name: client.name,
      phone: client.phone,
    })
  },
}

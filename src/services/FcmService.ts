import axios, { AxiosResponse } from 'axios'

const API_BASE = process.env.VUE_APP_GORDA_API_URL

export interface FcmResponse {
  success: boolean
  message?: string
  [key: string]: any
}

export default {
  async sendToDriver(driverId: string, message: string): Promise<AxiosResponse<FcmResponse>> {
    return axios.post<FcmResponse>(`${API_BASE}/messages/drivers`, {
      to: driverId,
      message: message,
    })
  },

  async sendToAllDrivers(message: string): Promise<AxiosResponse<FcmResponse>> {
    return axios.post<FcmResponse>(`${API_BASE}/messages/drivers`, {
      to: null,
      message: message,
    })
  },
}
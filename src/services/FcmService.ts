import { FCMNotification } from '@/types/FCMNotifications'
import axios, { AxiosResponse } from 'axios'

const API_BASE = process.env.VUE_APP_WP_CLIENT_API_URL
const API_PORT = process.env.VUE_APP_WP_CLIENT_API_PORT

export interface FcmResponse {
  success: boolean
  message?: string
  [key: string]: any
}

export default {
  async sendToDriver(driverId: string, message: FCMNotification): Promise<AxiosResponse<FcmResponse>> {
    return axios.post<FcmResponse>(`${API_BASE}:${API_PORT}/messages/drivers`, {
      to: driverId,
      message: message,
    })
  },

  async sendToAllDrivers(message: FCMNotification): Promise<AxiosResponse<FcmResponse>> {
    return axios.post<FcmResponse>(`${API_BASE}:${API_PORT}/messages/drivers`, {
      to: null,
      message: message,
    })
  },
}
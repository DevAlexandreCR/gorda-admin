import axios, { AxiosResponse } from 'axios'
import ToastService from './ToastService'

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
      all: false,
      message: message,
    }).catch((error) => {
        ToastService.toast(ToastService.ERROR, 'Error', error.message)
        return {
          data: {
            success: false,
            message: error.message,
          },
        } as AxiosResponse<FcmResponse>
    })
  },

  async sendToAllDrivers(message: string): Promise<AxiosResponse<FcmResponse>> {
    return axios.post<FcmResponse>(`${API_BASE}/messages/drivers`, {
      all: true,
      message: message,
    }).catch((error) => {
        ToastService.toast(ToastService.ERROR, 'Error', error.message)
        return {
          data: {
            success: false,
            message: error.message,
          },
        } as AxiosResponse<FcmResponse>
    })
  },
}
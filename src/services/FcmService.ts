import { FCMNotification } from '@/types/FCMNotifications'
import { AxiosResponse } from 'axios'
import serverApi from '@/services/gordaApi/server/ServerApi'

export interface FcmResponse {
  success: boolean
  message?: string
  [key: string]: any
}

export default {
  async sendToDriver(driverId: string, message: FCMNotification): Promise<AxiosResponse<FcmResponse>> {
    return serverApi.post<FcmResponse>('/messages/drivers', {
      to: driverId,
      message: message,
    })
  },

  async sendToAllDrivers(message: FCMNotification): Promise<AxiosResponse<FcmResponse>> {
    return serverApi.post<FcmResponse>('/messages/drivers', {
      to: null,
      message: message,
    })
  },
}

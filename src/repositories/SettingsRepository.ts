import { WpClient } from '@/types/WpClient'
import { RideFeeInterface } from '@/types/RideFeeInterface'
import { ClientDictionary } from '@/types/ClientDiccionary'
import { SettingsMessageInterface } from '@/types/SettingsMessagesInterface'
import { Branch } from '@/types/Branch'
import { DynamicMultiplier } from '@/types/DynamicMultiplier'
import serverApi, { ApiResponse } from '@/services/gordaApi/server/ServerApi'

class SettingsRepository {
  async getPublicWpClient(clientId: string): Promise<WpClient | null> {
    const response = await serverApi.get<ApiResponse<{ client: WpClient }>>(
      `/public/master-data/wp-clients/${clientId}`
    )

    return response.data.data.client ?? null
  }

  async getWpClients(): Promise<ClientDictionary> {
    const response = await serverApi.get<ApiResponse<{ clients: WpClient[] }>>('/master-data/wp-clients')
    const clients: ClientDictionary = {}

    response.data.data.clients.forEach((client) => {
      clients[client.id] = client
    })

    return clients
  }

  async getMessages(): Promise<Array<SettingsMessageInterface>> {
    const response = await serverApi.get<ApiResponse<{ messages: SettingsMessageInterface[] }>>(
      '/master-data/chatbot-messages'
    )

    return response.data.data.messages
  }

  async updateMessage(message: SettingsMessageInterface): Promise<void> {
    await serverApi.put(`/master-data/chatbot-messages/${message.id}`, message)
  }

  async updateRideFee(rideFee: RideFeeInterface): Promise<void> {
    await serverApi.put('/master-data/ride-fees', rideFee)
  }

  async addMultiplier(multipliers: DynamicMultiplier[], multiplier: DynamicMultiplier): Promise<void> {
    multipliers.push(multiplier)
    const current = await this.getRideFeesSnapshot()
    await this.updateRideFee({
      ...current,
      dynamic_multipliers: multipliers,
    })
  }

  async removeMultiplier(multipliers: DynamicMultiplier[], index: number): Promise<void> {
    multipliers.splice(index, 1)
    const current = await this.getRideFeesSnapshot()
    await this.updateRideFee({
      ...current,
      dynamic_multipliers: multipliers,
    })
  }

  async getRideFees(): Promise<RideFeeInterface> {
    return this.getRideFeesSnapshot()
  }

  async getBranches(): Promise<Branch[]> {
    const response = await serverApi.get<ApiResponse<{ branches: Branch[] }>>(
      '/master-data/branches'
    )
    return response.data.data.branches
  }

  enableWpNotifications(clientId: string, enable: boolean): Promise<void> {
    return serverApi
      .patch(`/master-data/wp-clients/${clientId}`, { wpNotifications: enable })
      .then(() => undefined)
  }

  enableChatBot(clientId: string, enable: boolean): Promise<void> {
    return serverApi
      .patch(`/master-data/wp-clients/${clientId}`, { chatBot: enable })
      .then(() => undefined)
  }

  enableAssistant(clientId: string, enable: boolean): Promise<void> {
    return serverApi
      .patch(`/master-data/wp-clients/${clientId}`, { assistant: enable })
      .then(() => undefined)
  }

  enableFull(clientId: string, enable: boolean): Promise<void> {
    return serverApi.patch(`/master-data/wp-clients/${clientId}`, { full: enable }).then(() => undefined)
  }

  onWpNotifications(_client: WpClient, _listener: (enable: unknown) => void): void {
    return
  }

  offWpNotifications(_client: WpClient): void {
    return
  }

  createClient(client: WpClient): Promise<void> {
    return serverApi.post('/master-data/wp-clients', client).then(() => undefined)
  }

  deleteClient(client: WpClient): Promise<void> {
    return serverApi.delete(`/master-data/wp-clients/${client.id}`).then(() => undefined)
  }

  async setPercentage(branchId: string, cityId: string, percentage: number): Promise<void> {
    await serverApi.patch(`/master-data/branches/${branchId}/cities/${cityId}`, { percentage })
  }

  private async getRideFeesSnapshot(): Promise<RideFeeInterface> {
    const response = await serverApi.get<ApiResponse<{ rideFees: RideFeeInterface }>>(
      '/master-data/ride-fees'
    )

    return response.data.data.rideFees
  }
}

export default new SettingsRepository()

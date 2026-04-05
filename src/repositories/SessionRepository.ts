import serverApi, { ApiResponse } from '@/services/gordaApi/server/ServerApi'
import { SessionStatuses } from '@/constants/SessionStatuses'
import { ActiveChatSession } from '@/types/ActiveChatSession'

class SessionRepository {
  async updateSessionStatus(
    sessionId: string,
    status: SessionStatuses
  ): Promise<ActiveChatSession> {
    const response = await serverApi.patch<ApiResponse<{ session: any }>>(
      `/whatsapp/sessions/${sessionId}`,
      { status }
    )

    const session = response.data.data.session

    return {
      sessionId: session.id,
      status: session.status,
      service_id: session.service_id,
      notifications: session.notifications,
      place: session.place,
      placeOptions: session.placeOptions ?? []
    }
  }
}

export default new SessionRepository()

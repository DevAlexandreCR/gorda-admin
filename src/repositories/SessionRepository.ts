import FSService from '@/services/FSService'
import { doc, updateDoc } from 'firebase/firestore'
import { SessionStatuses } from '@/constants/SessionStatuses'

class SessionRepository {

  async claim(wpClientId: string, sessionId: string): Promise<void> {
    const sessionCollection = FSService.sessionCollection(sessionId)
    await updateDoc(doc(sessionCollection, sessionId), { status: SessionStatuses.SUPPORT }).catch(error => {
      console.log(error.message)
    })
  }
}

export default new SessionRepository()
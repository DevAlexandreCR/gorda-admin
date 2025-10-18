import FSService from '@/services/FSService'
import { doc, query, updateDoc, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { SessionStatuses } from '@/constants/SessionStatuses'

class SessionRepository {

  async claim(wpClientId: string, chatId: string): Promise<void> {
    const sessionCollection = FSService.sessionCollection()
    query(sessionCollection)
  }

  async findLastNonCompletedSessionByChatId(chatId: string): Promise<any | null> {
    const sessionCollection = FSService.sessionCollection()
    const queryConstraints = [
      where('chat_id', '==', chatId),
      orderBy('created_at', 'desc'), // Get the most recent
      limit(1)
    ]

    const sessionQuery = query(sessionCollection, ...queryConstraints)

    return getDocs(sessionQuery)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]
          return { id: doc.id, ...doc.data() }
        }
        return null
      })
      .catch((error) => {
        console.error('Error finding last non-completed session:', error)
        return Promise.reject(error)
      })
  }

  async updateSessionStatus(sessionId: string, status: SessionStatuses): Promise<void> {
    const sessionCollection = FSService.sessionCollection()
    const sessionDoc = doc(sessionCollection, sessionId)

    return updateDoc(sessionDoc, {
      status: status,
      updated_at: Date.now()
    }).catch((error) => {
      console.error('Error updating session status:', error)
      return Promise.reject(error)
    })
  }

  async setLastNonCompletedSessionToSupport(chatId: string): Promise<boolean> {
    return this.findLastNonCompletedSessionByChatId(chatId)
      .then((session) => {
        if (session) {
          return this.updateSessionStatus(session.id, SessionStatuses.SUPPORT)
            .then(() => {
              console.log(`Session ${session.id} for chat ${chatId} updated to SUPPORT status`)
              return true
            })
        } else {
          console.log(`No non-completed session found for chat ${chatId}`)
          return false
        }
      })
      .catch((error) => {
        console.error('Error setting session to support:', error)
        return Promise.reject(error)
      })
  }
}

export default new SessionRepository()
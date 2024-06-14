import { getFirestore, Firestore, collection, doc, CollectionReference, DocumentReference, DocumentData } from 'firebase/firestore';
import Firebase from '@/services/Firebase';

class FirestoreService {
  public fs: Firestore = getFirestore(Firebase.getInstance());

  /* istanbul ignore next */
  public servicesCollection(): CollectionReference<DocumentData> {
    return collection(this.fs, 'services');
  }

  /* istanbul ignore next */
  public chatsCollection(wpClientId: string): CollectionReference<DocumentData> {
    return collection(this.fs, `wpClients/${wpClientId}/chats`)
  }

  /* istanbul ignore next */
  public wpMessagesCollection(wpClientId: string, chatId: string): CollectionReference<DocumentData> {
    return collection(this.fs, `wpClients/${wpClientId}/chats/${chatId}/messages`)
  }

  /* istanbul ignore next */
  public messagesCollection(): CollectionReference<DocumentData> {
    return collection(this.fs, 'messages');
  }
}

export default new FirestoreService();
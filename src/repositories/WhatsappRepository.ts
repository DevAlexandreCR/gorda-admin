import FSService from '@/services/FSService';
import { collection, addDoc, getDocs, DocumentData, doc, updateDoc } from 'firebase/firestore';

interface  MessageInterface  {
  message: string
}


class WhatsappRepository {

  /* istanbul ignore next */
  async getAll(): Promise<DocumentData[]> {
    const messagesCollection = collection(FSService.fs, 'messages');
    const querySnapshot = await getDocs(messagesCollection);
    const messages: DocumentData[] = [];

    querySnapshot.forEach(doc => {
      messages.push(doc.data());
    });

    return messages;
  }

  /* istanbul ignore next */
  async create(message: MessageInterface): Promise<MessageInterface> {
    return new Promise((resolve, reject) => {
      const messagesCollection = collection(FSService.fs, 'messages');
      addDoc(messagesCollection, message)
        .then(() => {
          resolve(message);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
export default new WhatsappRepository();
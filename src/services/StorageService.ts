import Firebase from '@/services/Firebase'
import {FirebaseStorage, getDownloadURL, getStorage, ref, StorageReference, uploadBytes} from 'firebase/storage'

class StorageService {
  public storage: FirebaseStorage = getStorage(Firebase.getInstance())

  /* istanbul ignore next */
  stAdminProfileImages(id: string, name: string): StorageReference {
    return ref(this.storage, `images/admin/profile/${id}/${name}`)
  }

  /* istanbul ignore next */
  async uploadFile(reference: StorageReference, file: File): Promise<string> {
    await uploadBytes(reference, file)
    return getDownloadURL(reference)
  }
}

export default new StorageService()
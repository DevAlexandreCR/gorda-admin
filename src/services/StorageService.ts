import Firebase from '@/services/Firebase'
import {FirebaseStorage, getDownloadURL, getStorage, ref, StorageReference, uploadBytes} from 'firebase/storage'

class StorageService {
  public storage: FirebaseStorage = getStorage(Firebase.getInstance())

  /* istanbul ignore next */
  stAdminProfileImages(id: string, name: string): StorageReference {
    return ref(this.storage, `images/admin/profile/${id}/${name}`)
  }

  /* istanbul ignore next */
  async uploadFile(ref: StorageReference, file: File): Promise<string> {
    await uploadBytes(ref, file)
    return getDownloadURL(ref)
  }
}

export default new StorageService()
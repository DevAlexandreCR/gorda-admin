import Firebase from '@/services/Firebase'
import {FirebaseStorage, getDownloadURL, getStorage, ref, StorageReference, uploadBytes} from 'firebase/storage'

class StorageService {
  public storage: FirebaseStorage = getStorage(Firebase.getInstance())
  public profilePath = 'images/admin/profile'
  public driverPath = 'images/drivers/profile'
  public vehiclePath = 'images/drivers/vehicles'

  /* istanbul ignore next */
  getStorageReference(path: string, id: string, name: string): StorageReference {
    return ref(this.storage, `${path}/${id}/${name}`)
  }

  /* istanbul ignore next */
  async uploadFile(reference: StorageReference, file: File): Promise<string> {
    await uploadBytes(reference, file)
    return getDownloadURL(reference)
  }

  /* istanbul ignore next */
  async getDownloadUrl(path: string): Promise<string> {
    const reference = ref(this.storage, path)
    return getDownloadURL(reference)
  }
}

export default new StorageService()
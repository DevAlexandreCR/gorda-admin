import {WPObserver} from '@/services/gordaApi/interfaces/WPObserver'
import {WPSubject} from '@/services/gordaApi/interfaces/WPSubject'

export class ClientObserver implements WPObserver {
  onUpdate: (subject: WPSubject) => void
  
  constructor(onUpdate: (subject: WPSubject) => void) {
    this.onUpdate = onUpdate
  }
  public update(subject: WPSubject): void {
    this.onUpdate(subject)
  }
}
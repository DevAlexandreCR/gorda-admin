import {WPObserver} from '@/services/gordaApi/interfaces/WPObserver'

export interface WPSubject {
  attach(observer: WPObserver): void
  
  detach(observer: WPObserver): void
  
  notify(): void
}
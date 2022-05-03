import {WPSubject} from "@/services/gordaApi/interfaces/WPSubject";

export interface WPObserver {
  update(subject: WPSubject): void
}
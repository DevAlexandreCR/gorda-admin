import {ServiceInterface} from "@/types/ServiceInterface";

export class DataSnapshot {
  service: ServiceInterface
  key: string
  
  constructor(service: ServiceInterface) {
    this.service = service
    this.key = service.id!
  }
  
  val(): ServiceInterface {
    return this.service
  }
}
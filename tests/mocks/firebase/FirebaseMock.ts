import {ServiceInterface} from "@/types/ServiceInterface";

export class DataSnapshot {
  service: ServiceInterface
  
  constructor(service: ServiceInterface) {
    this.service = service
  }
  
  val(): ServiceInterface {
    return this.service
  }
}
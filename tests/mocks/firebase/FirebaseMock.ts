import {ServiceInterface} from "@/entities/ServiceInterface";

export class DataSnapshot {
  service: ServiceInterface
  
  constructor(service: ServiceInterface) {
    this.service = service
  }
  
  val(): ServiceInterface {
    return this.service
  }
}
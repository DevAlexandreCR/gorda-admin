import {io, Socket} from 'socket.io-client'
import {WPSubject} from '@/services/gordaApi/interfaces/WPSubject'
import {WPObserver} from '@/services/gordaApi/interfaces/WPObserver'
import {WhatsApp} from '@/services/gordaApi/constants/WhatsApp'

export default class WhatsAppClient implements WPSubject {
  
  private static instance: WhatsAppClient
  private socket: Socket
  public state = WhatsApp.STATUS_DISCONNECTED
  public qr: string
  private observers: WPObserver[] = []
  
  constructor() {
    this.socket = io(process.env.VUE_APP_WP_CLIENT_API_URL as string)
    this.onQRCode()
    this.getState()
    this.onReady()
    this.onChangeState()
    this.onDisconnected()
  }
  
  public static getInstance(): WhatsAppClient {
    if (!WhatsAppClient.instance) {
      WhatsAppClient.instance = new WhatsAppClient()
    }
    
    return WhatsAppClient.instance
  }
  
  auth(): void {
    this.socket.emit(WhatsApp.EVENT_AUTH)
  }
  
  getState(): void {
    this.socket.on(WhatsApp.EVENT_CLIENT, (info) => {
      if(info) this.socket.emit(WhatsApp.EVENT_GET_STATE)
    })
    this.socket.on(WhatsApp.EVENT_GET_STATE, (state: string) => {
      this.state = state
      this.notify()
    })
  }
  
  onQRCode(): void {
    this.socket.on(WhatsApp.EVENT_QR_CODE, (qr: string) => {
      this.qr = qr
      this.notify()
    })
  }
  
  onReady(): void {
    this.socket.on(WhatsApp.EVENT_READY, () => {
      this.state = WhatsApp.STATUS_CONNECTED
      this.notify()
    })
  }
  
  onChangeState(): void {
    this.socket.on(WhatsApp.EVENT_CHANGE_STATE, (message) => {
      this.state = message
      this.notify()
    })
  }
  
  onDisconnected(): void {
    this.socket.on(WhatsApp.EVENT_DISCONNECTED, (message) => {
      this.state = message
      this.notify()
    })
  }
  
  destroy(): void {
    this.socket.emit(WhatsApp.EVENT_DESTROY)
  }
  
  reset(): void {
    this.socket.emit(WhatsApp.EVENT_RESET)
    this.socket.on(WhatsApp.EVENT_RESET, (state) => {
      this.state = state
      this.notify()
    })
  }
  
  disconnectSocket(): void {
    this.socket.disconnect()
  }
  
  isConnected(): boolean {
    return this.state === WhatsApp.STATUS_CONNECTED
  }
  
  attach(observer: WPObserver): void {
    const isExist = this.observers.includes(observer)
    if (!isExist) this.observers.push(observer)
  }
  
  detach(observer: WPObserver): void {
    const observerIndex = this.observers.indexOf(observer)
    if (observerIndex !== -1) this.observers.splice(observerIndex, 1)
  }
  
  notify(): void {
    for (const observer of this.observers) {
      observer.update(this)
    }
  }
}
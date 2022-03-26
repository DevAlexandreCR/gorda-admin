import {io, Socket} from "socket.io-client"

export default class SocketClient {
  
  private static socket: Socket
  public static readonly QR_CODE = 'qr-code'
  public static readonly READY = 'whatsapp-ready'
  public static readonly AUTH = 'auth'
  
  public static initClient(): void {
    console.log('init')
    SocketClient.getSocket().emit(SocketClient.AUTH)
  }
  
  public static getSocket(): Socket {
    if (!SocketClient.socket) {
      SocketClient.socket = io("http://localhost:3000")
    }
    
    return SocketClient.socket
  }
  
  public static onQRCode(): Promise<string> {
    return new Promise(resolve => {
      SocketClient.getSocket().on(SocketClient.QR_CODE, (qr: string) => {
        resolve(qr)
      })
    })
  }
  
  public static onReady(): Promise<boolean> {
    return new Promise(resolve => {
      SocketClient.getSocket().on(SocketClient.READY, () => {
        resolve(true)
      })
    })
  }
}
import AuthService from '@/services/AuthService'
import User from '@/models/User'
import UserMock from './mocks/entities/UserMock'
import {createServer, Server as httpServer} from 'http'
import {Server} from 'socket.io'
import WhatsAppClient from '@/services/gordaApi/WhatsAppClient'
import {config, enableAutoUnmount} from '@vue/test-utils'
import {createPinia, setActivePinia} from 'pinia'
import {WpClient} from '@/types/WpClient'
import {AddressInfo} from 'net'
require('./mocks/maps/googleMaps')

class AudioContextMock {
  createGain(): { connect: jest.Mock; gain: { value: number } } {
    return {
      connect: jest.fn(),
      gain: {
        value: 1,
      },
    }
  }

  createBufferSource(): { connect: jest.Mock; start: jest.Mock; stop: jest.Mock } {
    return {
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    }
  }

  decodeAudioData(): Promise<ArrayBuffer> {
    return Promise.resolve(new ArrayBuffer(0))
  }

  get destination(): Record<string, never> {
    return {}
  }
}

(window as any).AudioContext = AudioContextMock
;(window as any).webkitAudioContext = AudioContextMock



jest.mock('google-maps')
jest.mock('vue-advanced-chat', () => ({
  register: jest.fn(),
}))
jest.mock('firebase/app')
jest.mock('firebase/auth', () => {
  return {
    signOut: jest.fn().mockResolvedValue(null),
    getAuth: jest.fn().mockResolvedValue(null),
    connectAuthEmulator: jest.fn(),
    onAuthStateChanged: jest.fn().mockResolvedValue({
      uid: 'fake-id-user'
    })
  }
})
jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
  fire: jest.fn(),
}))
jest.mock('firebase/database', () => {
  return {
    getDatabase: jest.fn(),
    connectDatabaseEmulator: jest.fn(),
    get: jest.fn().mockResolvedValue({
      val: () => {return {}},
      forEach: (callback: any): void => {callback()}
    }),
    ref: jest.fn(),
    orderByChild: jest.fn(),
    startAfter: jest.fn(),
    endBefore: jest.fn(),
    equalTo: jest.fn(),
    query: jest.fn(),
    onChildAdded: jest.fn().mockResolvedValue({
      val: () => {return {}},
      forEach: (callback: any): void => {callback()}
    }),
    onChildChanged: jest.fn().mockResolvedValue({
      val: () => {return {}},
      forEach: (callback: any): void => {callback()}
    }),
    onChildRemoved: jest.fn().mockResolvedValue({
      val: () => {return {}},
      forEach: (callback: any): void => {callback()}
    }),
		onValue: jest.fn().mockResolvedValue({
			val: () => {return false}
		}),
		off: jest.fn(),
		set: jest.fn(),
    remove: jest.fn().mockResolvedValue(null),
    child: jest.fn(),
    update: jest.fn().mockResolvedValue(null)
  }
})
jest.mock('firebase/firestore', () => {
  return {
    getFirestore: jest.fn(),
    connectFirestoreEmulator: jest.fn(),
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn().mockResolvedValue({
      data: () => { return {} }
    }),
    getDocs: jest.fn().mockResolvedValue({
      forEach: (callback: any): void => { callback() }
    }),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    limitToLast: jest.fn(),
    startAt: jest.fn(),
    startAfter: jest.fn(),
    endBefore: jest.fn(),
    getCountFromServer: jest.fn(),
    onSnapshot: jest.fn().mockReturnValue({
      forEach: (callback: any): void => { callback() }
    }),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
  };
});

jest.mock('firebase/storage')
jest.mock('qrcode')

const pinia = createPinia()

config.global.plugins = [
  pinia
]

beforeEach(() => {
  const div = document.createElement('div')
  div.id = 'root'
  document.body.appendChild(div)
  setActivePinia(pinia)
})

enableAutoUnmount(afterEach)

AuthService.currentUser = Object.assign(new User(), UserMock)

let socket: Server
let server: httpServer

function openServer(done: jest.DoneCallback | (() => void)): void {
  server = createServer()
  socket = new Server(server)
  server.listen(0,() => {
    const address = server.address() as AddressInfo
    process.env.VUE_APP_WP_CLIENT_API_URL = 'http://localhost'
    process.env.VUE_APP_WP_CLIENT_API_PORT = String(address.port)
    socket.on('connection', () => {
      done()
    })
    const instances = (WhatsAppClient as any).instances ?? {}
    Object.values(instances).forEach((client: any) => client.disconnectSocket?.())
    ;(WhatsAppClient as any).instances = {}
    WhatsAppClient.getInstance({
      id: '3103794656',
      wpNotifications: false,
      chatBot: false,
      alias: 'Test'
    } as WpClient)
  })
}

export {
  socket,
  server,
  openServer
}

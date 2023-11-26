import AuthService from '@/services/AuthService'
import User from '@/models/User'
import UserMock from './mocks/entities/UserMock'
import {createServer, Server as httpServer} from 'http'
import {Server} from 'socket.io'
import WhatsAppClient from '@/services/gordaApi/WhatsAppClient'
import {enableAutoUnmount, config} from '@vue/test-utils'
import {createPinia, setActivePinia} from 'pinia'

require('./mocks/maps/googleMaps')

jest.mock('google-maps')
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
jest.mock('sweetalert2')
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
    child: jest.fn()
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
jest.setTimeout(60000)

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

function openServer(done: () => void): void {
  server = createServer()
  socket = new Server(server)
  server.listen(process.env.VUE_APP_WP_CLIENT_API_PORT ?? 3000,() => {
    socket.on('connection', () => {
      done()
    })
    WhatsAppClient.getInstance()
  })
}

export {
  socket,
  server,
  openServer
}
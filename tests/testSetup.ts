import AuthService from '@/services/AuthService'
import User from '@/models/User'
import UserMock from './mocks/entities/UserMock'
import {createServer, Server as httpServer} from 'http'
import {Server} from 'socket.io'
import WhatsAppClient from '@/services/gordaApi/WhatsAppClient'
import {enableAutoUnmount, config} from '@vue/test-utils'
import {createPinia, setActivePinia} from 'pinia'

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
    get: jest.fn().mockResolvedValue({val: () => {return {}}}),
    ref: jest.fn(),
    orderByChild: jest.fn(),
    startAfter: jest.fn(),
    query: jest.fn(),
    onChildAdded: jest.fn(),
    onChildChanged: jest.fn(),
    set: jest.fn(),
    child: jest.fn()
  }
})
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

function openServer(done: Function): void{
  server = createServer()
  socket = new Server(server)
  WhatsAppClient.getInstance()
  server.listen(process.env.VUE_APP_WP_CLIENT_API_PORT ?? 3000,() => {
    socket.on('connection', () => {
      done()
    })
  })
}

export {
  socket,
  server,
  openServer
}
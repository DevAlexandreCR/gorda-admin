import AuthService from '@/services/AuthService'
import User from '@/models/User'
import UserMock from './mocks/entities/UserMock'
import {createServer, Server as httpServer} from 'http'
import {Server} from 'socket.io'
import WhatsAppClient from '@/services/gordaApi/WhatsAppClient'
import {DataSnapshot} from './mocks/firebase/FirebaseMock'
import ServiceMock from './mocks/entities/ServiceMock'
import {startAfter} from 'firebase/database'

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
const snapshot = new DataSnapshot(ServiceMock)
jest.mock('firebase/database', () => {
  // console.log(snapshot)
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
    // get: jest.fn().mockResolvedValue(snapshot)
  }
})
jest.mock('firebase/storage')
jest.mock('qrcode')


const div = document.createElement('div')
div.id = 'root'
document.body.appendChild(div)

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
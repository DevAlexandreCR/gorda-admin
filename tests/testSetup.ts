import AuthService from '@/services/AuthService'
import User from '@/models/User'
import UserMock from './mocks/entities/UserMock'
import {createServer} from 'http'
import {Server} from 'socket.io'
import WhatsAppClient from '@/services/gordaApi/WhatsAppClient'

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
jest.mock('firebase/database')
jest.mock('firebase/storage')
jest.mock('qrcode')


const div = document.createElement('div')
div.id = 'root'
document.body.appendChild(div)

AuthService.currentUser = Object.assign(new User(), UserMock)

let socket: Server
let client: WhatsAppClient
beforeAll((done) => {
  const httpServer = createServer()
  socket = new Server(httpServer)
  httpServer.listen(process.env.VUE_APP_WP_CLIENT_API_PORT,() => {
    client = WhatsAppClient.getInstance()
    socket.on('connection', () => {
      done()
    })
  })
})

afterAll(() => {
  socket.close()
})

export {
  socket,
  client
}
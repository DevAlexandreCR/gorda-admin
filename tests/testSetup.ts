import {config} from '@vue/test-utils'
import AuthService from '@/services/AuthService'
import User from '@/models/User'
import UserMock from './mocks/entities/UserMock'
import {createServer} from 'http'
import {Server} from 'socket.io'

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

const div = document.createElement('div')
div.id = 'root'
document.body.appendChild(div)

AuthService.currentUser = Object.assign(new User(), UserMock)

config.global.mocks = {}

let io: Server
beforeAll((done) => {
  const httpServer = createServer()
  io = new Server(httpServer)
  httpServer.listen()
  done()
})

afterAll(() => {
  io.close()
})
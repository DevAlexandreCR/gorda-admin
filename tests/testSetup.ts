import {config} from '@vue/test-utils'
import AuthService from '@/services/AuthService'
import User from '@/models/User'
import UserMock from './mocks/entities/UserMock'
import 'socket.io-client'

jest.mock('firebase/app')
jest.mock('firebase/auth', () => {
  return {
    signOut: jest.fn().mockResolvedValue(null),
    getAuth: jest.fn().mockResolvedValue(null),
    connectAuthEmulator: jest.fn()
  }
})
jest.mock('firebase/database')
jest.mock('firebase/storage')
jest.mock('socket.io-client')

const div = document.createElement('div')
div.id = 'root'
document.body.appendChild(div)

AuthService.currentUser = Object.assign(new User(), UserMock)

config.global.mocks = {}
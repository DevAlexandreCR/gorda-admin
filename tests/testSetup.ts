import AuthService from '@/services/AuthService'
import User from '@/models/User'
import UserMock from './mocks/entities/UserMock'

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

// setImmediate = jest.fn()

const div = document.createElement('div')
div.id = 'root'
document.body.appendChild(div)

AuthService.currentUser = Object.assign(new User(), UserMock)
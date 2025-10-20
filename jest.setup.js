/* eslint-env jest */
import 'fake-indexeddb/auto'
jest.mock('vue-advanced-chat', () => ({
  register: jest.fn()
}))

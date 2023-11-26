import {openServer, server, socket} from '../../../testSetup'
import WhatsAppClient from '@/services/gordaApi/WhatsAppClient'
import {WhatsApp} from '@/services/gordaApi/constants/WhatsApp'
import waitForExpect from 'wait-for-expect'

describe('WhatsAppClient.ts', () => {
  let client: WhatsAppClient
  
  beforeEach((done) => {
    client = WhatsAppClient.getInstance()
    openServer(done)
  }, 10000)

  afterEach(() => {
    server.close()
    socket.close()
  })
  test('must change status to connected when receive ready event', async () => {
    client.state = WhatsApp.STATUS_DISCONNECTED
    socket.emit(WhatsApp.EVENT_READY)
  
    await waitForExpect(() => {
      expect(client.isConnected()).toBeTruthy()
    })
  })
  
  test('must change status to disconnected when receive auth failure event', async () => {
    client.state = WhatsApp.STATUS_CONNECTED
    socket.emit(WhatsApp.EVENT_AUTH_FAILURE)
    
    await waitForExpect(() => {
      expect(client.isConnected()).toBeFalsy()
    })
  })
  
  test('must change status to disconnected when receive disconnected event', async () => {
    client.state = WhatsApp.STATUS_CONNECTED
    socket.emit(WhatsApp.EVENT_DISCONNECTED)
    
    await waitForExpect(() => {
      expect(client.isConnected()).toBeFalsy()
    })
  })
  
  test('must change state when receive change-state event', async () => {
    socket.emit(WhatsApp.EVENT_CLIENT, 'info')
    socket.emit(WhatsApp.EVENT_GET_STATE, WhatsApp.STATUS_CONNECTED)
    
    socket.on(WhatsApp.EVENT_GET_STATE, (arg) => {
      expect(arg).toMatch('info')
    })
    await waitForExpect(() => {
      expect(client.isConnected()).toBeTruthy()
    })
  })
})
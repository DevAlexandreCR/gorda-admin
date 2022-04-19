import {openServer, server, socket} from '../../../testSetup'
import WhatsAppClient from '@/services/gordaApi/WhatsAppClient'

describe('WhatsAppClient.ts', () => {
  beforeAll((done) => {
    openServer(done)
  })
  
  afterAll(() => {
    server.close()
    socket.close()
  })
  test('must disconnect socket', async () => {
    const client = WhatsAppClient.getInstance()
    await client.disconnectSocket()
    
    const sockets = await socket.allSockets()
    expect(sockets.size).toBe(1)
  })
})
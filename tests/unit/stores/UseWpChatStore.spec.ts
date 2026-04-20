import { useWpChatStore } from '@/services/stores/UseWpChatStore'
import ChatRepository from '@/repositories/ChatRepository'
import ChatCache from '@/services/ChatCache'
import { Message } from '@/types/Message'
import { Chat } from '@/types/Chat'
import { MessageTypes } from '@/types/MessageTypes'

function buildMessage(id: string, createdAt: number, fromMe = false): Message {
  return {
    id,
    created_at: createdAt,
    type: MessageTypes.TEXT,
    body: id,
    fromMe,
    from: fromMe ? 'client-1' : 'chat-1',
  }
}

function buildChat(lastMessage: Message): Chat {
  return {
    id: 'chat-1',
    archived: false,
    clientName: 'Daniela Urbano Solarte',
    lastMessage,
    updated_at: lastMessage.created_at,
  }
}

describe('UseWpChatStore', () => {
  beforeEach(() => {
    useWpChatStore().$reset()
    jest.restoreAllMocks()
  })

  it('merges fetched messages with existing active-chat messages and refreshes cache', async () => {
    const store = useWpChatStore()
    const newestMessage = buildMessage('message-newest', 200)
    const olderMessage = buildMessage('message-older', 100)

    store.activeChat = 'chat-1'
    store.chats.set('chat-1', buildChat(newestMessage))
    store.messages = new Map([['chat-1', [newestMessage]]])

    const cacheGetSpy = jest.spyOn(ChatCache, 'getMessages').mockResolvedValue([])
    const cacheSetSpy = jest.spyOn(ChatCache, 'cacheMessages').mockResolvedValue()
    const getMessagesSpy = jest.spyOn(ChatRepository, 'getMessages').mockResolvedValue(
      new Map([[olderMessage.id, olderMessage]])
    )
    const updateChatSpy = jest.spyOn(ChatRepository, 'updateChat').mockResolvedValue(null)

    await store.getMessages('client-1', 'chat-1')

    expect(cacheGetSpy).toHaveBeenCalledWith('client-1', 'chat-1')
    expect(getMessagesSpy).toHaveBeenCalledWith('client-1', 'chat-1')
    expect(store.messages.get('chat-1')).toEqual([olderMessage, newestMessage])
    expect(cacheSetSpy).toHaveBeenLastCalledWith('client-1', 'chat-1', [olderMessage, newestMessage])
    expect(updateChatSpy).toHaveBeenCalledWith('client-1', 'chat-1', { archived: true })
  })

  it('caches merged active-chat messages when a socket message is appended', () => {
    const store = useWpChatStore()
    const firstMessage = buildMessage('message-1', 100)
    const secondMessage = buildMessage('message-2', 200)

    store.activeChat = 'chat-1'
    store.activeWpClientId = 'client-1'
    store.messages = new Map([['chat-1', [secondMessage]]])

    const cacheSetSpy = jest.spyOn(ChatCache, 'cacheMessages').mockResolvedValue()

    store.appendMessage('chat-1', firstMessage)
    store.appendMessage('chat-1', secondMessage)

    expect(store.messages.get('chat-1')).toEqual([firstMessage, secondMessage])
    expect(cacheSetSpy).toHaveBeenLastCalledWith('client-1', 'chat-1', [firstMessage, secondMessage])
  })
})

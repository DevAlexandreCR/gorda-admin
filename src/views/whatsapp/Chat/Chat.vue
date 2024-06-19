<template>
  <vue-advanced-chat
      :current-user-id="clientId"
      :rooms = "JSON.stringify(rooms)"
      :messages = "JSON.stringify(chatMessages)"
      :height="'90vh'"
      :theme="'dark'"
      :show-audio="false"
      :rooms-loaded="true"
      :messages-loaded="true"
      :show-add-room="false"
      :show-files="false"
      :show-reaction-emojis="false"
      @fetch-messages="fetchMessages"
      @send-message="sendMessage"
  />
</template>
<script setup lang="ts">
import {register} from 'vue-advanced-chat'
import {onBeforeMount, ref, Ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {useWpChatStore} from '@/services/stores/UseWpChatStore'
import {Chat} from '@/types/Chat'
import {storeToRefs} from 'pinia'
import {Message} from '@/types/Message'
import WhatsAppClient from '@/services/gordaApi/WhatsAppClient'
import {ClientObserver} from '@/services/gordaApi/ClientObserver'
import {useWpClientsStore} from '@/services/stores/WpClientStore'
import DateHelper from '@/helpers/DateHelper'

const route = useRoute()
const clientId: Ref<string> = ref('')
const { getChats, getMessages } = useWpChatStore()
const {activeChat, chats, messages } = storeToRefs(useWpChatStore())
let {setActiveChat} = useWpChatStore()
const rooms = ref([])
const chatMessages = ref([])
let wpClient: WhatsAppClient
let observer: ClientObserver
const {getWpClient, getWpClients} = useWpClientsStore()

watch(chats, (newChats) => {
  rooms.value =  Array.from(newChats.values()).map((chat: Chat) => {
    return {
      roomId: chat.id,
      roomName: chat.clientName,
      lastMessage: {
        _id: chat.lastMessage.id,
        content: chat.lastMessage.body,
        senderId: chat.lastMessage.fromMe ? clientId.value : chat.id,
        username: chat.clientName,
        date: DateHelper.formatTimestamp(chat.lastMessage.created_at).date,
        timestamp: DateHelper.formatTimestamp(chat.lastMessage.created_at).timestamp,
        index: chat.updated_at,
        saved: true,
        distributed: true,
        seen: chat.lastMessage.fromMe ? false : !chat.archived,
        new: chat.lastMessage.fromMe ? false : !chat.archived
      },
      users: [
        {
          _id: chat.id,
          username: chat.clientName,
        },
        {
          _id: clientId.value,
          username: 'Red Blanca',
          status: {
            state: 'online',
            lastChanged: new Date()
          }
        }
      ]
    }
  })
}, {deep: true})

watch(messages, (newMessages) => {
  chatMessages.value = newMessages.get(activeChat.value)?.map((message: Message) => {
    const date = DateHelper.formatTimestamp(message.created_at)
    return {
      _id: message.id,
      content: message.body,
      senderId: message.from,
      username: 'message.senderName',
      date: date.date,
      timestamp: date.timestamp,
      disableActions: true,
      disableReactions: true,
      saved: true,
      distributed: true,
      seen: true,
      new: true
    }
  })
}, {deep: true})

function fetchMessages(data: CustomEvent): void {
  const {room} = data.detail[0]
  setActiveChat(room.roomId)
  getMessages(clientId.value, room.roomId)
}

function sendMessage(data: CustomEvent): void {
  const {content, roomId} = data.detail[0]
  wpClient.sendMessage(clientId.value, roomId, content)
}

function onUpdate(socket: WhatsAppClient): void {
  console.log(socket.isConnected())
}

onBeforeMount(async () => {
  await getWpClients()
  clientId.value = route.params.id as string
  register()
  getChats(clientId.value)
  wpClient = WhatsAppClient.getInstance(getWpClient(clientId.value))
  observer = new ClientObserver(onUpdate)
  wpClient.attach(observer)
})
</script>
<template>
  <vue-advanced-chat
      :current-user-id="clientId"
      :rooms = "JSON.stringify(rooms)"
      :messages = "JSON.stringify(chatMessages)"
      :height="'100vh'"
      :theme="'dark'"
      :show-audio="false"
      :textarea-action-enabled="true"
      :rooms-loaded="true"
      :messages-loaded="true"
      :show-add-room="false"
      :show-files="false"
      :show-reaction-emojis="false"
      @fetch-messages="fetchMessages"
      @send-message="sendMessage"
  >
    <div slot="room-header">
      <div class="ms-2 text-bold clickable" @click="copyText">
        <span class="me-2">{{ activeChat }}</span>
        <i class="fas fa-copy"></i>
      </div>
      <div v-if="showTooltip" class="rounded bg-secondary position-absolute ms-2 mt-2 px-3 py-2">{{ $t('common.messages.copied') }}</div>
    </div>
  </vue-advanced-chat>
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
const { getChats, getMessages, checkPermission } = useWpChatStore()
const {activeChat, chats, messages } = storeToRefs(useWpChatStore())
let {setActiveChat} = useWpChatStore()
const rooms = ref([])
const chatMessages = ref([])
let wpClient: WhatsAppClient
let observer: ClientObserver
const {getWpClient, getWpClients} = useWpClientsStore()
const showTooltip = ref(false)

watch(chats, (newChats) => {
  const chatsSorted = Array.from(newChats.values()).map((chat: Chat) => {
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
        seen: chat.lastMessage.fromMe ? true : !chat.archived,
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

  rooms.value = chatsSorted.sort((a, b) => {
    return b.lastMessage.index - a.lastMessage.index
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
  const id = DateHelper.unix()
  const newMessage = {
    _id: id,
    content: content,
    senderId: clientId,
    username: 'message.senderName',
    date: DateHelper.formatTimestamp(id).date,
    timestamp: DateHelper.formatTimestamp(id).timestamp,
    disableActions: true,
    disableReactions: true,
    saved: true,
    distributed: false,
    seen: false,
    new: true
  }
  chatMessages.value = [...chatMessages.value, newMessage]
  wpClient.sendMessage(clientId.value, roomId, content)
}

function onUpdate(socket: WhatsAppClient): void {
  console.log(socket.isConnected())
}

function copyText() {
  navigator.clipboard.writeText(activeChat.value)
    .then(() => {
      showTooltip.value = true
      setTimeout(() => { showTooltip.value = false }, 2000)
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
    });
}

onBeforeMount(async () => {
  checkPermission()
  await getWpClients()
  clientId.value = route.params.id as string
  register()
  getChats(clientId.value)
  wpClient = WhatsAppClient.getInstance(getWpClient(clientId.value))
  observer = new ClientObserver(onUpdate)
  wpClient.attach(observer)
})
</script>
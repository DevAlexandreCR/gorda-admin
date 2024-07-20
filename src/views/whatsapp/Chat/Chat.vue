<template>
  <div v-if="showTooltip" class="alert alert-success centered-tooltip position-absolute ms-2 mt-2 z-index-sticky" role="alert">
    <strong>{{ activeChat }}</strong>  {{ $t('common.messages.copied') }}
  </div>
  <vue-advanced-chat
      :current-user-id="clientId"
      :rooms = "JSON.stringify(rooms)"
      :room-id="activeChat"
      :messages = "JSON.stringify(chatMessages)"
      :height="'100vh'"
      :theme="theme"
      :menu-actions="JSON.stringify(menuActions)"
      :show-audio="false"
      :rooms-loaded="true"
      :messages-loaded="true"
      :show-add-room="false"
      :show-files="false"
      :show-reaction-emojis="false"
      :room-info-enabled="true"
      @menu-action-handler="menuActionHandler"
      @room-info="copyText"
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
import {ChatThemes} from '@/services/gordaApi/constants/ChatThemes'
import i18n from "@/plugins/i18n";

const route = useRoute()
const clientId: Ref<string> = ref('')
const { getChats, getMessages, checkPermission, getConfig, setTheme, setActiveChat } = useWpChatStore()
const {activeChat, chats, messages, theme } = storeToRefs(useWpChatStore())
const rooms = ref([])
const chatMessages = ref([])
let wpClient: WhatsAppClient
let observer: ClientObserver
const {getWpClient, getWpClients} = useWpClientsStore()
const showTooltip = ref(false)
const menuActions = [
  { name: 'copy', title: i18n.global.t('common.actions.copy_phone') },
  { name: 'dark', title: i18n.global.t('common.placeholders.' + ChatThemes.DARK) },
  { name: 'light', title: i18n.global.t('common.placeholders.' + ChatThemes.LIGHT) }
]

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

function copyText(): void {
  navigator.clipboard.writeText(activeChat.value)
    .then(() => {
      showTooltip.value = true
      setTimeout(() => { showTooltip.value = false }, 2000)
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
    });
}

function menuActionHandler(data: CustomEvent): void {
  const {action, roomId} = data.detail[0]
  switch (action.name) {
    case 'copy':
      copyText()
      break
    case ChatThemes.DARK:
      setTheme(ChatThemes.DARK)
      break
    case ChatThemes.LIGHT:
      setTheme(ChatThemes.LIGHT)
      break
  }
}

onBeforeMount(async () => {
  checkPermission()
  await getWpClients()
  clientId.value = route.params.id as string
  register()
  getChats(clientId.value)
  getConfig()
  wpClient = WhatsAppClient.getInstance(getWpClient(clientId.value))
  observer = new ClientObserver(onUpdate)
  wpClient.attach(observer)
})
</script>
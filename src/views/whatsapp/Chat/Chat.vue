<template>
  <div v-if="showTooltip" class="alert alert-success centered-tooltip position-absolute ms-2 mt-2 z-index-sticky" role="alert">
    <strong>{{ activeChat }}</strong>  {{ $t('common.messages.copied') }}
  </div>

  <button
    v-if="canClaimChat"
    @click="claimChat"
    class="btn btn-danger position-fixed rounded-circle d-flex align-items-center justify-content-center shadow"
    style="top: 80px; right: 20px; width: 60px; height: 60px; z-index: 1000; font-size: 20px;"
    :disabled="isClaimingChat"
    :title="$t('common.actions.claim_chat')"
  >
    <i v-if="!isClaimingChat" class="fas fa-hand-paper"></i>
    <i v-else class="fas fa-spinner fa-spin"></i>
  </button>

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
      :custom-search-room-enabled="true"
      :textarea-auto-focus="false"
      @search-room="filter"
      @menu-action-handler="menuActionHandler"
      @room-info="copyText"
      @fetch-messages="fetchMessages"
      @send-message="sendMessage"
  />
</template>
<script setup lang="ts">
import { register } from 'vue-advanced-chat'
import { computed, onBeforeMount, onBeforeUnmount, ref, Ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWpChatStore } from '@/services/stores/UseWpChatStore'
import { Chat } from '@/types/Chat'
import { storeToRefs } from 'pinia'
import { Message } from '@/types/Message'
import WhatsAppClient from '@/services/gordaApi/WhatsAppClient'
import { ClientObserver } from '@/services/gordaApi/ClientObserver'
import { useWpClientsStore } from '@/services/stores/WpClientStore'
import DateHelper from '@/helpers/DateHelper'
import { ChatThemes } from '@/services/gordaApi/constants/ChatThemes'
import i18n from '@/plugins/i18n'
import { useClientsStore } from '@/services/stores/ClientsStore'
import SessionRepository from '@/repositories/SessionRepository'
import Swal from 'sweetalert2'
import { useLoadingState } from '@/services/stores/LoadingState'
import { SessionStatuses } from '@/constants/SessionStatuses'

const route = useRoute()
const clientId: Ref<string> = ref('')
const wpChatStore = useWpChatStore()
const {
  getChats,
  getMessages,
  checkPermission,
  getConfig,
  setTheme,
  setActiveChat,
  filterChat,
  upsertChat,
  appendMessage,
  updateChatActiveSession
} = wpChatStore
const { activeChat, messages, theme } = storeToRefs(wpChatStore)
const rooms = ref<any[]>([])
const chatMessages = ref<any[]>([])
let wpClient: WhatsAppClient | null = null
let observer: ClientObserver | null = null
const { getWpClient, getWpClients } = useWpClientsStore()
const { findById, getClients } = useClientsStore()
const { setLoading } = useLoadingState()
const showTooltip = ref(false)
const isClaimingChat = ref(false)
const menuActions = [
  { name: 'copy', title: i18n.global.t('common.actions.copy_phone') },
  { name: 'dark', title: i18n.global.t('common.placeholders.' + ChatThemes.DARK) },
  { name: 'light', title: i18n.global.t('common.placeholders.' + ChatThemes.LIGHT) }
]
const activeChatData = computed(() => {
  if (!activeChat.value) {
    return null
  }

  return wpChatStore.allChats.get(activeChat.value) ?? wpChatStore.chats.get(activeChat.value) ?? null
})
const activeSession = computed(() => activeChatData.value?.activeSession ?? null)
const canClaimChat = computed(() => {
  return !!activeChat.value && !!activeSession.value && activeSession.value.status !== SessionStatuses.SUPPORT
})

watch(() => wpChatStore.sortedChats, async (newChats) => {
  const chatsSorted = await Promise.all(Array.from(newChats.values()).map(async (chat: Chat) => {
    const client = await findById(chat.id) ?? { name: chat.clientName }
    const shouldShowUnread = wpChatStore.shouldShowAsUnread(chat)

    return {
      roomId: chat.id,
      roomName: client.name ?? chat.clientName,
      unreadCount: shouldShowUnread ? 1 : 0,
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
        seen: chat.lastMessage.fromMe ? true : !shouldShowUnread,
        new: chat.lastMessage.fromMe ? false : shouldShowUnread
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
  }))

  rooms.value = chatsSorted
}, { deep: true })

watch(messages, (newMessages) => {
  const activeChatId = activeChat.value
  if (!activeChatId) return

  const messageList = newMessages.get(activeChatId)
  chatMessages.value = messageList?.map((message: Message) => {
    const date = DateHelper.formatTimestamp(message.created_at)
    const isFromBot = message.from === clientId.value || message.fromMe
    return {
      _id: message.id,
      content: message.body,
      senderId: isFromBot ? clientId.value : message.from,
      username: 'message.senderName',
      date: date.date,
      timestamp: date.timestamp,
      disableActions: true,
      disableReactions: true,
      saved: true,
      distributed: true,
      seen: true,
      new: false
    }
  }) || []
}, { deep: true })

function fetchMessages(data: CustomEvent): void {
  const { room } = data.detail[0]

  if (!room || !room.roomId) {
    void room
    return
  }

  if (room.lastMessage && room.lastMessage.content === 'Buscar conversación...') {
    return
  }

  setActiveChat(room.roomId)
  getMessages(clientId.value, room.roomId)
}

function sendMessage(data: CustomEvent): void {
  const { content, roomId } = data.detail[0]
  const id = DateHelper.unix()
  const newMessage = {
    _id: id,
    content: content,
    senderId: clientId.value,
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

  if (chatMessages.value) {
    chatMessages.value = [...chatMessages.value, newMessage]
  } else {
    chatMessages.value = [newMessage]
  }

  wpClient?.sendMessage(clientId.value, roomId, content)
}

function onUpdate(socket: WhatsAppClient): void {
  void socket
}

function copyText(): void {
  if (activeChat.value) {
    navigator.clipboard.writeText(activeChat.value)
      .then(() => {
        showTooltip.value = true
        setTimeout(() => { showTooltip.value = false }, 2000)
      })
      .catch((err) => {
        void err
      })
  }
}

function filter(data: CustomEvent) {
  const { value } = data.detail[0]
  filterChat(value)
}

function menuActionHandler(data: CustomEvent): void {
  const { action } = data.detail[0]
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

function claimChat(): void {
  if (!activeChat.value || !activeSession.value || isClaimingChat.value) return

  isClaimingChat.value = true

  SessionRepository.updateSessionStatus(activeSession.value.sessionId, SessionStatuses.SUPPORT)
    .then((session) => {
      if (activeChat.value) {
        updateChatActiveSession(activeChat.value, session)
      }

      Swal.fire({
        icon: 'success',
        title: i18n.global.t('common.messages.updated'),
        text: i18n.global.t('common.messages.chat_claimed_success'),
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        position: 'top-right'
      })
    })
    .catch((error) => {
      void error
      Swal.fire({
        icon: 'error',
        title: i18n.global.t('common.messages.error'),
        text: i18n.global.t('common.messages.chat_claim_failed'),
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        position: 'top-right'
      })
    })
    .finally(() => {
      isClaimingChat.value = false
    })
}

function onChatUpsert(chat: Chat): void {
  upsertChat(chat)
}

function onMessageCreated(payload: { chatId: string; message: Message }): void {
  appendMessage(payload.chatId, {
    ...payload.message,
    from: payload.message.fromMe ? clientId.value : payload.chatId
  })
}

onBeforeMount(async () => {
  setLoading(true)
  checkPermission()
  await getClients()
  await getWpClients()
  clientId.value = route.params.id as string
  register()
  getChats(clientId.value)
  getConfig()
  setLoading(false)
  const wpClientData = getWpClient(clientId.value)
  if (wpClientData) {
    wpClient = WhatsAppClient.getInstance(wpClientData)
    observer = new ClientObserver(onUpdate as any)
    wpClient.attach(observer)
    wpClient.on('whatsapp:chat-upsert', onChatUpsert)
    wpClient.on('whatsapp:message-created', onMessageCreated)
  }
})

onBeforeUnmount(() => {
  if (wpClient) {
    wpClient.off('whatsapp:chat-upsert', onChatUpsert)
    wpClient.off('whatsapp:message-created', onMessageCreated)
  }

  if (wpClient && observer) {
    wpClient.detach(observer)
  }
})
</script>

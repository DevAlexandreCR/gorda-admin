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

const route = useRoute()
const clientId: Ref<string> = ref('')
const { getChats, getMessages } = useWpChatStore()
const { chats, messages } = storeToRefs(useWpChatStore())
const rooms = ref([])
const chatMessages = ref([])

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
        timestamp: chat.lastMessage.created_at,
        saved: true,
        distributed: false,
        seen: false,
        new: true
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
  chatMessages.value = Array.from(newMessages.values()).map((message: Message) => {
    return {
      _id: message.id,
      content: message.body,
      senderId: message.from,
      username: 'message.senderName',
      timestamp: message.created_at,
      saved: true,
      distributed: true,
      seen: true,
      new: true
    }
  })
}, {deep: true})

function fetchMessages(data: CustomEvent): void {
  const {room} = data.detail[0]
  getMessages(clientId.value, room.roomId)
}

onBeforeMount(async () => {
  clientId.value = route.params.id as string
  register()
  getChats(clientId.value)
})
</script>
<template>
  <vue-advanced-chat
      :current-user-id="clientId"
      :rooms = "JSON.stringify(rooms)"
      :messages = "''"
      :height="'90vh'"
      :theme="'dark'"
      :show-audio="false"
      :rooms-loaded="true"
      :messages-loaded="true"
  >
  </vue-advanced-chat>
</template>
<script setup lang="ts">
import {register} from 'vue-advanced-chat'
import {onBeforeMount, ref, Ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {useWpChatStore} from '@/services/stores/UseWpChatStore'
import {Chat} from '@/types/Chat'
import {storeToRefs} from 'pinia'

const route = useRoute()
const clientId: Ref<string> = ref('')
const { getChats } = useWpChatStore()
const { chats } = storeToRefs(useWpChatStore())
const rooms = ref([])

watch(chats, (newChats) => {
  rooms.value =  Array.from(newChats.values()).map((chat: Chat) => {
    return {
      roomId: chat.id,
      roomName: chat.clientName,
      lastMessage: {
        _id: 'xyz',
        content: 'Last message received',
        senderId: chat.id,
        username: chat.clientName,
        timestamp: chat.lastMessage,
        saved: true,
        distributed: false,
        seen: false,
        new: true
      },
      users: [
        {
          _id: clientId.value,
          username: 'Red Blanca',
          status: {
            state: 'online',
            lastChanged: new Date()
          }
        },
        {
          _id: chat.id,
          username: chat.clientName,
        }
      ]
    }
  })
})

onBeforeMount(async () => {
  clientId.value = route.params.id as string
  register()
  getChats(clientId.value)
})
</script>
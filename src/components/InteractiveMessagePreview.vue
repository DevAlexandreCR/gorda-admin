<template>
  <div class="whatsapp-container">
    <div class="whatsapp-message">
      <div v-if="message.header" class="header">
        {{ message.header.text }}
      </div>

      <div class="preview-container" v-html="formattedMessage"></div>

      <!-- Button Message -->
      <div v-if="message.type === 'button'" class="buttons">
        <button
          v-for="(button, idx) in message.action?.buttons"
          :key="idx"
          class="whatsapp-button"
        >
          {{ button.reply?.title }}
        </button>
      </div>

      <!-- Location Request -->
      <div v-if="message.type === 'location_request_message'" class="location-box">
        📍 Share your location
      </div>

      <div v-if="message.footer" class="footer">
        {{ message.footer.text }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Interactive } from '@/types/Interactive';

defineProps<{ message: Interactive, formattedMessage: string }>();
</script>

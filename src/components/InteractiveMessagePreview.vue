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

      <!-- List Message -->
      <div v-if="message.type === 'list'" class="list-container">
        <button class="list-trigger-button">
          {{ message.action?.button || 'Select an option' }}
          <span class="dropdown-arrow">▼</span>
        </button>
        <div class="list-options">
          <div 
            v-for="(section, sectionIdx) in message.action?.sections" 
            :key="sectionIdx" 
            class="list-section"
          >
            <div v-if="section.title" class="section-title">{{ section.title }}</div>
            <div 
              v-for="(row, rowIdx) in section.rows" 
              :key="rowIdx" 
              class="list-row"
            >
              <div class="row-title">{{ row.title }}</div>
              <div v-if="row.description" class="row-description">{{ row.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Location Request -->
      <div v-if="message.type === 'location_request_message'" class="location-box">
        {{ $t('wp.actions.share_location') }}
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

<style scoped>
.whatsapp-container {
  max-width: 300px;
  margin: 0 auto;
}

.whatsapp-message {
  background: #dcf8c6;
  border-radius: 8px;
  padding: 8px 12px;
  margin: 8px;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.header {
  font-weight: bold;
  margin-bottom: 8px;
  color: #128c7e;
}

.preview-container {
  margin: 8px 0;
  word-wrap: break-word;
}

.buttons {
  margin-top: 8px;
}

.whatsapp-button {
  display: block;
  width: 100%;
  background: transparent;
  border: 1px solid #128c7e;
  color: #128c7e;
  padding: 8px 12px;
  margin: 4px 0;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.whatsapp-button:hover {
  background: #f0f8f5;
}

.list-container {
  margin-top: 8px;
}

.list-trigger-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: transparent;
  border: 1px solid #128c7e;
  color: #128c7e;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-arrow {
  font-size: 12px;
  margin-left: 8px;
}

.list-options {
  margin-top: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  max-height: 200px;
  overflow-y: auto;
}

.list-section {
  border-bottom: 1px solid #f0f0f0;
}

.list-section:last-child {
  border-bottom: none;
}

.section-title {
  background: #f8f9fa;
  padding: 8px 12px;
  font-weight: bold;
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
}

.list-row {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.list-row:hover {
  background: #f8f9fa;
}

.list-row:last-child {
  border-bottom: none;
}

.row-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.row-description {
  font-size: 12px;
  color: #666;
  line-height: 1.3;
}

.location-box {
  margin-top: 8px;
  padding: 12px;
  background: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 8px;
  text-align: center;
  color: #1976d2;
}

.footer {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  font-style: italic;
}
</style>

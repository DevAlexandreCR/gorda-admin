<template>
  <div class="wa-preview-row">
    <div class="wa-preview-col">
      <div class="wa-preview-bubble">
        <div class="wa-preview-bubble-tail"></div>
        <div v-if="message.header" class="wa-preview-header">
          {{ message.header.text }}
        </div>

        <div class="wa-preview-body" v-html="formattedMessage"></div>

        <div v-if="message.footer" class="wa-preview-footer">
          {{ message.footer.text }}
        </div>
      </div>

      <!-- Button Message -->
      <div v-if="message.type === 'button'" class="wa-preview-chips">
        <div
          v-for="(button, idx) in message.action?.buttons"
          :key="idx"
          class="wa-preview-chip"
        >
          <em class="fas fa-reply"></em>
          {{ button.reply?.title }}
        </div>
      </div>

      <!-- List Message -->
      <div v-if="message.type === 'list'" class="wa-preview-list">
        <button type="button" class="wa-preview-chip wa-preview-chip--trigger">
          <span>{{ message.action?.button || 'Select an option' }}</span>
          <em class="fas fa-chevron-down"></em>
        </button>
        <div class="wa-preview-list-panel">
          <div
            v-for="(section, sectionIdx) in message.action?.sections"
            :key="sectionIdx"
            class="wa-preview-list-section"
          >
            <div v-if="section.title" class="wa-preview-list-section-title">{{ section.title }}</div>
            <div
              v-for="(row, rowIdx) in section.rows"
              :key="rowIdx"
              class="wa-preview-list-row"
            >
              <div class="wa-preview-list-row-title">{{ row.title }}</div>
              <div v-if="row.description" class="wa-preview-list-row-desc">{{ row.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Location Request -->
      <div v-if="message.type === 'location_request_message'" class="wa-preview-location">
        {{ $t('wp.actions.share_location') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Interactive } from '@/types/Interactive';

defineProps<{ message: Interactive, formattedMessage: string }>();
</script>

<style scoped>
.wa-preview-row {
  display: flex;
  justify-content: flex-end;
}

.wa-preview-col {
  max-width: 88%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.wa-preview-bubble {
  width: 100%;
  position: relative;
  background: var(--wp-bubble-bg);
  border-radius: 0.7rem 0 0.7rem 0.7rem;
  padding: 0.5rem 0.7rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  font-size: 0.79rem;
  color: var(--wp-text);
  line-height: 1.55;
}

.wa-preview-bubble-tail {
  position: absolute;
  right: -7px;
  top: 0;
  width: 0;
  height: 0;
  border-top: 8px solid var(--wp-bubble-bg);
  border-left: 8px solid transparent;
}

.wa-preview-header {
  font-weight: 700;
  margin-bottom: 0.35rem;
  color: var(--wp-header);
}

.wa-preview-body {
  word-wrap: break-word;
}

.wa-preview-footer {
  margin-top: 0.35rem;
  font-size: 0.7rem;
  font-style: italic;
  color: var(--wp-muted);
}

.wa-preview-chips {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-top: 0.22rem;
}

.wa-preview-chip {
  background: var(--wp-chip-bg);
  color: var(--wp-chip-text);
  border: none;
  border-radius: 0.45rem;
  padding: 0.4rem 0.7rem;
  text-align: center;
  font-size: 0.76rem;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  cursor: default;
}

.wa-preview-chip em {
  font-size: 0.58rem;
}

.wa-preview-list {
  width: 100%;
  margin-top: 0.22rem;
}

.wa-preview-chip--trigger {
  width: 100%;
  justify-content: space-between;
  cursor: pointer;
}

.wa-preview-list-panel {
  margin-top: 0.35rem;
  border: 1px solid var(--wp-border);
  border-radius: 0.5rem;
  background: var(--wp-card-bg);
  max-height: 200px;
  overflow-y: auto;
}

.wa-preview-list-section {
  border-bottom: 1px solid var(--wp-border);
}

.wa-preview-list-section:last-child {
  border-bottom: none;
}

.wa-preview-list-section-title {
  background: var(--wp-alt-bg);
  color: var(--wp-alt-text);
  padding: 0.4rem 0.7rem;
  font-weight: 700;
  font-size: 0.66rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.wa-preview-list-row {
  padding: 0.6rem 0.7rem;
  border-bottom: 1px solid var(--wp-border);
}

.wa-preview-list-row:last-child {
  border-bottom: none;
}

.wa-preview-list-row-title {
  font-weight: 500;
  color: var(--wp-text);
  margin-bottom: 0.1rem;
}

.wa-preview-list-row-desc {
  font-size: 0.66rem;
  color: var(--wp-muted);
  line-height: 1.3;
}

.wa-preview-location {
  width: 100%;
  margin-top: 0.22rem;
  padding: 0.6rem 0.7rem;
  background: var(--wp-chip-bg);
  color: var(--wp-chip-text);
  border: 1px solid var(--wp-border);
  border-radius: 0.5rem;
  text-align: center;
  font-size: 0.76rem;
  font-weight: 500;
}
</style>

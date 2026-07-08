<template>
  <div class="wa-phone-preview">
    <div class="wa-phone-preview__header">
      <div class="wa-phone-preview__avatar">
        <em class="fa-brands fa-whatsapp"></em>
      </div>
      <div class="wa-phone-preview__identity">
        <div class="wa-phone-preview__name">{{ $t('wp.preview.business_name') }}</div>
        <div class="wa-phone-preview__status">{{ $t('wp.preview.online') }}</div>
      </div>
      <div class="wa-phone-preview__actions">
        <em class="fas fa-video"></em>
        <em class="fas fa-phone"></em>
        <em class="fas fa-ellipsis-vertical"></em>
      </div>
    </div>

    <div class="wa-phone-preview__chat">
      <slot v-if="$slots.default"></slot>
      <div v-else-if="formattedMessage" class="wa-phone-preview__bubble-row">
        <div class="wa-phone-preview__bubble">
          <div class="wa-phone-preview__bubble-tail"></div>
          <div class="wa-phone-preview__bubble-content" v-html="formattedMessage"></div>
          <div class="wa-phone-preview__meta">
            {{ timeStr }}
            <em class="fas fa-check-double"></em>
          </div>
        </div>
      </div>
      <div v-else class="wa-phone-preview__empty">
        {{ $t('wp.preview.empty_hint') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  formattedMessage?: string
}>()

const timeStr = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
</script>

<style scoped lang="scss">
.wa-phone-preview {
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.wa-phone-preview__header {
  background: var(--wp-header);
  padding: 0.6rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.wa-phone-preview__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex: none;
  background: linear-gradient(135deg, #25d366, #128c7e);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1rem;
}

.wa-phone-preview__identity {
  flex: 1;
  min-width: 0;
}

.wa-phone-preview__name {
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.2;
}

.wa-phone-preview__status {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.63rem;
}

.wa-phone-preview__actions {
  display: flex;
  gap: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.78rem;
}

.wa-phone-preview__chat {
  background: var(--wp-bg);
  padding: 0.85rem 0.75rem;
  min-height: 120px;
}

.wa-phone-preview__bubble-row {
  display: flex;
  justify-content: flex-end;
}

.wa-phone-preview__bubble {
  max-width: 88%;
  position: relative;
  background: var(--wp-bubble-bg);
  border-radius: 0.7rem 0 0.7rem 0.7rem;
  padding: 0.5rem 0.7rem 0.3rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  font-size: 0.79rem;
  color: var(--wp-text);
  line-height: 1.55;
}

.wa-phone-preview__bubble-tail {
  position: absolute;
  right: -7px;
  top: 0;
  width: 0;
  height: 0;
  border-top: 8px solid var(--wp-bubble-bg);
  border-left: 8px solid transparent;
}

.wa-phone-preview__meta {
  text-align: right;
  font-size: 0.58rem;
  color: var(--wp-timestamp);
  margin-top: 0.22rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.2rem;
}

.wa-phone-preview__meta .fa-check-double {
  font-size: 0.55rem;
  color: var(--wp-check);
}

.wa-phone-preview__empty {
  text-align: center;
  padding: 2rem 0;
  color: var(--wp-muted);
  font-size: 0.73rem;
}
</style>

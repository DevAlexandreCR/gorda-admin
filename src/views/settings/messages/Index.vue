<template>
  <div class="settings-card">
    <div class="settings-card__header">
      <span class="settings-icon-chip settings-icon-chip--whatsapp">
        <em class="fa-brands fa-whatsapp"></em>
      </span>
      <h6 class="settings-card__title">{{ $t('common.titles.title_card') }}</h6>
      <span v-if="loading" class="spinner-border spinner-border-sm text-info ms-auto" role="status" aria-hidden="true"></span>
    </div>
    <div class="settings-card__body">
      <div class="msg-table-scroll">
        <div class="msg-header-row">
          <div class="msg-col msg-col-name">{{ $t('services.fields.name') }}</div>
          <div class="msg-col msg-col-comment">{{ $t('services.fields.comment') }}</div>
          <div class="msg-col msg-col-message">{{ $t('services.fields.WpMessages') }}</div>
          <div class="msg-col msg-col-status">{{ $t('common.fields.status') }}</div>
          <div class="msg-col msg-col-actions">{{ $t('services.fields.WpActions') }}</div>
        </div>

        <div class="msg-group">
          <div class="msg-group-heading">
            <span class="msg-group-icon msg-group-icon--success">
              <em class="fas fa-check-double"></em>
            </span>
            <span class="msg-group-title">{{ $t('wp.titles.confirmations_messages') }}</span>
          </div>
          <div class="msg-row" :class="{ 'msg-row--alt': index % 2 === 1 }" v-for="(message, index) in confirmationMessages" :key="index">
            <EditModal :selectedMessage="message" @updateMessages="updateMessages" />
            <div class="msg-col msg-col-name" :title="message.name">{{ message.name }}</div>
            <div class="msg-col msg-col-comment" :title="message.description">{{ message.description }}</div>
            <div class="msg-col msg-col-message" :title="message.message">{{ message.message }}</div>
            <div class="msg-col msg-col-status">
              <div class="form-check form-switch settings-switch mb-0">
                <input class="form-check-input" name="enable" type="checkbox" :checked="message.enabled" :disabled="busy[message.id]" @change="toggleMessage(message)">
              </div>
              <span v-if="busy[message.id]" class="spinner-border spinner-border-sm text-secondary ms-1" role="status" aria-hidden="true"></span>
              <span class="gorda-status-badge"
                    :class="message.enabled ? 'gorda-status-badge--success' : 'gorda-status-badge--danger'"
              >{{ $t(message.enabled ?
                  'common.fields.enabled' : 'common.fields.disabled') }}</span>
            </div>
            <div class="msg-col msg-col-actions">
              <button class="settings-icon-btn" data-bs-toggle="modal" :data-bs-target="'#' + message.id">
                <em class="fas fa-pencil"></em>
              </button>
            </div>
          </div>
        </div>

        <div class="msg-group">
          <div class="msg-group-heading">
            <span class="msg-group-icon msg-group-icon--info">
              <em class="fas fa-robot"></em>
            </span>
            <span class="msg-group-title">{{ $t('wp.titles.chatbot_messages') }}</span>
          </div>
          <div class="msg-row" :class="{ 'msg-row--alt': index % 2 === 1 }" v-for="(message, index) in chatBotMessages" :key="index">
            <EditModal :selectedMessage="message" @updateMessages="updateMessages" />
            <div class="msg-col msg-col-name" :title="message.name">{{ message.name }}</div>
            <div class="msg-col msg-col-comment" :title="message.description">{{ message.description }}</div>
            <div class="msg-col msg-col-message" :title="message.message">{{ message.message }}</div>
            <div class="msg-col msg-col-status">
              <div class="form-check form-switch settings-switch mb-0">
                <input class="form-check-input" name="enable" type="checkbox" :checked="message.enabled" :disabled="busy[message.id]" @change="toggleMessage(message)">
              </div>
              <span v-if="busy[message.id]" class="spinner-border spinner-border-sm text-secondary ms-1" role="status" aria-hidden="true"></span>
              <span class="gorda-status-badge"
                    :class="message.enabled ? 'gorda-status-badge--success' : 'gorda-status-badge--danger'"
              >{{ $t(message.enabled ?
                  'common.fields.enabled' : 'common.fields.disabled') }}</span>
            </div>
            <div class="msg-col msg-col-actions">
              <button class="settings-icon-btn" data-bs-toggle="modal" :data-bs-target="'#' + message.id">
                <em class="fas fa-pencil"></em>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import SettingsRepository from '@/repositories/SettingsRepository'
import {SettingsMessageInterface} from '@/types/SettingsMessagesInterface'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import EditModal from '@/views/settings/messages/Edit.vue'
import {Constants} from '@/constants/Constants'

const messages = ref<SettingsMessageInterface[]>([])
const loading = ref(false)
const busy = ref<Record<string, boolean>>({})

onMounted(async () => {
  await updateMessages()
})

const updateMessages = async () => {
  loading.value = true
  messages.value = await SettingsRepository.getMessages().finally(() => { loading.value = false })
}

const confirmationMessages = computed(() => {
  return messages.value.filter((message) => {
    return Constants.CONFIRMATIONS.includes(message.id)
  })
})

const chatBotMessages = computed(() => {
  return messages.value.filter((message) => {
    return !Constants.CONFIRMATIONS.includes(message.id)
  })
})

const toggleMessage = async (message: SettingsMessageInterface): Promise<void> => {
  busy.value[message.id] = true
  message.enabled = !message.enabled
  SettingsRepository.updateMessage(message)
    .then(async () => {
      const statusMessage = message.enabled
        ? i18n.global.t('common.fields.enabled')
        : i18n.global.t('common.fields.disabled')
      await ToastService.toast(ToastService.SUCCESS, statusMessage)
    })
    .catch(async (error) => {
      await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), error.message)
    })
    .finally(() => {
      delete busy.value[message.id]
    })
}
</script>

<style scoped>
.settings-card {
  background: var(--surface-card);
  border-radius: 1rem;
  box-shadow: var(--shadow-card);
  overflow: hidden;
}
.settings-card__header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 1.1rem 1.25rem;
}
.settings-card__title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--text-heading);
}
.settings-card__body {
  padding: 0 0 1rem;
}

.settings-icon-chip {
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.9rem;
  box-shadow: 0 4px 7px -1px rgba(0, 0, 0, 0.11);
}
.settings-icon-chip--whatsapp {
  background: linear-gradient(310deg, #128c7e, #25d366);
}

.settings-icon-btn {
  width: 34px;
  height: 34px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 0.45rem;
  background: #17c1e8;
  color: #fff;
  font-size: 0.8rem;
  cursor: pointer;
}

/* Green pill switch: !important beats the global magenta .form-switch override
   (__theme.scss has both a light and a body.dark-version rule on the same
   selector, so specificity alone can't guarantee a win in both modes). */
.settings-card .settings-switch .form-check-input:checked {
  background-color: #17ad37 !important;
  border-color: #17ad37 !important;
}

.msg-table-scroll {
  overflow-x: auto;
}

.msg-header-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 640px;
  padding: 0 1.25rem 0.7rem;
  border-bottom: 2px solid var(--border-subtle);
}
.msg-header-row .msg-col {
  font-size: 0.64rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.msg-group-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.9rem 1.25rem 0.5rem;
}
.msg-group-icon {
  width: 22px;
  height: 22px;
  flex: none;
  border-radius: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.6rem;
}
.msg-group-icon--success {
  background: linear-gradient(310deg, #17ad37, #98ec2d);
}
.msg-group-icon--info {
  background: linear-gradient(310deg, #2152ff, #21d4fd);
}
.msg-group-title {
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--text-heading);
}

.msg-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 640px;
  padding: 0.7rem 1.25rem;
  border-top: 1px solid var(--border-subtle);
  transition: background-color 0.15s ease;
}
.msg-row--alt {
  background: var(--surface-input);
}
.msg-row:hover {
  background: var(--badge-info-bg);
}

.msg-col {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 10px;
}
.msg-col-name {
  flex: 1.1 1 170px;
  min-width: 150px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-heading);
}
.msg-col-comment {
  flex: 1.3 1 190px;
  min-width: 170px;
  font-size: 0.78rem;
  color: var(--text-body);
}
.msg-col-message {
  flex: 1.3 1 190px;
  min-width: 170px;
  font-size: 0.78rem;
  font-style: italic;
  color: var(--text-secondary);
}
.msg-col-status {
  flex: 0 0 172px;
  min-width: 172px;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: visible;
  white-space: normal;
}
.msg-col-actions {
  flex: 0 0 44px;
  min-width: 44px;
  overflow: visible;
  white-space: normal;
}
</style>

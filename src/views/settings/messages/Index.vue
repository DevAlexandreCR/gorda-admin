<template>
  <div class="card px-2 py-1">
    <div class="card-header pb-0 d-flex align-items-center">
      <h6>{{ $t('common.titles.title_card') }}</h6>
      <span v-if="loading" class="spinner-border spinner-border-sm text-info ms-auto" role="status" aria-hidden="true"></span>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <caption hidden></caption>
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder">{{ $t('services.fields.name') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder">{{ $t('services.fields.comment') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder">{{ $t('services.fields.WpMessages') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder">{{ $t('common.fields.status') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder">{{ $t('services.fields.WpActions') }}</th>
            </tr>
          </thead>
          <tbody>
          <tr><h6>{{ $t('wp.titles.confirmations_messages') }}</h6></tr>
            <tr v-for="(message, index) in confirmationMessages" :key="index">
              <EditModal :selectedMessage="message" @updateMessages="updateMessages" />
              <td class="align-middle">{{ message.name }}</td>
              <td class="align-middle text-truncate text-nowrap text-MaxErm">{{ message.description }}</td>
              <td class="align-middle text-truncate text-nowrap text-MaxErm">{{ message.message }}</td>
              <td class="align-middle p-0">
                <div class="row row-cols-2 mx-2">
                <div class="form-check form-switch col-2">
                  <input class="form-check-input" name="enable" type="checkbox" :checked="message.enabled" :disabled="busy[message.id]" @change="toggleMessage(message)">
                  <span v-if="busy[message.id]" class="spinner-border spinner-border-sm text-secondary ms-1" role="status" aria-hidden="true"></span>
                  <span class="gorda-status-badge"
                        :class="message.enabled ? 'gorda-status-badge--success' : 'gorda-status-badge--danger'"
                  >{{ $t(message.enabled ?
                      'common.fields.enabled' : 'common.fields.disabled') }}</span>
                      </div>
                </div>
              </td>
              <td class="align-middle">
                <button class="btn btn-sm btn-info btn-rounded rounded-pill py-1 m-0" data-bs-toggle="modal"
                  :data-bs-target="'#' + message.id">
                  <em class="fas fa-pencil"></em>
                </button>
              </td>
            </tr>

            <tr><h6>{{ $t('wp.titles.chatbot_messages') }}</h6></tr>
            <tr v-for="(message, index) in chatBotMessages" :key="index">
              <EditModal :selectedMessage="message" @updateMessages="updateMessages" />
              <td class="align-middle">{{ message.name }}</td>
              <td class="align-middle text-truncate text-nowrap text-MaxErm">{{ message.description }}</td>
              <td class="align-middle text-truncate text-nowrap text-MaxErm">{{ message.message }}</td>
              <td class="align-middle p-0">
                <div class="row row-cols-2 mx-2">
                  <div class="form-check form-switch col-2">
                    <input class="form-check-input" name="enable" type="checkbox" :checked="message.enabled" :disabled="busy[message.id]" @change="toggleMessage(message)">
                    <span v-if="busy[message.id]" class="spinner-border spinner-border-sm text-secondary ms-1" role="status" aria-hidden="true"></span>
                    <span class="gorda-status-badge"
                          :class="message.enabled ? 'gorda-status-badge--success' : 'gorda-status-badge--danger'"
                    >{{ $t(message.enabled ?
                        'common.fields.enabled' : 'common.fields.disabled') }}</span>
                  </div>
                </div>
              </td>
              <td class="align-middle">
                <button class="btn btn-sm btn-info btn-rounded rounded-pill py-1 m-0" data-bs-toggle="modal"
                        :data-bs-target="'#' + message.id">
                  <em class="fas fa-pencil"></em>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
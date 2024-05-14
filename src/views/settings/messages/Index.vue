<template>
  <div class="card px-2 py-1">
    <div class="card-header pb-0">
      <h6>{{ $t('common.titles.title_card') }}</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <caption hidden></caption>
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('services.fields.name') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('services.fields.comment') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('services.fields.WpMessages') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('common.fields.status') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('services.fields.WpActions') }}</th>
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
                  <input class="form-check-input" name="enable" type="checkbox" :checked="message.enabled" @change="toggleMessage(message)">
                  <span class="badge badge-sm"
                        :class="message.enabled ? 'bg-gradient-success' : 'bg-gradient-danger'"
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
                    <input class="form-check-input" name="enable" type="checkbox" :checked="message.enabled" @change="toggleMessage(message)">
                    <span class="badge badge-sm"
                          :class="message.enabled ? 'bg-gradient-success' : 'bg-gradient-danger'"
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
import {useLoadingState} from '@/services/stores/LoadingState'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import EditModal from '@/views/settings/messages/Edit.vue'
import {Constants} from '@/constants/Constants'

const messages = ref<SettingsMessageInterface[]>([])
const { setLoading } = useLoadingState()

onMounted(async () => {
  await updateMessages()
})

const updateMessages = async () => {
  setLoading(true)
  messages.value = await SettingsRepository.getMessages().finally(() => setLoading(false))
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
  setLoading(true);
  message.enabled = !message.enabled
  SettingsRepository.updateMessage(message)
    .then(async () => {
      setLoading(false)
      const statusMessage = message.enabled
        ? i18n.global.t('common.fields.enabled')
        : i18n.global.t('common.fields.disabled')
      await ToastService.toast(ToastService.SUCCESS, statusMessage)
    })
    .catch(async (error) => {
      setLoading(false);
      await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), error.message)
    })
}
</script>
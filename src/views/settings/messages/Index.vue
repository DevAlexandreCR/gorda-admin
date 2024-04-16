<template>
  <div class="card px-2 py-1">
    <div class="card-header pb-0">
      <h6>{{ $t('common.titles.titleCard') }}</h6>
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
            <tr v-for="(message, index) in messages" :key="index">
              <EditModal  :selectedMessage="message" @updateMessages="updateMessages" />
              <td class="align-middle">{{ message.name }}</td>
              <td class="align-middle text-truncate">{{ message.description }}</td>
              <td class="align-middle text-truncate text-nowrap" style="max-width: 10rem;">{{ message.message }}</td>
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
                  data-bs-target="#editMessagesWp">
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
import {onMounted, ref} from 'vue'
import SettingsRepository from '@/repositories/SettingsRepository'
import {SettingsMessageInterface} from '@/types/SettingsMessages'
import {useLoadingState} from '@/services/stores/LoadingState'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import EditModal from '@/views/settings/messages/Edit.vue'

const messages = ref<SettingsMessageInterface[]>([])
const { setLoading } = useLoadingState()

onMounted(async () => {
  messages.value = await SettingsRepository.getMessages()
})

const updateMessages = async () => {
  messages.value = await SettingsRepository.getMessages()
}

const toggleMessage = async (message: SettingsMessageInterface): Promise<void> => {
  setLoading(true);
  const updatedMessage = { ...message }
  updatedMessage.enabled = !updatedMessage.enabled
  SettingsRepository.updateMessage(updatedMessage)
    .then(async () => {
      message.enabled = updatedMessage.enabled
      setLoading(false)
      const statusMessage = updatedMessage.enabled
        ? i18n.global.t('common.messages.enabled')
        : i18n.global.t('common.messages.disabled')
      await ToastService.toast(ToastService.SUCCESS, statusMessage)
    })
    .catch(async (error) => {
      setLoading(false);
      await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), error.message)
    })
}
</script>
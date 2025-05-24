<template>
  <div id="send-fcm-modal" class="modal fade" tabindex="-1" :class="{ show: visible }">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ driverId ? $t('drivers.send_message_to_driver') : $t('drivers.send_message_to_all') }}
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <form @submit.prevent="sendMessage">
          <div class="modal-body">
            <div class="mb-3">
              <label for="message" class="form-label">{{ $t('common.fields.message') }}</label>
              <textarea id="message" class="form-control" v-model="message" required rows="3"></textarea>
            </div>
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="close">{{ $t('common.actions.cancel') }}</button>
            <button type="submit" class="btn btn-primary">
              {{ $t('common.actions.send') }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import FcmService from '@/services/FcmService'
import { useI18n } from 'vue-i18n'
import { useLoadingState } from '@/services/stores/LoadingState'
import ToastService from '@/services/ToastService'
import { Modal } from 'bootstrap'

const props = defineProps<{
  driverId: string | null
  visible: boolean
}>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'sent'): void
}>()
const error = ref<string | null>(null)
const fcmModal = ref<Modal | null>(null)
const { t } = useI18n()
const message = ref<string>('')
const { setLoading } = useLoadingState()

function close(): void {
  message.value = ''
  error.value = null
  emit('close')
}

async function sendMessage(): Promise<void> {
  setLoading(true)
  if (props.driverId) {
    FcmService.sendToDriver(props.driverId, message.value).then(() => {
      ToastService.toast(ToastService.SUCCESS, t('common.messages.updated'))
     fcmModal.value?.hide()
      emit('sent')
    }).catch((err) => {
      ToastService.toast(ToastService.ERROR, err.message)
      error.value = err.message
    }).finally(() => {
      setLoading(false)
    })
  } else {
    FcmService.sendToAllDrivers(message.value).then(() => {
      ToastService.toast(ToastService.SUCCESS, t('drivers.messages.sent_success'))
    }).catch((err) => {
      ToastService.toast(ToastService.ERROR, err.message)
      error.value = err.message
    }).finally(() => {
      setLoading(false)
    })
  }
}
</script>
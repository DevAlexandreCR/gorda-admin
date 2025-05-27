<template>
  <div id="send-fcm-modal" role="dialog" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <form @submit.prevent="sendMessage">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ driver ? $t('drivers.actions.send_message_to', { name: driver.name }) : $t('drivers.actions.send_message_to_all') }}
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="title" class="form-label">{{ $t('common.fields.title') }}</label>
            <input id="title" class="form-control" v-model="message.title" required />
          </div>
          <div class="mb-3">
            <label for="message" class="form-label">{{ $t('common.fields.message') }}</label>
            <textarea id="message" class="form-control" v-model="message.body" required rows="3"></textarea>
          </div>
          <div class="mb-3">
            <label for="duration" class="form-label">{{ $t('common.placeholders.duration') }}</label>
            <input id="duration" class="form-control w-25" v-model="duration" required type="number"/>
          </div>
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="close">{{ $t('common.actions.cancel') }}</button>
            <button type="submit" class="btn btn-primary">
              {{ $t('common.actions.submit') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import FcmService from '@/services/FcmService'
import { useI18n } from 'vue-i18n'
import { useLoadingState } from '@/services/stores/LoadingState'
import ToastService from '@/services/ToastService'
import { Modal } from 'bootstrap'
import { DriverInterface } from '@/types/DriverInterface'
import { FCMNotification } from '@/types/FCMNotifications'
import DateHelper from '@/helpers/DateHelper'

const props = defineProps<{
  driver: DriverInterface | null
}>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'sent'): void
}>()
const error = ref<string | null>(null)
const fcmModal = ref<Modal | null>(null)
const { t } = useI18n()
const duration = ref<string>('15')
const message = ref<FCMNotification>({
  title: '',
  body: '',
  data: {
    duration: duration.value.toString(),
  }
})
const { setLoading } = useLoadingState()

function close(): void {
  message.value = {
    title: '',
    body: '',
    data: {
      duration: duration.value.toString(),
    }
  }
  error.value = null
  emit('close')
}

watch(() => duration.value, (newDuration) => {
  if (newDuration === '' || isNaN(Number(newDuration)) || Number(newDuration) <= 0) {
    error.value = t('common.errors.invalid_duration')
    newDuration = '15'
  } else {
    error.value = null
  }
  message.value.data = {
    duration: newDuration.toString()
  }
})

async function sendMessage(): Promise<void> {
  setLoading(true)
  message.value.data = {
    duration: duration.value.toString(),
    timestamp: (DateHelper.unix() * 1000).toString()
  }
  if (props.driver) {
    FcmService.sendToDriver(props.driver.id, message.value).then(() => {
      ToastService.toast(ToastService.SUCCESS, t('drivers.actions.sent_success'))
    }).catch((err) => {
      ToastService.toast(ToastService.ERROR, err.message)
      error.value = err.message
    }).finally(() => {
      close()
      setLoading(false)
    })
  } else {
    FcmService.sendToAllDrivers(message.value).then(() => {
      ToastService.toast(ToastService.SUCCESS, t('drivers.actions.sent_success'))
    }).catch((err) => {
      ToastService.toast(ToastService.ERROR, err.message)
      error.value = err.message
    }).finally(() => {
      close()
      setLoading(false)
    })
  }
}
</script>
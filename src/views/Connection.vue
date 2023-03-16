<template>
  <div>
    <div class="card col col-md-8 col-xl-6 mx-auto min-vh-50">
      <div class="card-header">
        <h4>
          {{ connected ? $t('common.chatBot.connected') : $t('common.chatBot.disconnected')}}
        </h4>
      </div>
      <div class="card-body p-0 mx-3 mt-3 position-relative z-index-1">
        <div class="container text-center">
          <em v-if="connecting || loading" class="fa-solid fa-spinner fa-10x circle my-0"></em>
          <img v-if="connected && !connecting" class="img w-25  mx-auto" src="../assets/img/svg/whatsapp.svg" alt="Connected">
          <em v-if="!connecting && !connected && !qr && !loading" class="fa-solid fa-circle-exclamation fa-10x mt-5 mb-3"></em>
          <div v-if="loading" class="mt-2">
            <h5>{{ loading.message }}</h5>
            <div class="progress mx-2 my-4">
              <div class="progress-bar bg-success" role="progressbar" :style="'width: ' + loading.percent + '%'"
                   :aria-valuenow="loading.percent" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
          <canvas class="img img-fluid h-25 h-auto" v-show="qr && !connected" id="canvas"></canvas>
        </div>
      </div>

      <div class="card-footer pt-2">
        <div class="row">
          <div class="col" v-if="connected">
            <button class="btn btn-danger" @click="destroy()" :disabled="connecting || loading">{{ $t('common.chatBot.disconnect') }}</button>
          </div>
          <div class="col" v-else>
            <button class="btn btn-primary" @click="auth()" :disabled="connecting || loading || qr">{{ $t('common.chatBot.connect') }}</button>
          </div>
        </div>
        <div class="row mx-1 mt-3">
          <div class="form-check form-switch">
            <input class="form-check-input" name="enable" type="checkbox" :checked="settings.wpNotifications" :disabled="!connected"
                   @change="enableWpNotifications(!settings.wpNotifications)"/>
            <label class="form-check-label">{{
                $t('common.settings.wpNotifications')
              }}</label>
          </div>
          <div v-if="connected && !settings.wpNotifications" class="alert alert-warning" role="alert">
            {{ $t('common.settings.alert_notifications') }}
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import WhatsAppClient from '@/services/gordaApi/WhatsAppClient'
import {onMounted, ref, Ref} from 'vue'
import QRCode from 'qrcode'
import {ClientObserver} from '@/services/gordaApi/ClientObserver'
import {useSettingsStore} from '@/services/stores/SettingsStore'
import {storeToRefs} from 'pinia'
import {LoadingType} from '@/types/LoadingType'

const qr: Ref<string|null> = ref('')
const connected: Ref<boolean> = ref(false)
const connecting: Ref<boolean> = ref(false)
const loading: Ref<LoadingType|null> = ref(null)
const {enableWpNotifications} = useSettingsStore()
const {settings} = storeToRefs(useSettingsStore())

let wpClient: WhatsAppClient

function auth() {
  connecting.value = true
  wpClient.auth()
}

function destroy() {
  connecting.value = true
  wpClient.destroy()
}

const onUpdate = (socket: WhatsAppClient): void => {
  connecting.value = false
  qr.value = socket.qr
  loading.value = socket.loading
  if (qr.value) QRCode.toCanvas(document.getElementById('canvas'), qr.value as string, (e) => {console.log(e)})
  connected.value = socket.isConnected()
}

onMounted(() => {
  wpClient = WhatsAppClient.getInstance()
  const observer = new ClientObserver(onUpdate)
  wpClient.attach(observer)
  connected.value = wpClient.isConnected()
})
</script>
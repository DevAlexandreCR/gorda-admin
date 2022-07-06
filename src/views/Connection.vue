<template>
  <div class="container-fluid">
    <div class="card col-6 mx-auto min-vh-50">
      <div class="card-header">
        <h4>
          {{ connected ? $t('common.chatBot.connected') : $t('common.chatBot.disconnected')}}
        </h4>
      </div>
      <div class="card-body p-0 mx-3 mt-3 position-relative z-index-1">
        <div class="container text-center">
<!--          <img v-if="connecting" class="img img-fluid w-25 circle" src="../assets/img/svg/connection.svg" alt="Connecting">-->
          <em v-if="connecting" class="fa-solid fa-spinner fa-10x circle my-0"></em>
          <img v-if="connected" class="img h-25 mx-auto" src="../assets/img/svg/whatsapp.svg" alt="Connected">
          <em v-if="!connecting && !connected && !qr" class="fa-solid fa-circle-exclamation fa-10x mt-5"></em>
          <canvas class="img img-fluid h-25 h-auto" v-show="qr && !connected" id="canvas"></canvas>
        </div>
      </div>

      <div class="card-footer pt-2">
        <div class="row">
          <div class="col" v-if="connected">
            <button class="btn btn-secondary mx-2" @click="reset()">{{ $t('common.chatBot.reset') }}</button>
            <button class="btn btn-danger" @click="destroy()">{{ $t('common.chatBot.disconnect') }}</button>
          </div>
          <div class="col" v-else>
            <button class="btn btn-primary" @click="auth()">{{ $t('common.chatBot.connect') }}</button>
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

const qr: Ref<string|null> = ref('')
const connected: Ref<boolean> = ref(false)
const connecting: Ref<boolean> = ref(false)

let wpClient: WhatsAppClient

function reset() {
  qr.value = null
  wpClient.reset()
}

function auth() {
  connecting.value = true
  qr.value = null
  wpClient.auth()
}

function destroy() {
  qr.value = null
  wpClient.destroy()
}

const onUpdate = (socket: WhatsAppClient): void => {
  connecting.value = false
  qr.value = socket.qr
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
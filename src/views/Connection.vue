<template>
  <div class="container-fluid">
    <div v-if="qr">Esperando QR...</div>
    <canvas v-else id="canvas"></canvas>
  </div>

</template>

<script setup lang="ts">
import SocketClient from '@/services/SocketClient'
import {onMounted} from "vue"
import QRCode from "qrcode";

let qr: string|null = null

onMounted(() => {
  console.log('ssssssss')
  SocketClient.getSocket().on(SocketClient.QR_CODE, (qr: string) => {
    console.log(qr)
    QRCode.toCanvas(document.getElementById('canvas'), qr)
  })
  // SocketClient.onQRCode().then(async (qr: string) => {
  //   console.log(qr)
  //   await QRCode.toCanvas(document.getElementById('canvas'), qr)
  // })
})
</script>
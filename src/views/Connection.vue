<template>
  <div class="mt-4 ms-2 px-2">
    <div class="col-12 col-md ">
      <div class="row">
        <div class="col-md-6">
          <div class="card px-2 py-1">
            <div class="table-responsive">
              <table class="table table-sm table-borderless align-items-center mb-0">
                <caption hidden></caption>
                <thead>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 w-2">#</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 w-2">#</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 w-2">#</th>
                </thead>
                <tbody class="text-sm text-opacity-25">
                  <tr v-for="user in users" :key="user.id">
                    <td class="py-1 col-1">{{ user.name }} - {{ user.email }}</td>
                    <td class="py-1 col-1">{{ user.name }} - {{ user.email }}</td>
                    <td class="py-1">
                <button class="btn btn-sm btn-dark btn-rounded py-1 px-2 mx-1 my-0" data-bs-placement="top"  data-bs-toggle="modal"
                data-bs-target="#messagesWp"><em class="fas fa-pencil"></em></button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-md-5">
          <div class="card col col-md-8 col-xl-6 mx-auto min-vh-50">
            <div class="card-header">
              <h4>
                {{ connected ? $t('common.chatBot.connected') : $t('common.chatBot.disconnected') }}
              </h4>
            </div>
            <div class="card-body p-0 mx-3 mt-3 position-relative z-index-1">
              <div class="container text-center">
                <em v-if="connecting || loading" class="fa-solid fa-spinner fa-10x circle my-0"></em>
                <img v-if="connected && !connecting" class="img w-25  mx-auto" src="../assets/img/svg/whatsapp.svg"
                  alt="Connected">
                <em v-if="!connecting && !connected && !qr && !loading"
                  class="fa-solid fa-circle-exclamation fa-10x mt-5 mb-3"></em>
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
                  <button class="btn btn-danger" @click="destroy()" :disabled="connecting || loading">{{
                    $t('common.chatBot.disconnect') }}</button>
                </div>
                <div class="col" v-else>
                  <button class="btn btn-primary" @click="auth()" :disabled="connecting || loading || qr">{{
                    $t('common.chatBot.connect') }}</button>
                </div>
              </div>
              <div class="row mx-1 mt-3">
                <div class="form-check form-switch">
                  <input class="form-check-input" name="enable" type="checkbox" :checked="settings.wpNotifications"
                    :disabled="!connected" @change="enableWpNotifications(!settings.wpNotifications)" />
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
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade" id="messagesWp" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ $t('common.messages.update_message') }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Form >
          <div class="modal-body">
            <div class="mb-3">
              <Field name="password" type="password" v-slot="{ field }">
                <div class="input-group">
                  <textarea class="form-control form-control-sm" id="message-text" aria-label="Message" aria-describedby="message-addon" v-model="field.value" 
                  :placeholder="$t('common.messages.menssage')" v-bind="field"/>
                </div>
              </Field>
              <ErrorMessage name="password" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">
              {{ $t('common.actions.close') }}
            </button>
            <button type="submit" class="btn bg-gradient-primary">{{ $t('common.actions.update') }}</button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WhatsAppClient from '@/services/gordaApi/WhatsAppClient'
import { onBeforeUnmount, onMounted, ref, Ref } from 'vue'
import QRCode from 'qrcode'
import { ClientObserver } from '@/services/gordaApi/ClientObserver'
import { useSettingsStore } from '@/services/stores/SettingsStore'
import { storeToRefs } from 'pinia'
import { LoadingType } from '@/types/LoadingType'
import SettingsRepository from '@/repositories/SettingsRepository'
import { DataSnapshot } from 'firebase/database'
import { ErrorMessage, Field, Form } from 'vee-validate'

const qr: Ref<string | null> = ref(null)
const connected: Ref<boolean> = ref(false)
const connecting: Ref<boolean> = ref(false)
const loading: Ref<LoadingType | null> = ref(null)
const { enableWpNotifications } = useSettingsStore()
const { settings } = storeToRefs(useSettingsStore())

let wpClient: WhatsAppClient

function auth() {
  connecting.value = true
  wpClient.auth()
}

function destroy() {
  connecting.value = true
  wpClient.destroy()
}

interface User {
  id: number
  name: string
  email: string
}

const users = ref<User[] | null>(null);

onMounted(async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users")
  users.value = await response.json()
  console.log(users.value)
})

const onUpdate = (socket: WhatsAppClient): void => {
  connecting.value = false
  qr.value = socket.qr
  loading.value = socket.loading
  if (qr.value) QRCode.toCanvas(document.getElementById('canvas'), qr.value as string, (e) => { console.log(e) })
  connected.value = socket.isConnected()
  connecting.value = socket.isConnecting()
}

onBeforeUnmount(() => {
  SettingsRepository.offWpNotifications()
})

onMounted(() => {
  SettingsRepository.onWpNotifications((snapshot: DataSnapshot) => {
    settings.value.wpNotifications = snapshot.val()
  })
  wpClient = WhatsAppClient.getInstance()
  const observer = new ClientObserver(onUpdate)
  wpClient.attach(observer)
  connected.value = wpClient.isConnected()
})
</script>
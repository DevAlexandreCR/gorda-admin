<template>
  <div>
    <div class="card">
      <div class="card-header d-flex justify-content-between">
        <div class="container">
          <h4>{{client.alias}}</h4>
          <h6>
            {{ connected ? $t('common.chatBot.connected') : $t('common.chatBot.disconnected')}}
          </h6>
          <router-link :to="{ name: 'whatsapp.chat', params: {id: client.id}}" tag="a"
                       class="btn btn-sm btn-info btn-rounded rounded-pill py-1 m-0"
                       data-original-title="Chat">
            <em class="fas fa-pencil"></em>
          </router-link>
        </div>
        <button class="btn btn-danger btn-rounded" :data-bs-target="'#delete-client' + client.id" data-bs-toggle="modal"><em class="fa fa-trash"></em></button>
      </div>
      <div class="card-body p-0 mx-3 mt-3 position-relative z-index-1">
        <div class="container text-center">
          <em v-if="connecting || loading" class="fa-solid fa-spinner fa-10x circle my-0"></em>
          <img v-if="connected && !connecting" class="img w-50  mx-auto" src="../../assets/img/svg/whatsapp.svg" alt="Connected">
          <em v-if="!connecting && !connected && !qr && !loading" class="fa-solid fa-circle-exclamation fa-10x mt-5 mb-3"></em>
          <div v-if="loading" class="mt-2">
            <h5>{{ loading.message }}</h5>
            <div class="progress mx-2 my-4">
              <div class="progress-bar bg-success" role="progressbar" :style="'width: ' + loading.percent + '%'"
                   :aria-valuenow="loading.percent" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
          <canvas class="img img-fluid h-25 h-auto" v-show="qr && !connected" :id="props.client.id"></canvas>
        </div>
        <div class="container text-center">{{client.id}}</div>
      </div>

      <div class="card-footer pt-2">
        <div class="row">
          <div class="col" v-if="!connected">
            <button class="btn btn-primary" @click="auth()" :disabled="connecting || loading || qr">{{ $t('common.chatBot.connect') }}</button>
          </div>
          <div class="col" v-else>
          </div>
        </div>
        <div class="row mx-1 mt-3">
          <div class="form-check form-switch">
            <input class="form-check-input" name="enable" type="checkbox" :checked="props.client.wpNotifications" :disabled="!connected"
                   @click.prevent="enableWpNotifications(props.client, !props.client.wpNotifications)"/>
            <div class="d-flex flex-column justify-content-center">
              <h6 class="mb-0">{{$t('common.settings.wpNotifications')}}</h6>
              <p v-if="connected && !props.client.wpNotifications && !props.client.chatBot && !props.client.assistant"
                  class="alert p-1 ps-2 text-white text-sm alert-danger">
                {{ $t('common.settings.alert_notifications') }}
              </p>
            </div>
          </div>
        </div>
        <div class="row mx-1 mt-3">
          <div class="form-check form-switch">
            <input class="form-check-input" name="enable" type="checkbox" :checked="props.client.assistant" :disabled="!connected"
                   @click.prevent="enableAssistant(props.client, !props.client.assistant)"/>
            <h6 class="mb-0">{{$t('common.settings.assistant')}}</h6>
            <p class="text-sm text-secondary my-0" v-if="connected && !props.client.assistant">{{ $t('common.settings.alert_assistant') }}</p>
          </div>
        </div>
        <div class="row mx-1 mt-3">
          <div class="form-check form-switch">
            <input class="form-check-input" name="enable" type="checkbox" :checked="props.client.chatBot" :disabled="!connected"
                   @click.prevent="enableChatBot(props.client, !props.client.chatBot)"/>
            <h6 class="mb-0">{{$t('common.settings.chatBot')}}</h6>
            <p class="text-sm" v-if="connected && !props.client.chatBot">{{ $t('common.settings.alert_chatBot') }}</p>
          </div>
        </div>
        <div class="row mx-1 mt-3">
          <div class="form-check form-switch">
            <input class="form-check-input" name="enable" type="checkbox" :checked="defaultClient === client.id"
                   :disabled="defaultClient === client.id" @change="setDefault(props.client.id)"/>
            <label class="form-check-label">{{
                defaultClient === client.id ? $t('wp.placeholders.default') : $t('wp.placeholders.select_default')
              }}</label>
          </div>
        </div>
      </div>
    </div>
    <!--Modal-->
    <div class="modal fade" :id="'delete-client' + client.id" tabindex="-1" :aria-labelledby="'delete-client' + client.id" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content px-2">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t('common.actions.delete') }}</h5>
            <button type="button" id="closeModalButton" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            {{$t('wp.placeholders.delete')}}
          </div>
          <div class="card-footer text-end">
            <button class="btn btn-secondary me-2" type="button" @click="hide('delete-client')">{{ $t('common.actions.cancel') }}</button>
            <button class="btn btn-info" type="button" @click="deleteWpClient">{{ $t('common.actions.delete') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WhatsAppClient from '@/services/gordaApi/WhatsAppClient'
import {onBeforeUnmount, onMounted, ref, Ref} from 'vue'
import QRCode from 'qrcode'
import {ClientObserver} from '@/services/gordaApi/ClientObserver'
import {useWpClientsStore} from '@/services/stores/WpClientStore'
import {LoadingType} from '@/types/LoadingType'
import {WpClient} from "@/types/WpClient";
import {hide} from "@/helpers/ModalHelper";
import {storeToRefs} from "pinia";


interface Props {
  client: WpClient
}

const props = defineProps<Props>()
const qr: Ref<string|null> = ref(null)
const connected: Ref<boolean> = ref(false)
const connecting: Ref<boolean> = ref(false)
const loading: Ref<LoadingType|null> = ref(null)
const {enableWpNotifications, onWpNotification, offWpNotifications, deleteClient, setDefault, enableChatBot, enableAssistant} = useWpClientsStore()
const {defaultClient} = storeToRefs(useWpClientsStore())

let wpClient: WhatsAppClient
let observer: ClientObserver

function auth() {
  connecting.value = true
  wpClient.auth()
}

const onUpdate = (socket: WhatsAppClient): void => {
  connecting.value = false
  qr.value = socket.qr
  loading.value = socket.loading
  if (qr.value) QRCode.toCanvas(document.getElementById(props.client.id), qr.value as string, (e) => {console.log(e)})
  connected.value = socket.isConnected()
  connecting.value = socket.isConnecting()
}

async function deleteWpClient(): Promise<void> {
  hide('delete-client' + props.client.id)
  wpClient.destroy()
  await deleteClient(props.client)
}

onBeforeUnmount(() => {
  offWpNotifications(props.client)
  wpClient.detach(observer)
})

onMounted(() => {
  onWpNotification(props.client)
  wpClient = WhatsAppClient.getInstance(props.client)
  observer = new ClientObserver(onUpdate)
  wpClient.attach(observer)
  connected.value = wpClient.isConnected()
})
</script>
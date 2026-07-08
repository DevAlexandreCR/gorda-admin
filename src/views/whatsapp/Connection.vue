<template>
  <div>
    <div class="wpc-card" :class="{ 'wpc-card--default': defaultClient === client.id }">
      <!-- header -->
      <div class="wpc-header">
        <div class="wpc-icon-chip" :class="'wpc-icon-chip--' + iconState">
          <em v-if="iconState === 'connecting'" class="fa-solid fa-spinner fa-spin"></em>
          <em v-else class="fa-brands fa-whatsapp"></em>
        </div>
        <div class="wpc-identity">
          <div class="wpc-alias">
            {{ client.alias }}
            <span v-if="isBusy" class="spinner-border spinner-border-sm text-secondary ms-2" role="status" aria-hidden="true"></span>
          </div>
          <div class="wpc-id">{{ client.id }}</div>
        </div>
        <div class="wpc-header-actions">
          <button class="wpc-icon-btn wpc-icon-btn--restart" :data-bs-target="'#restart-client' + client.id" data-bs-toggle="modal" :title="$t('common.actions.restart')">
            <em class="fa fa-rotate"></em>
          </button>
          <button class="wpc-icon-btn wpc-icon-btn--delete" :data-bs-target="'#delete-client' + client.id" data-bs-toggle="modal" :title="$t('common.actions.delete')">
            <em class="fa fa-trash"></em>
          </button>
        </div>
      </div>

      <!-- status row: pill + default indicator + primary action -->
      <div class="wpc-status-row">
        <span class="wpc-status-pill" :class="'wpc-status-pill--' + statusKey">
          <span class="wpc-status-dot"></span>
          <template v-if="statusKey === 'connected'">{{ $t('common.chatBot.connected') }}</template>
          <template v-else-if="statusKey === 'syncing'">{{ $t('wp.status.syncing') }}</template>
          <template v-else-if="statusKey === 'awaiting_scan'">{{ $t('wp.status.awaiting_scan') }}</template>
          <template v-else-if="statusKey === 'generating_code'">{{ $t('wp.status.generating_code') }}</template>
          <template v-else>{{ $t('common.chatBot.disconnected') }}</template>
        </span>

        <span v-if="defaultClient === client.id" class="wpc-default-badge">{{ $t('wp.placeholders.default_badge') }}</span>
        <a v-else href="#" class="wpc-default-link" @click.prevent="setDefault(props.client.id)">{{ $t('wp.placeholders.select_default') }}</a>

        <div class="wpc-spacer"></div>

        <button v-if="!connected" class="wpc-primary-btn" @click="auth()" :disabled="connecting || loading || qr">{{ $t('common.chatBot.connect') }}</button>
        <a v-else-if="props.client.service === WhatsappServices.OFFICIAL" :href="chatUrl" class="wpc-chat-pill" target="_blank" rel="noopener noreferrer">
          <em class="fas fa-message"></em>
          {{ $t('wp.actions.chat') }}
        </a>
      </div>

      <!-- QR / progress panel -->
      <div v-if="!connected && (connecting || qr || loading)" class="wpc-qr-panel">
        <div class="wpc-qr-box">
          <canvas class="wpc-qr-canvas" v-show="qr && !connected" :id="props.client.id"></canvas>
          <em v-if="connecting && !qr" class="fa-solid fa-spinner fa-spin wpc-qr-spinner"></em>
        </div>
        <div v-if="loading" class="wpc-loading">
          <h5 class="wpc-loading-msg">{{ loading.message }}</h5>
          <div class="progress mx-2 my-4">
            <div class="progress-bar bg-success" role="progressbar" :style="'width: ' + loading.percent + '%'"
                 :aria-valuenow="loading.percent" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
        <div class="wpc-qr-id">{{ client.id }}</div>
        <div v-if="qr && !connected" class="wpc-scan-hint">{{ $t('wp.placeholders.scan_hint') }}</div>
      </div>

      <!-- toggles -->
      <div class="wpc-toggles">
        <div class="wpc-toggle-row">
          <div class="form-check form-switch wpc-switch mb-0">
            <input class="form-check-input" name="enable" type="checkbox" :checked="props.client.wpNotifications" :disabled="!connected || isBusy"
                   @click.prevent="enableWpNotifications(props.client, !props.client.wpNotifications)"/>
          </div>
          <div class="wpc-toggle-text">
            <div class="wpc-toggle-label">{{$t('common.settings.wpNotifications')}}</div>
            <p v-if="connected && !props.client.wpNotifications && !props.client.chatBot && !props.client.assistant"
                class="alert p-1 ps-2 text-white text-sm alert-danger">
              {{ $t('common.settings.alert_notifications') }}
            </p>
          </div>
        </div>
        <div class="wpc-toggle-row">
          <div class="form-check form-switch wpc-switch mb-0">
            <input class="form-check-input" name="enable" type="checkbox" :checked="props.client.assistant" :disabled="!connected || isBusy"
                   @click.prevent="enableAssistant(props.client, !props.client.assistant)"/>
          </div>
          <div class="wpc-toggle-text">
            <div class="wpc-toggle-label">{{$t('common.settings.assistant')}}</div>
            <p class="text-sm text-secondary my-0" v-if="connected && !props.client.assistant">{{ $t('common.settings.alert_assistant') }}</p>
          </div>
        </div>
        <div class="wpc-toggle-row">
          <div class="form-check form-switch wpc-switch mb-0">
            <input class="form-check-input" name="enable" type="checkbox" :checked="props.client.chatBot" :disabled="!connected || isBusy"
                   @click.prevent="enableChatBot(props.client, !props.client.chatBot)"/>
          </div>
          <div class="wpc-toggle-text">
            <div class="wpc-toggle-label">{{$t('common.settings.chatBot')}}</div>
            <p class="text-sm" v-if="connected && !props.client.chatBot">{{ $t('common.settings.alert_chatBot') }}</p>
          </div>
        </div>
        <div class="wpc-toggle-row wpc-toggle-row--last">
          <div class="form-check form-switch wpc-switch wpc-switch--danger mb-0">
            <input class="form-check-input form-check-danger" name="enableFull" type="checkbox" :checked="props.client.full" :disabled="!connected || isBusy"
                   @click.prevent="enableFull(props.client, !props.client.full)"/>
          </div>
          <div class="wpc-toggle-text">
            <div class="wpc-toggle-label">{{ $t('common.actions.toggle_full') }}</div>
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
            <button class="btn btn-secondary me-2" type="button" @click="hide('delete-client' + client.id)">{{ $t('common.actions.cancel') }}</button>
            <button class="btn btn-info" type="button" :disabled="isBusy" @click="deleteWpClient">{{ $t('common.actions.delete') }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" :id="'restart-client' + client.id" tabindex="-1" :aria-labelledby="'restart-client' + client.id" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content px-2">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t('common.actions.restart') }}</h5>
            <button type="button" id="closeModalButton" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            {{$t('wp.placeholders.restart')}}
          </div>
          <div class="card-footer text-end">
            <button class="btn btn-secondary me-2" type="button" @click="hide('restart-client' + client.id)">{{ $t('common.actions.cancel') }}</button>
            <button class="btn btn-info" type="button" @click="restartWpClient">{{ $t('common.actions.restart') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WhatsAppClient from '@/services/gordaApi/WhatsAppClient'
import {computed, onBeforeUnmount, onMounted, ref, Ref} from 'vue'
import QRCode from 'qrcode'
import {ClientObserver} from '@/services/gordaApi/ClientObserver'
import {useWpClientsStore} from '@/services/stores/WpClientStore'
import {LoadingType} from '@/types/LoadingType'
import {WpClient} from "@/types/WpClient";
import {hide} from "@/helpers/ModalHelper";
import {storeToRefs} from "pinia";
import {WhatsappServices} from "@/constants/WhatsappServices";
import {useRouter} from "vue-router";

interface Props {
  client: WpClient
}

const props = defineProps<Props>()
const qr: Ref<string|null> = ref(null)
const connected: Ref<boolean> = ref(false)
const connecting: Ref<boolean> = ref(false)
const loading: Ref<LoadingType|null> = ref(null)
const router = useRouter()
const {enableWpNotifications, onWpNotification, offWpNotifications, deleteClient, setDefault, enableChatBot, enableAssistant, enableFull} = useWpClientsStore()
const {defaultClient, busy} = storeToRefs(useWpClientsStore())
const isBusy = computed(() => !!busy.value[props.client.id])
const chatUrl = computed(() => router.resolve({
  name: 'whatsapp.chat',
  params: { id: props.client.id }
}).href)

// Drives the header icon-chip gradient/icon: green+whatsapp when connected,
// blue+spinner while connecting/awaiting a QR scan/syncing, gray+whatsapp otherwise.
const iconState = computed<'connected'|'connecting'|'disconnected'>(() => {
  if (connected.value) return 'connected'
  if (connecting.value || qr.value || loading.value) return 'connecting'
  return 'disconnected'
})

// Drives the status pill label/color in the same precedence as the legacy markup.
const statusKey = computed<'connected'|'syncing'|'awaiting_scan'|'generating_code'|'disconnected'>(() => {
  if (connected.value) return 'connected'
  if (loading.value) return 'syncing'
  if (qr.value) return 'awaiting_scan'
  if (connecting.value) return 'generating_code'
  return 'disconnected'
})

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
  // width kept below .wpc-qr-box's 176px so the QR is never clipped
  if (qr.value) QRCode.toCanvas(document.getElementById(props.client.id), qr.value as string, { width: 160 }, (e) => {console.log(e)})
  connected.value = socket.isConnected()
  connecting.value = socket.isConnecting()
}

async function deleteWpClient(): Promise<void> {
  hide('delete-client' + props.client.id)
  wpClient.destroy()
  await deleteClient(props.client)
}

async function restartWpClient(): Promise<void> {
  hide('restart-client' + props.client.id)
  wpClient.reset()
  connecting.value = true
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
  wpClient.requestState()
})
</script>

<style scoped>
.wpc-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: 1rem;
  box-shadow: var(--shadow-card);
  font-family: var(--font-sans);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
.wpc-card--default {
  border: 2px solid var(--primary);
}

/* header */
.wpc-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem 0.85rem;
  border-bottom: 1px solid var(--border-subtle);
}
.wpc-icon-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 0.65rem;
  color: #fff;
  font-size: 1.05rem;
  box-shadow: 0 2px 9px -5px rgba(0, 0, 0, 0.4), 0 0 1px rgba(0, 0, 0, 0.08);
}
.wpc-icon-chip--connected { background: linear-gradient(310deg, #128c7e, #25d366); }
.wpc-icon-chip--connecting { background: linear-gradient(310deg, #2152ff, #21d4fd); }
.wpc-icon-chip--disconnected { background: linear-gradient(310deg, #8392ab, #aeb9cf); }

.wpc-identity {
  flex: 1;
  min-width: 0;
}
.wpc-alias {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-heading);
}
.wpc-id {
  margin-top: 0.15rem;
  overflow: hidden;
  font-size: 0.68rem;
  font-family: var(--font-mono);
  color: var(--text-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.wpc-header-actions {
  display: flex;
  flex: none;
  gap: 0.4rem;
}
.wpc-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 0.5rem;
  background: var(--surface-input);
  color: var(--text-body);
  font-size: 0.8rem;
  cursor: pointer;
  box-shadow: 0 2px 9px -5px rgba(0, 0, 0, 0.25), 0 0 1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}
.wpc-icon-btn--restart:hover {
  background: linear-gradient(310deg, #2152ff, #21d4fd);
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
}
.wpc-icon-btn--delete:hover {
  background: linear-gradient(310deg, #d60808, #ff6690);
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
}

/* status row */
.wpc-status-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border-bottom: 1px solid var(--border-subtle);
}
.wpc-status-pill {
  display: inline-flex;
  align-items: center;
  flex: none;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.wpc-status-pill--connected { background: var(--badge-success-bg); color: var(--badge-success-fg); }
.wpc-status-pill--connected .wpc-status-dot { background: #82d616; }
.wpc-status-pill--syncing,
.wpc-status-pill--awaiting_scan,
.wpc-status-pill--generating_code { background: var(--badge-info-bg); color: var(--badge-info-fg); }
.wpc-status-pill--syncing .wpc-status-dot,
.wpc-status-pill--awaiting_scan .wpc-status-dot,
.wpc-status-pill--generating_code .wpc-status-dot { background: #17c1e8; }
.wpc-status-pill--disconnected { background: var(--badge-danger-bg); color: var(--badge-danger-fg); }
.wpc-status-pill--disconnected .wpc-status-dot { background: #ea0606; }
.wpc-status-dot {
  flex: none;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.wpc-default-badge {
  flex: none;
  padding: 0.2rem 0.5rem;
  background: var(--badge-primary-bg);
  color: var(--badge-primary-fg);
  border-radius: var(--radius-pill);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.wpc-default-link {
  flex: none;
  padding: 0;
  border: none;
  background: none;
  color: var(--text-muted);
  font-size: 0.68rem;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
}
.wpc-spacer {
  flex: 1;
}
.wpc-primary-btn {
  flex: none;
  margin-left: auto;
  padding: 0.45rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--primary);
  color: #fff;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: var(--shadow-btn);
  transition: all 0.2s ease;
}
.wpc-primary-btn:hover:not(:disabled) {
  background: linear-gradient(310deg, #7928ca, #ff0080);
}
.wpc-primary-btn:disabled {
  opacity: 0.5;
  box-shadow: none;
  cursor: default;
}
.wpc-chat-pill {
  display: inline-flex;
  align-items: center;
  flex: none;
  margin-left: auto;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  border-radius: 0.5rem;
  background: var(--badge-success-bg);
  color: var(--badge-success-fg);
  font-size: 0.72rem;
  font-weight: 700;
  text-decoration: none;
}

/* QR / progress panel */
.wpc-qr-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 1.25rem 1.25rem 0.5rem;
}
.wpc-qr-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 176px;
  height: 176px;
  overflow: hidden;
  background: #fff;
  border-radius: 0.6rem;
  box-shadow: 0 2px 9px -5px rgba(0, 0, 0, 0.35);
}
.wpc-qr-canvas {
  display: block;
  max-width: 100%;
  max-height: 100%;
  height: auto;
}
.wpc-qr-spinner {
  color: #0b0b0f;
  font-size: 1.3rem;
  opacity: 0.6;
}
.wpc-loading {
  width: 100%;
  text-align: center;
}
.wpc-loading-msg {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-heading);
}
.wpc-qr-id {
  font-size: 0.72rem;
  font-family: var(--font-mono);
  color: var(--text-muted);
}
.wpc-scan-hint {
  font-size: 0.72rem;
  color: var(--text-muted);
  text-align: center;
}

/* toggle rows */
.wpc-toggles {
  padding: 0.15rem 1.25rem 0.85rem;
}
.wpc-toggle-row {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.45rem 0;
  border-bottom: 1px solid var(--border-subtle);
}
.wpc-toggle-row--last {
  border-bottom: none;
}
.wpc-toggle-text {
  flex: 1;
  min-width: 0;
}
.wpc-toggle-label {
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-heading);
}
.wpc-switch {
  display: flex;
  align-items: center;
  flex: none;
  min-height: 0;
  padding-left: 0;
  margin-top: 0.15rem;
}
.wpc-switch .form-check-input {
  width: 36px;
  height: 20px;
  margin: 0;
  background-color: var(--border-color);
  border-color: var(--border-color);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
.wpc-switch .form-check-input:checked {
  background-color: var(--primary) !important;
  border-color: var(--primary) !important;
}
.wpc-switch .form-check-input:disabled {
  cursor: default;
  opacity: 0.45;
}
.wpc-switch--danger .form-check-input:checked {
  background-color: #dc3545 !important;
  border-color: #dc3545 !important;
}
.wpc-switch--danger .form-check-input:focus {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
}
.wpc-switch--danger .form-check-input:checked:focus {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5) !important;
}
</style>

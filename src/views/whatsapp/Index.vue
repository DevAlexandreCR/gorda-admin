<template>
  <div>
    <div class="container-fluid">
      <div class="wpv-topbar">
        <div class="wpv-tabbar">
          <span class="wpv-tab wpv-tab--active">
            <em class="fas fa-wifi"></em>
            {{ $t('wp.tabs.connections') }}
          </span>
        </div>
        <div class="wpv-actions">
          <button class="wpv-btn wpv-btn--outline" @click="launchWhatsAppSignup">
            <i class="bi bi-whatsapp"></i>
            {{ $t('wp.actions.add_phone_number') }}
          </button>
          <button class="wpv-btn wpv-btn--solid" data-bs-target="#create-client" data-bs-toggle="modal">{{$t('common.actions.create')}}</button>
        </div>
      </div>
      <div class="wpv-grid">
        <Connection v-for="client in clients" :key="client.id" :client="client"></Connection>
      </div>
    </div>
  </div>
  <!--Modal-->
  <div class="modal fade" id="create-client" tabindex="-1" aria-labelledby="create-client" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ $t('wp.actions.create') }}</h5>
          <button type="button" id="closeEditPasswordModalButton" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <Form @submit="create" :validation-schema="schema" autocomplete="off">
            <div class="form-group">
              <label>{{ $t('wp.fields.alias') }}</label>
              <Field name="alias" type="text" class="form-control" id="alias" :placeholder="$t('wp.fields.alias')"
                     v-model="newClient.alias" aria-label="Alias" aria-describedby="alias-addon" />
              <ErrorMessage name="alias"/>
            </div>
            <div class="form-group">
              <label>{{ $t('wp.fields.id') }}</label>
              <Field name="id" type="phone" class="form-control" id="id" :placeholder="$t('wp.fields.id')"
                     v-model="newClient.id" aria-label="Phone" aria-describedby="phone-addon" />
              <ErrorMessage name="id"/>
            </div>
            <div class="form-check form-switch">
              <input class="form-check-input" name="wpApi" type="checkbox" v-model="useApi"/>
              <label class="form-check-label">{{ $t('wp.placeholders.select_wp_api') }}</label>
            </div>
            <div class="card-footer text-end">
              <button class="btn btn-info" type="submit">{{ $t('common.actions.submit') }}</button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>

</template>
<script setup lang="ts">
import {useWpClientsStore} from "@/services/stores/WpClientStore"
import Connection from "@/views/whatsapp/Connection.vue"
import {storeToRefs} from "pinia"
import {onMounted, reactive, ref, watch} from "vue";
import {WpClient} from "@/types/WpClient";
import {ErrorMessage, Field, Form} from "vee-validate";
import * as yup from "yup";
import {StrHelper} from "@/helpers/StrHelper";
import {hide} from "@/helpers/ModalHelper";
import { useI18n } from "vue-i18n";
import {WhatsappServices} from "@/constants/WhatsappServices";
import ToastService from "@/services/ToastService";
import FacebookService from "@/services/FacebookService";

const {clients} = storeToRefs(useWpClientsStore())
const {createClient, getWpClients} = useWpClientsStore()
const {t} = useI18n()
const useApi = ref<boolean>(false)
const WHATSAPP_CONFIG_ID = process.env.VUE_APP_WHATSAPP_CONFIG_ID || ''

const newClient = reactive<WpClient>({
  id: '',
  alias: '',
  wpNotifications: false,
  full: false,
  chatBot: false,
  assistant: false,
  service: WhatsappServices.BAILEYS
})
const schema = yup.object().shape({
  id: yup.string()
    .required(`${t('validations.required')}`)
    .matches(/^\d+$/, `${t('validations.requiredNumbers')}`)
    .matches(/^\S*$/, `${t('validations.NotSpaces')}`)
    .min(9),
  alias: yup.string()
    .required(`${t('validations.required')}`)
    .min(3, `${t('validations.requiredMinTree')}`)
})

onMounted(() => {
  FacebookService.loadSDK()
    .catch(error => console.error('Failed to load Facebook SDK:', error))
  getWpClients()
    .catch(error => console.error('Failed to load WhatsApp clients:', error))
})

function launchWhatsAppSignup() {
  FacebookService.launchEmbeddedSignup(WHATSAPP_CONFIG_ID)
    .then(code => {
      ToastService.showLoading(
        t('wp.info.processing'),
        t('wp.info.connecting_phone_number')
      )
      return processWhatsAppSignup(code)
    })
    .then(() => {
      ToastService.close()
    })
    .catch(error => {
      ToastService.close()
      if (error.message !== 'User cancelled or did not authorize') {
        console.error('Error during signup:', error)
        ToastService.toast('error', t('wp.errors.failed_to_connect_phone'))
      } else {
        ToastService.toast('info', t('wp.info.signup_cancelled'))
      }
    })
}

async function processWhatsAppSignup(code: string) {
  const accessToken = await FacebookService.exchangeCodeForToken(code)
  const wabaId = await FacebookService.getWABAIdFromToken(accessToken)
  await FacebookService.subscribeWabaToWebhook(wabaId, accessToken)
  const phoneNumbers = await FacebookService.getPhoneNumbers(wabaId, accessToken)
  
  if (phoneNumbers.length === 0) {
    throw new Error('No phone numbers found')
  }
  
  const latestPhone = phoneNumbers[phoneNumbers.length - 1]
  const phoneNumberId = latestPhone.id
  const displayPhoneNumber = latestPhone.display_phone_number || latestPhone.phone_number
  
  const alias = displayPhoneNumber 
    ? displayPhoneNumber.replace(/\D/g, '')
    : phoneNumberId.slice(-4)
  
  const wpClient: WpClient = {
    id: phoneNumberId,
    alias: alias,
    wpNotifications: false,
    full: false,
    chatBot: false,
    assistant: false,
    service: WhatsappServices.OFFICIAL
  }
  
  await createClient(wpClient)
  
  ToastService.toast('success', 
    `${t('wp.success.phone_number_connected')}: ${displayPhoneNumber || alias}`
  )
}

watch(newClient, (clientNew) => {
  newClient.alias = StrHelper.toCamelCase(clientNew.alias?? '')
}, {deep: true})

function create(_values: any, event: any): void {
  if (useApi.value) {
    newClient.service = WhatsappServices.OFFICIAL
  } else {
    newClient.service = WhatsappServices.BAILEYS
  }
  createClient(newClient).finally(() => {
    hide('create-client')
    event.resetForm()
    location.reload()
  })
}
</script>

<style scoped>
.wpv-topbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 1rem 0 1.5rem;
}
.wpv-tabbar {
  display: flex;
  gap: 0.2rem;
  background: var(--surface-card);
  padding: 0.25rem;
  border-radius: 0.625rem;
  box-shadow: var(--shadow-card);
}
.wpv-tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.38rem 1rem;
  border-radius: 0.4rem;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-body);
}
.wpv-tab--active {
  background: var(--primary);
  color: #fff;
  box-shadow: var(--shadow-btn);
}
.wpv-tab em {
  font-size: 0.74rem;
}

.wpv-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.wpv-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}
.wpv-btn--outline {
  background: transparent;
  border: 1.5px solid var(--primary);
  color: var(--primary);
}
.wpv-btn--outline:hover {
  background: var(--primary);
  color: #fff;
}
.wpv-btn--solid {
  background: var(--primary);
  color: #fff;
  box-shadow: var(--shadow-btn);
}
.wpv-btn--solid:hover {
  background: linear-gradient(310deg, #7928ca, #ff0080);
}

.wpv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
</style>

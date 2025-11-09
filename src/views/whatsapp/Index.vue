<template>
  <div>
    <div class="container-fluid d-flex justify-content-end gap-2">
      <button class="btn btn-success" @click="launchWhatsAppSignup">
        <i class="bi bi-whatsapp me-2"></i>{{ $t('wp.actions.add_phone_number') }}
      </button>
      <button class="btn btn-primary" data-bs-target="#create-client" data-bs-toggle="modal">{{$t('common.actions.create')}}</button>
    </div>
    <div class="row container-fluid">
      <div class="col-md-6 mt-2" v-for="client in clients" :key="client.id">
        <Connection :client="client"></Connection>
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
const {createClient} = useWpClientsStore()
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
})

function launchWhatsAppSignup() {
  FacebookService.launchEmbeddedSignup(WHATSAPP_CONFIG_ID)
    .then(code => processWhatsAppSignup(code))
    .catch(error => {
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
  
  setTimeout(() => location.reload(), 1500)
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
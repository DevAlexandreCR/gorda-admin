<template>
  <div class="my-2">
    <div class="row">
      <Form @submit="onSubmit" :validation-schema="schema" autocomplete="off" @keydown.enter="submitFromEnter">
        <div class="row">
          <div class="col-12 col-md col-xl-1 px-1">
            <div class="form-group">
              <Field name="wp_client_id" class="form-select pe-0" v-model="service.wp_client_id" as="select">
                <option v-for="client in wpClients" :key="client.id" :value="client.id"
                        :selected="client.id == defaultClient">{{ client.alias }}</option>
              </Field>
              <ErrorMessage name="wp_client_id" v-slot="{ message }">
                <span class="is-invalid">{{ message }}</span>
              </ErrorMessage>
            </div>
          </div>
          <div class="col-12 col-md col-xl-1 px-1">
            <div class="form-group">
              <select name="countryCode" class="form-select pe-0" id="color" v-model="countryCode">
                <option v-for="(cCode, key) in countryCodes" :key="key" :value="cCode">{{ cCode.dialCode + ' ' + cCode.code }}</option>
              </select>
            </div>
          </div>
          <div class="col-12 col-md px-1">
            <div class="form-group">
              <AutoComplete :fieldName="'phone'" :idField="service.id" @selected="onClientSelected" @on-change="checkPhoneNoExists" :elements="clientsPhone"
                            v-model="service.phone" :placeholder="$t('common.placeholders.phone')" :normalizer="StrHelper.formatNumber"/>
              <Field name="client_id" type="hidden" v-slot="{ field }" v-model="service.client_id">
                <input type="hidden" name="client_id" v-bind="field">
              </Field>
            </div>
          </div>
          <div class="col-12 col-md px-1">
            <div class="form-group">
              <Field name="name" type="text" v-slot="{ field, errorMessage, meta }" v-model="service.name">
                <input class="form-control" v-model="field.value" :placeholder="$t('common.placeholders.name')"
                       v-bind="field" autocomplete="off"/>
                <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
              </Field>
              <ErrorMessage name="name" v-slot="{ message }">
                <span class="is-invalid">{{ message }}</span>
              </ErrorMessage>
            </div>
          </div>
          <div class="col-12 col-md px-1">
            <div class="form-group">
              <AutoComplete :idField="service.id + 1" :fieldName="'start_address'" @selected="locSelected" :elements="placesAutocomplete"
                            :placeholder="$t('common.placeholders.address')"/>
            </div>
          </div>
          <div class="col-12 col-md px-1">
            <div class="form-group">
              <Field name="comment" type="text" v-slot="{ field, errorMessage }" v-model="service.comment">
                <input class="form-control" v-model="field.value" :placeholder="$t('common.placeholders.comment')"
                       v-bind="field" autocomplete="none"/>
                <span class="is-invalid" v-if="errorMessage">{{ errorMessage }}</span>
              </Field>
              <ErrorMessage name="comment" v-slot="{ message }">
                <span class="is-invalid">{{ message }}</span>
              </ErrorMessage>
            </div>
          </div>
          <div class="col-12 col-md px-1">
            <div class="row row-cols-2">
              <div class="col">
                <div class="form-group">
                  <select name="countryCode" class="form-select pe-0" id="color" v-model="count">
                    <option v-for="(count) in [1, 2, 3, 4, 5]" :key="count" :value="count">{{ count }}</option>
                  </select>
                </div>
              </div>
              <div class="col px-1">
                <button class="btn btn-primary d-inline-flex" type="submit">{{ $t('common.actions.create') }}</button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Field, Form, FormActions, ErrorMessage} from 'vee-validate'
import * as yup from 'yup'
import Service from '@/models/Service'
import AutoComplete from '@/components/AutoComplete.vue'
import {AutoCompleteType} from '@/types/AutoCompleteType'
import ClientRepository from '@/repositories/ClientRepository'
import {LocationType} from '@/types/LocationType'
import {ServiceInterface} from '@/types/ServiceInterface'
import {onMounted, ref, Ref, watch} from 'vue'
import ServiceRepository from '@/repositories/ServiceRepository'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import {ClientInterface} from '@/types/ClientInterface'
import {usePlacesStore} from '@/services/stores/PlacesStore'
import {useClientsStore} from '@/services/stores/ClientsStore'
import {PlaceInterface} from '@/types/PlaceInterface'
import {useLoadingState} from '@/services/stores/LoadingState'
import {storeToRefs} from 'pinia'
import {CountryCodeType} from '@/types/CountryCodeType'
import {StrHelper} from '@/helpers/StrHelper'
import {useWpClientsStore} from "@/services/stores/WpClientStore";
import AuthService from '@/services/AuthService'
import {useSettingsStore} from "@/services/stores/SettingsStore";

const placesAutocomplete: Ref<Array<AutoCompleteType>> = ref([])
const {places, findByName} = usePlacesStore()
const {clients, findById, updateClient} = useClientsStore()
const clientsPhone: Ref<Array<AutoCompleteType>> = ref([])
let start_loc: LocationType
const service: Ref<Partial<Service>> = ref(new Service())
const {setLoading} = useLoadingState()
const {countryCodes} = storeToRefs(useClientsStore())
const countryCode: Ref<CountryCodeType> = ref(countryCodes.value[0])
const count: Ref<number> = ref(1)
const {clients: wpClients, defaultClient} = storeToRefs(useWpClientsStore())
const {branchSelected} = useSettingsStore()

watch(clients, (newClients) => {
  updateAutocompleteClients(newClients)
})

watch(places, (newPlaces) => {
  updateAutocompletePlaces(newPlaces)
})

watch(() => service.value.name, (name) => {
  service.value.name = StrHelper.toCamelCase(name?? '')
})

onMounted(async () => {
  countryCode.value = countryCodes.value.filter(code => code.dialCode === branchSelected?.calling_code)[0]
  const input = document.querySelector('input[name="phone"]') as HTMLInputElement
  input?.focus()
  updateAutocompletePlaces(places)
  updateAutocompleteClients(clients)
})

function updateAutocompletePlaces(from: Array<PlaceInterface>): void {
  placesAutocomplete.value = []
  from.forEach(place => {
    placesAutocomplete.value.push({
      id: place.key?? '0',
      value: place.name
    })
  })
}

function updateAutocompleteClients(from: Array<ClientInterface>): void {
  clientsPhone.value = []
  from.forEach(clientDB => {
    clientsPhone.value.push({
      id: clientDB.id,
      value: clientDB.phone
    })
  })
}

const schema = yup.object().shape({
  wp_client_id: yup.string().required().min(9),
  name: yup.string().required().min(3),
  phone: yup.string().required().min(9).max(10),
  start_address: yup.string().required(),
  comment: yup.string().nullable()
})

function submitFromEnter(event: Event) {
  const input = document.querySelector('input[name="comment"]') as HTMLInputElement
  if(input !== document.activeElement) event.preventDefault()
}

async function onSubmit(values: ServiceInterface, event: FormActions<any>): Promise<void> {
  if (!start_loc) {
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), i18n.global.t('services.messages.no_start_loc'))
    return
  }
  if (!values.client_id || findById(values.client_id).name !== values.name) {
    setLoading(true)
    await createClient({
      id: '',
      name: values.name,
      phone: values.phone
    }).then((client) => {
      setLoading(false)
      ToastService.toast(ToastService.SUCCESS, i18n.global.t('services.messages.new_client'))
      values.client_id = client.id
      if (!findById(values.client_id)) {
        clientsPhone.value.push({
          id: client.id,
          value: client.phone
        })
      } else {
        updateClient(client)
      }
    }).catch(e => {
      setLoading(false)
      ToastService.toast(ToastService.ERROR,  i18n.global.t('common.messages.error'), e.message)
    })
  }

  createService(values)
  event.resetForm()
}

function createService(values: ServiceInterface): void {
  setLoading(true)
  if (values.created_by === undefined) {
    values.created_by = AuthService.getCurrentUser()?.id ?? null;
  }
  const newService: Service = new Service()
  start_loc.country = branchSelected!.id
  start_loc.city = branchSelected!.city.id
  newService.comment = values.comment ?? null
  newService.client_id = values.client_id
  newService.name = values.name
  newService.phone = values.phone
  newService.start_loc = start_loc
  newService.wp_client_id = values.wp_client_id
  newService.created_by = values.created_by
  ServiceRepository.create(newService, count.value).then(() => {
    setLoading(false)
    count.value = 1
    countryCode.value = countryCodes.value[31]
    service.value.wp_client_id = defaultClient.value as string
    ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.created'))
  }).catch(e => {
    setLoading(false)
    ToastService.toast(ToastService.ERROR,  i18n.global.t('common.messages.error'), e.message)
  })
}

function onClientSelected(element: AutoCompleteType): void {
  let client = findById(element.id)
  service.value.phone = client.phone
  service.value.name = client.name
  service.value.client_id = client.id
  const input = document.querySelector('input[name="start_address"]') as HTMLInputElement
  input?.focus()
}

function createClient(client: ClientInterface): Promise<ClientInterface> {
  client.id = countryCode.value.dialCode.replace(/\D/g, "").concat(client.phone).concat('@c.us')
  return ClientRepository.create(client)
}

function checkPhoneNoExists(phone: string) {
  if (phone.length > 3) {
    const phoneExists = clientsPhone.value.some(client => client.value.includes(phone))
    if (!phoneExists) {
      service.value.name = i18n.global.t('common.models.users')
    }
  }
}

function locSelected(element: AutoCompleteType): void {
  let place = findByName(element.value)
  start_loc = {
    name: place.name, lat: place.lat, lng: place.lng, country: branchSelected!.country, city: branchSelected!.city.id
  }
  const input = document.querySelector('input[name="comment"]') as HTMLInputElement
  input?.focus()
}
</script>
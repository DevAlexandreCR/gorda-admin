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
              <AutoComplete :fieldName="'phone'" :idField="service.id" @selected="onClientSelected" @on-change="checkPhoneNoExists"
                            :elements="clientsPhone" :search-handler="searchClientsAutocomplete"
                            v-model="service.phone" :placeholder="$t('common.placeholders.phone')" :normalizer="StrHelper.formatNumber"
                            :debounceMs="150" :disabled="!clientsAutocompleteReady"/>
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
              <AutoComplete :idField="service.id + 1" :fieldName="'start_address'" @selected="locSelected" @on-change="onStartAddressChange" :elements="placesAutocomplete"
                            :search-handler="searchPlacesAutocomplete"
                            :placeholder="$t('common.placeholders.address')" :disabled="!placesAutocompleteReady"/>
            </div>
          </div>
          <div class="col-12 col-md px-1">
            <div class="form-group">
              <AutoComplete :idField="service.id + 2" :fieldName="'end_address'" @selected="endLocSelected" @on-change="onEndAddressChange" :elements="placesAutocomplete"
                            :search-handler="searchPlacesAutocomplete"
                            :placeholder="$t('services.placeholders.end_address_optional')" :disabled="!placesAutocompleteReady"/>
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
import { Field, Form, FormActions, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import Service from '@/models/Service'
import AutoComplete from '@/components/AutoComplete.vue'
import { AutoCompleteType } from '@/types/AutoCompleteType'
import ClientRepository from '@/repositories/ClientRepository'
import { LocationType } from '@/types/LocationType'
import { ServiceInterface } from '@/types/ServiceInterface'
import { computed, onMounted, ref, Ref, watch } from 'vue'
import ServiceRepository from '@/repositories/ServiceRepository'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import { ClientInterface } from '@/types/ClientInterface'
import { usePlacesStore } from '@/services/stores/PlacesStore'
import { useClientsStore } from '@/services/stores/ClientsStore'
import { useLoadingState } from '@/services/stores/LoadingState'
import { storeToRefs } from 'pinia'
import { CountryCodeType } from '@/types/CountryCodeType'
import { StrHelper } from '@/helpers/StrHelper'
import { useWpClientsStore } from "@/services/stores/WpClientStore";
import AuthService from '@/services/AuthService'
import { useSettingsStore } from "@/services/stores/SettingsStore";

const placesAutocomplete: Ref<Array<AutoCompleteType>> = ref([])
const clientsPhone: Ref<Array<AutoCompleteType>> = ref([])
const placesStore = usePlacesStore()
const clientsStore = useClientsStore()
const settingsStore = useSettingsStore()
let start_loc: LocationType | null = null
let end_loc: LocationType | null = null
const service: Ref<Partial<Service>> = ref(new Service())
const { setLoading } = useLoadingState()
const {
  countryCodes,
  isReady: clientsReady,
} = storeToRefs(clientsStore)
const {
  isReady: placesReady,
} = storeToRefs(placesStore)
const countryCode: Ref<CountryCodeType> = ref(countryCodes.value[0])
const count: Ref<number> = ref(1)
const { clients: wpClients, defaultClient } = storeToRefs(useWpClientsStore())
const { branchSelected } = storeToRefs(settingsStore)

watch(() => service.value.name, (name) => {
  service.value.name = StrHelper.toCamelCase(name ?? '')
})

const schema = yup.object().shape({
  wp_client_id: yup.string().required().min(9),
  name: yup.string().required().min(3),
  phone: yup.string().required().min(9).max(10),
  start_address: yup.string().required(),
  comment: yup.string().nullable(),
})

const fallbackCountryCode = computed(() => countryCodes.value[31] ?? countryCodes.value[0])
const clientsAutocompleteReady = computed(() => clientsReady.value || clientsStore.clients.length > 0)
const placesAutocompleteReady = computed(() => placesReady.value || placesStore.places.length > 0)

onMounted(() => {
  countryCode.value = countryCodes.value.find((code) => code.dialCode === branchSelected.value?.calling_code) ?? fallbackCountryCode.value
  const input = document.querySelector('input[name="phone"]') as HTMLInputElement
  input?.focus()
})

function submitFromEnter(event: Event) {
  const input = document.querySelector('input[name="comment"]') as HTMLInputElement
  if (input !== document.activeElement) event.preventDefault()
}

async function onSubmit(values: ServiceInterface, event: FormActions<any>): Promise<void> {
  if (!start_loc) {
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), i18n.global.t('services.messages.no_start_loc'))
    return
  }

  const currentClient = values.client_id ? await clientsStore.findById(values.client_id) : null
  if (!values.client_id || currentClient?.name !== values.name) {
    setLoading(true)
    try {
      const client = await createClient({
        id: '',
        name: values.name,
        phone: values.phone,
      })
      values.client_id = client.id
      await clientsStore.updateClient(client)
      clientsPhone.value = [{ id: client.id, value: client.phone }, ...clientsPhone.value]
        .filter((candidate, index, collection) => collection.findIndex((item) => item.id === candidate.id) === index)
        .slice(0, 10)
      ToastService.toast(ToastService.SUCCESS, i18n.global.t('services.messages.new_client'))
    } catch (e: any) {
      ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
      setLoading(false)
      return
    }
    setLoading(false)
  }

  createService(values)
  event.resetForm()
}

function createService(values: ServiceInterface): void {
  setLoading(true)
  if (!start_loc || !branchSelected.value) {
    setLoading(false)
    return
  }
  if (values.created_by === undefined) {
    values.created_by = AuthService.getCurrentUser()?.id ?? null
  }
  const newService: Service = new Service()
  const startLocWithBranch: LocationType = {
    ...start_loc,
    country: branchSelected.value.id,
    city: branchSelected.value.city.id,
  }
  const endLocWithBranch: LocationType | null = end_loc ? {
    ...end_loc,
    country: branchSelected.value.id,
    city: branchSelected.value.city.id,
  } : null
  newService.comment = values.comment ?? null
  newService.client_id = values.client_id
  newService.name = values.name
  newService.phone = values.phone
  newService.start_loc = startLocWithBranch
  newService.end_loc = endLocWithBranch
  newService.wp_client_id = values.wp_client_id
  newService.created_by = values.created_by
  ServiceRepository.create(newService, count.value).then(() => {
    setLoading(false)
    count.value = 1
    countryCode.value = fallbackCountryCode.value
    service.value.wp_client_id = defaultClient.value as string
    start_loc = null
    end_loc = null
    ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.created'))
  }).catch((e) => {
    setLoading(false)
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function onClientSelected(element: AutoCompleteType): void {
  clientsStore.findById(element.id).then((client) => {
    if (!client) return
    service.value.phone = client.phone
    service.value.name = client.name
    service.value.client_id = client.id
  })
  const input = document.querySelector('input[name="start_address"]') as HTMLInputElement
  input?.focus()
}

function createClient(client: ClientInterface): Promise<ClientInterface> {
  const identifiers = buildClientIdentifiers(client.phone)
  client.phone = identifiers.phone
  client.id = identifiers.id
  return ClientRepository.create(client)
}

async function checkPhoneNoExists(phone: string): Promise<void> {
  if (!clientsAutocompleteReady.value || phone.length <= 3) {
    return
  }

  const matchingClients = await clientsStore.searchClients(phone, 10)
  const normalizedPhone = sanitizeDigits(phone)
  const phoneExists = matchingClients.some((client) => sanitizeDigits(client.phone).includes(normalizedPhone))
  if (!phoneExists) {
    service.value.name = i18n.global.t('common.models.users')
  }
}

async function locSelected(element: AutoCompleteType): Promise<void> {
  const place = await placesStore.findByName(element.value)
  if (!place || !branchSelected.value) return
  start_loc = {
    name: place.name,
    lat: place.lat,
    lng: place.lng,
    country: branchSelected.value.country,
    city: branchSelected.value.city.id,
  }
  const endAddressInput = document.querySelector('input[name="end_address"]') as HTMLInputElement
  if (endAddressInput) {
    endAddressInput.focus()
    return
  }
  const input = document.querySelector('input[name="comment"]') as HTMLInputElement
  input?.focus()
}

function onStartAddressChange(): void {
  start_loc = null
}

async function endLocSelected(element: AutoCompleteType): Promise<void> {
  const place = await placesStore.findByName(element.value)
  if (!place || !branchSelected.value) return
  end_loc = {
    name: place.name,
    lat: place.lat,
    lng: place.lng,
    country: branchSelected.value.country,
    city: branchSelected.value.city.id,
  }
  const input = document.querySelector('input[name="comment"]') as HTMLInputElement
  input?.focus()
}

function onEndAddressChange(): void {
  end_loc = null
}

function buildClientIdentifiers(phone: string): { phone: string, id: string } {
  const dialDigits = sanitizeDigits(countryCode.value?.dialCode ?? '')
  const expectedLength = countryCode.value?.dialCode?.includes('+56') ? 9 : 10
  let digitsOnlyPhone = sanitizeDigits(phone)
  let localNumber = digitsOnlyPhone

  if (dialDigits && localNumber.startsWith(dialDigits) && localNumber.length > expectedLength) {
    localNumber = localNumber.substring(dialDigits.length)
  }

  if (localNumber.length > expectedLength) {
    localNumber = localNumber.slice(-expectedLength)
  }

  const normalizedPhone = dialDigits.concat(localNumber) || localNumber

  return {
    phone: normalizedPhone,
    id: normalizedPhone,
  }
}

function sanitizeDigits(value: string): string {
  return value.replace(/[^\d]/g, '')
}

async function searchClientsAutocomplete(term: string): Promise<Array<AutoCompleteType>> {
  const results = await clientsStore.searchClients(term, 10)
  const mapped = results.map((client) => ({
    id: client.id,
    value: client.phone,
  }))
  clientsPhone.value = mapped
  return mapped
}

async function searchPlacesAutocomplete(term: string): Promise<Array<AutoCompleteType>> {
  const placesResult = await placesStore.searchPlaces(term, 10)
  const mapped = placesResult.map((place) => ({
    id: place.key ?? place.id,
    value: place.name,
  }))
  placesAutocomplete.value = mapped
  return mapped
}
</script>

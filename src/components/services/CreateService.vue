<template>
  <div class="my-2">
    <div class="row" v-for="(service, key) in services" :key="key + service.id" :id="'row-' + key">
      <Form @submit="onSubmit" :validation-schema="schema" autocomplete="off" @keydown.enter="submitFromEnter">
        <div class="row">
          <div class="col-12 col-md">
            <div class="form-group">
              <AutoComplete :fieldName="'phone'" :idField="service.id" @selected="onClientSelected" :elements="clientsPhone" :key="service.id +1"
                            v-model="service.phone" :placeholder="$t('common.placeholders.phone')"/>
              <Field name="client_id" type="hidden" v-slot="{ field }" v-model="service.client_id">
                <input type="hidden" v-model="service.client_id" name="client_id" v-bind="field">
              </Field>
            </div>
          </div>
          <div class="col-12 col-md">
            <div class="form-group">
              <Field name="name" type="text" v-slot="{ field, errorMessage, meta }" v-model="service.name">
                <input class="form-control" v-model="field.value" :placeholder="$t('common.placeholders.name')"
                       v-bind="field" autocomplete="off"/>
                <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
              </Field>
            </div>
          </div>
          <div class="col-12 col-md">
            <div class="form-group">
              <AutoComplete :idField="service.id" :fieldName="'start_address'" @selected="locSelected" :elements="placesAutocomplete" :key="service.id + 2"
                            :placeholder="$t('common.placeholders.address')"/>
            </div>
          </div>
          <div class="col-12 col-md">
            <div class="form-group">
              <Field name="comment" type="text" v-slot="{ field, errorMessage }" v-model="service.comment">
                <input class="form-control" v-model="field.value" :placeholder="$t('common.placeholders.comment')"
                       v-bind="field" autocomplete="none"/>
                <span class="is-invalid" v-if="errorMessage">{{ errorMessage }}</span>
              </Field>
            </div>
          </div>
          <div class="col-12 col-md">
            <button class="btn btn-primary" type="submit">{{ $t('common.actions.create') }}</button>
            <button class="btn btn-info ms-2" type="button" @click="add()" v-show="false"><em class="fas fa-plus"></em></button>
            <button v-if="key > 0" class="btn btn-danger ms-2" :id="'button-' + key" type="button" @click="remove(key)">
              <em class="fas fa-trash"></em></button>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Field, Form, FormActions} from 'vee-validate'
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
const placesAutocomplete: Ref<Array<AutoCompleteType>> = ref([])
const {places, findByName} = usePlacesStore()
const {clients, findById} = useClientsStore()
const clientsPhone: Ref<Array<AutoCompleteType>> = ref([])
let start_loc: LocationType
const services: Ref<Array<Partial<Service>>> = ref([new Service()])

watch(clients, (newClients) => {
  updateAutocompleteClients(newClients)
})

watch(places, (newPlaces) => {
  updateAutocompletePlaces(newPlaces)
})

onMounted(async () => {
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
  name: yup.string().required().min(3),
  phone: yup.string().required().min(8),
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
  if (!values.client_id) {
    await createClient({
      id: '',
      name: values.name,
      phone: values.phone
    }).then((client) => {
      ToastService.toast(ToastService.SUCCESS, i18n.global.t('services.messages.new_client'))
      values.client_id = client.id
      clientsPhone.value.push({
        id: client.id,
        value: client.phone
      })
    }).catch(e => {
      ToastService.toast(ToastService.ERROR,  i18n.global.t('common.messages.error'), e.message)
    })
  }
  createService(values)
  event.resetForm()
}

function createService(values: ServiceInterface): void {
  const service: Service = new Service()
  service.comment = values.comment ?? null
  service.client_id = values.client_id
  service.name = values.name
  service.phone = values.phone
  service.start_loc = start_loc
  const index = services.value.findIndex(s => s.client_id = values.client_id)
  ServiceRepository.create(service).then(() => {
    services.value.splice(index, 1, new Service)
    ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.created'))
  }).catch(e => {
    ToastService.toast(ToastService.ERROR,  i18n.global.t('common.messages.error'), e.message)
  })
}

function onClientSelected(element: AutoCompleteType, id: string): void {
  let client = findById(element.id)
  let serviceIndex = services.value.findIndex(service => service.id == id)
  services.value[serviceIndex].phone = client.phone
  services.value[serviceIndex].name = client.name
  services.value[serviceIndex].client_id = client.id
  const input = document.querySelector('input[name="start_address"]') as HTMLInputElement
  input?.focus()
}

function createClient(client: ClientInterface): Promise<ClientInterface> {
  return ClientRepository.create(client)
}

function add(): void {
  if (services.value.length < 5) {
    services.value.push(new Service())
  }
}

function remove(key: number): void {
  services.value.splice(key, 1)
}

function locSelected(element: AutoCompleteType): void {
  let place = findByName(element.value)
  start_loc = { name: place.name, lat: place.lat, lng: place.lng}
  const input = document.querySelector('input[name="comment"]') as HTMLInputElement
  input?.focus()
}
</script>
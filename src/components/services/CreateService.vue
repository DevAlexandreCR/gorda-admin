<template>
  <div class="my-2">
    <div class="row" v-for="(service, key) in services" :key="key" :id="'row-' + key">
      <Form @submit="createService" :validation-schema="schema" autocomplete="off">
        <div class="row">
          <div class="col-12 col-md">
            <div class="form-group">
              <AutoComplete :fieldName="'phone'" @selected="onClientSelected" :elements="clientsPhone"
                            v-model="service.phone" :placeholder="$t('common.placeholders.phone')"/>
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
              <AutoComplete :fieldName="'start_address'" @selected="locSelected" :elements="neighborhoods"
                            :placeholder="$t('common.placeholders.address')"/>
            </div>
          </div>
          <div class="col-12 col-md">
            <div class="form-group">
              <Field name="comment" type="text" v-slot="{ field, errorMessage }" v-model="service.comment">
                <input class="form-control" v-model="field.value" :placeholder="$t('common.placeholders.comment')"
                       v-bind="field" autocomplete="none"/>
                <span class="is-invalid" v-if="errorMessage && field.value.length > 0">{{ errorMessage }}</span>
              </Field>
            </div>
          </div>
          <div class="col-12 col-md">
            <button class="btn btn-primary" type="submit">{{ $t('common.actions.create') }}</button>
            <button class="btn btn-info ms-2" type="button" @click="add()"><em class="fas fa-plus"></em></button>
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
import ServiceRepository from '@/repositories/ServiceRepository'
import ToastService from '@/services/ToastService'
import locations from '../../../src/assets/location/neighborhoods.json'
import AutoComplete from '@/components/AutoComplete.vue'
import {AutoCompleteType} from '@/types/AutoCompleteType'
import ClientRepository from '@/repositories/ClientRepository'
import {LocationType} from '@/types/LocationType'
import Client from '@/models/Client'
import {ServiceInterface} from '@/types/ServiceInterface'
import {onMounted, ref, Ref} from 'vue'
import i18n from '@/plugins/i18n'

const neighborhoods: Ref<Array<AutoCompleteType>> = ref([])
const clients: Array<Client> = []
const clientsPhone: Ref<Array<AutoCompleteType>> = ref([])
const client: Client = new Client
let start_loc: LocationType
const services: Ref<Array<Partial<Service>>> = ref([new Service()])

onMounted(() => {
  locations.forEach(loc => {
    neighborhoods.value.push({
      id: '0',
      value: loc.name
    })
  })

  ClientRepository.getAll().then(clientsDB => {
    clientsDB.forEach(clientDB => {
      clientsPhone.value.push({
        id: clientDB.id,
        value: clientDB.phone
      })

      const clientTmp = new Client()
      Object.assign(clientTmp, clientDB)
      clients.push(clientTmp)
    })
  })
})

const schema = yup.object().shape({
  name: yup.string().required().min(3),
  phone: yup.string().required().min(8),
  start_address: yup.string().required(),
  comment: yup.string().min(5)
})

function createService(values: ServiceInterface, event: FormActions<any>): void {
  event.resetForm()
  const service: Service = new Service()
  service.comment = values.comment ?? null
  service.client_id = client.value.id
  service.name = values.name
  service.phone = values.phone
  service.start_loc = start_loc ?? {
    name: values.start_address
  }
  ServiceRepository.create(service).then(() => {
    ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.created'))
  }).catch(e => {
    ToastService.toast(ToastService.ERROR,  i18n.global.t('common.messages.error'), e.message)
  })
}

function onClientSelected(element: AutoCompleteType): void {
  client = clients.find(client => client.id === element.id) ?? new Client
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
  let neighbor = locations.find(el => el.name == element.value)
  start_loc = {
    name: neighbor?.name ?? '',
    lat: neighbor?.location.lat,
    long: neighbor?.location.lng
  }
}
</script>
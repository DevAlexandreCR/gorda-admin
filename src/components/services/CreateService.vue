<template>
  <div class="my-2">
    <div class="row" v-for="(service, key) in services" :key="key" :id="'row-' + key">
      <Form @submit="createService" :validation-schema="schema">
        <div class="row">
          <div class="col-12 col-md">
            <div class="form-group">
              <div class="input-group">
                <AutoComplete :fieldName="'phone'" @selected="onClientSelected" :elements="clientsPhone" v-model="service.phone" :placeholder="$t('common.placeholders.phone')"/>
              </div>
            </div>
            <ErrorMessage name="phone"/>
          </div>
          <div class="col-12 col-md">
            <div class="form-group">
              <Field type="text" class="form-control" :placeholder="$t('common.placeholders.name')" name="name" v-model="client.name"/>
            </div>
            <ErrorMessage name="name"/>
          </div>
          <div class="col-12 col-md">
            <div class="form-group">
              <AutoComplete :fieldName="'start_address'" @selected="locSelected" :elements="neighborhoods" :placeholder="$t('common.placeholders.address')"/>
            </div>
            <ErrorMessage name="start_address"/>
          </div>
          <div class="col-12 col-md">
            <div class="form-group">
              <div class="input-group">
                <Field type="text" class="form-control" :placeholder="$t('common.placeholders.comment')" name="comment" v-model="service.comment"/>
              </div>
            </div>
            <ErrorMessage name="comment"/>
          </div>
          <div class="col-12 col-md">
            <button class="btn btn-primary" type="submit">{{ $t('common.actions.create') }}</button>
            <button class="btn btn-info ms-2" type="button" @click="add()"><em class="fas fa-plus"></em></button>
            <button v-if="key > 0" class="btn btn-danger ms-2" :id="'button-' + key" type="button" @click="remove(key)"><em class="fas fa-trash"></em></button>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Options} from 'vue-class-component'
import {ErrorMessage, Field, Form, FormActions} from 'vee-validate'
import {ServiceInterface} from '@/types/ServiceInterface'
import * as yup from 'yup'
import Service from '@/models/Service'
import ServiceRepository from '@/repositories/ServiceRepository'
import ToastService from "@/services/ToastService";
import locations from '../../../src/assets/location/neighborhoods.json'
import AutoComplete from '@/components/AutoComplete.vue'
import {AutoCompleteType} from '@/types/AutoCompleteType'
import ClientRepository from '@/repositories/ClientRepository'
import AssignDriver from '@/components/services/AssingDriver.vue'
import LocationType from '@/types/LocationType'
import Client from '@/models/Client'



@Options({
  components: {
    Form,
    Field,
    ErrorMessage,
    AutoComplete,
    AssignDriver
  },
})

export default class CreateService extends Vue {

  neighborhoods: Array<AutoCompleteType> = []
  clients: Array<Client> = []
  clientsPhone: Array<AutoCompleteType> = []
  client: Client = new Client
  start_loc: LocationType
  services: Array<Partial<Service>> = [new Service()]

  mounted(): void {
    locations.forEach(loc => {
      this.neighborhoods.push({
        id: '0',
        value: loc.name
      })
    })
    
    ClientRepository.getAll().then(clients => {
      clients.forEach(client => {
      this.clientsPhone.push( {
        id: client.id,
        value: client.phone
      })

      const clientTmp = new Client()
      Object.assign(clientTmp, client)
      this.clients.push(clientTmp)
      })
    })
  }
 
  readonly schema = yup.object().shape({
    name: yup.string().min(3),
    phone: yup.string().required().min(8),
    start_address: yup.string().required(),
    comment: yup.string().min(5)
  })

  createService(values: ServiceInterface, event: FormActions<any>): void {
    event.resetForm()
    const service: Service = new Service()
    service.comment = values.comment ?? null
    service.client_id = this.client.id
    service.name = values.name
    service.phone = values.phone
    service.start_loc = this.start_loc?? {
      name: values.start_address
    }
    ServiceRepository.create(service).then(() => {
      ToastService.toast(ToastService.SUCCESS, this.$t('common.messages.created'))
    }).catch(e => {
      ToastService.toast(ToastService.ERROR, this.$t('common.messages.error'), e.message)
    })
  }

  onClientSelected(element: AutoCompleteType): void {
    this.client = this.clients.find(client => client.id === element.id) ?? new Client
  }

  add(): void {
    if (this.services.length < 5) {
      this.services.push(new Service())
    }
  }

  remove(key: number): void {
    this.services.splice(key, 1)
  }

  locSelected(element: AutoCompleteType): void {
    let neighbor = locations.find(el => el.name == element.value)
    this.start_loc = {
      name: neighbor?.name ?? '',
      lat: neighbor?.location.lat,
      long: neighbor?.location.lng
    }
  }
}
</script>
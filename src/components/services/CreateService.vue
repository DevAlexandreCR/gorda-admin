<template>
  <div class="row" v-for="(service, key) in services" :key="key" :id="'row-' + key">
    <Form @submit="createService" :validation-schema="schema">
      <div class="row">
        <div class="col col-sm">
          <div class="form-group">
            <div class="input-group">
              <Field type="phone" class="form-control" :placeholder="$t('common.placeholders.phone')" name="phone" v-model="service.phone"/>
              <ErrorMessage name="phone"/>
            </div>
          </div>
        </div>
        <div class="col col-sm">
          <div class="form-group">
            <div class="input-group">
              <Field type="text" class="form-control" :placeholder="$t('common.placeholders.name')" name="name" v-model="service.name"/>
              <ErrorMessage name="name"/>
            </div>
          </div>
        </div>
        <div class="col col-sm">
          <div class="form-group">
            <div class="input-group">
              <AutoComplete :fieldName="'start_address'" :elements="neighborhoods" v-model="service.start_address"/>
              <ErrorMessage name="start_address"/>
            </div>
          </div>
        </div>
        <div class="col col-sm">
          <div class="form-group">
            <div class="input-group">
              <Field type="text" class="form-control" :placeholder="$t('common.placeholders.comment')" name="comment" v-model="service.comment"/>
              <ErrorMessage name="comment"/>
            </div>
          </div>
        </div>
        <div class="col col-sm">
          <button class="btn btn-primary" type="submit">{{ $t('common.actions.create') }}</button>
          <button class="btn btn-info ms-2" type="button" @click="add()"><em class="fas fa-plus"></em></button>
          <button v-if="key > 0" class="btn btn-danger ms-2" :id="'button-' + key" type="button" @click="remove(key)"><em class="fas fa-trash"></em></button>
        </div>
      </div>
    </Form>
  </div>
</template>

<script lang="ts">
import {Vue, Options} from 'vue-class-component'
import {ErrorMessage, Field, Form, FormActions} from 'vee-validate'
import {ServiceInterface} from '@/entities/ServiceInterface'
import * as yup from 'yup'
import Service from '@/models/Service'
import ServiceRepository from '@/repositories/ServiceRepository'
import dayjs from 'dayjs'
import ToastService from "@/services/ToastService";
import locations from '../../../src/assets/location/neighborhoods.json';
import AutoComplete from '@/components/AutoComplete.vue'


@Options({
  components: {
    Form,
    Field,
    ErrorMessage,
    AutoComplete
  },
})


export default class CreateService extends Vue {

  neighborhoods: Array<any> = []
  

  mounted(): void {
    locations.forEach(loc => {
      this.neighborhoods.push(loc.name)
    })
  }

  services: Array<Partial<Service>> = [new Service()]
  readonly schema = yup.object().shape({
    name: yup.string().min(3),
    phone: yup.string().required().min(8),
    start_address: yup.string().required(),
    comment: yup.string().min(5)
  })

  createService(values: ServiceInterface, event: FormActions<any>): void {
    event.resetForm()
    values.created_at = dayjs().unix()
    values.status = Service.STATUS_PENDING
    values.comment = values.comment ?? null
    ServiceRepository.create(values).then(() => {
      ToastService.toast(ToastService.SUCCESS, this.$t('common.messages.created'))
    }).catch(e => {
      ToastService.toast(ToastService.ERROR, this.$t('common.messages.error'), e.message)
    })
  }

  add(): void {
    if (this.services.length < 5) {
      this.services.push(new Service())
    }
  }

  remove(key: number): void {
    this.services.splice(key, 1)
  }
}
</script>
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
              <Field type="address" class="form-control" :placeholder="$t('common.placeholders.address')" name="address" v-model="service.start_address"/>
              <ErrorMessage name="address"/>
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
import {ErrorMessage, Field, Form} from 'vee-validate'
import {ServiceInterface} from '@/entities/ServiceInterface'
import dayjs from 'dayjs'
import * as yup from 'yup'
import ServiceRepository from '@/repositories/ServiceRepository'
import Swal from 'sweetalert2'
import {Constants} from '@/constants/Constants'

@Options({
  components: {
    Form,
    Field,
    ErrorMessage
  },
})

export default class CreateService extends Vue {
  services: Array<Partial<ServiceInterface>> = [{ created_at: dayjs(new Date()).format() }]
  readonly schema = yup.object().shape({
    name: yup.string().min(3),
    phone: yup.string().required().min(8),
    address: yup.string().required(),
    comment: yup.string().min(5)
  })

  createService(values: ServiceInterface): void {
    values.status = Constants.SERVICE_STATUS_PENDING
    ServiceRepository.create(values).then(() => {
      Swal.fire({
        icon: 'success',
        title: this.$t('common.messages.created'),
        showConfirmButton: false,
        timer: 1500
      })
    }).catch(e => {
      Swal.fire({
        icon: 'error',
        title: this.$t('common.messages.error'),
        text: e.message,
      })
    })
  }

  add(): void {
    if (this.services.length < 5) {
      this.services.push({created_at: dayjs(new Date()).format()})
    }
  }

  remove(key: number): void {
    this.services.splice(key, 1)
  }
}
</script>
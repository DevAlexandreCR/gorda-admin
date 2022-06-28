<template>
  <div class="container-fluid pb-4">
    <Form @submit="updateDriver" :validation-schema="schema">
      <div class="card w-75 mx-auto">
        <div class="card-header text-center text-capitalize">
          <h6>{{ $t('drivers.forms.create') }}</h6>
        </div>
        <div class="card-body pt-2">
          <div class="row">
            <div class="col-md-6">
              <div class="card-header text-center text-capitalize">
                <h6>{{ $t('drivers.forms.create_driver') }}</h6>
              </div>
              <img :src="this.driver.photoUrl" class="card-img-top img-driver" alt="profile_photo">
              <button class="btn btn-sm btn-outline-white btn-edit-img" type="button" data-bs-toggle="modal"
                      data-bs-target="#image-driver">
                <span class="btn-inner--icon"><em class="fas fa-pen"></em></span>
              </button>
              <div class="form-group">
                <label>{{ $t('users.fields.name') }}</label>
                <Field name="name" type="text" v-slot="{ field, errorMessage, meta }" v-model="driver.name">
                  <input class="form-control" id="name" aria-label="Name" aria-describedby="name-addon"
                         v-model="field.value" :placeholder="$t('common.placeholders.name')" v-bind="field"/>
                  <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                </Field>
              </div>
              <div class="form-group">
                <label>{{ $t('users.fields.email') }}</label>
                <Field name="email" type="email" v-slot="{ field, errorMessage,meta }" v-model="driver.email">
                  <input class="form-control" id="email" aria-label="Email" aria-describedby="email-addon"
                         v-model="field.value" :placeholder="$t('common.placeholders.email')" v-bind="field"/>
                  <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                </Field>
              </div>
              <div class="form-group">
                <label>{{ $t('users.fields.phone') }}</label>
                <Field name="phone" type="phone" v-slot="{ field, errorMessage, meta }" v-model="driver.phone">
                  <input class="form-control" id="phone" aria-label="Phone" aria-describedby="phone-addon"
                         v-model="field.value" :placeholder="$t('common.placeholders.phone')" v-bind="field"/>
                  <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                </Field>
              </div>
              <div class="form-group">
                <div class="row">
                  <div class="col-sm-3">
                    <label>{{ $t('drivers.fields.doc_type') }}</label>
                    <Field name="docType" class="form-select" id="doc_type" as="select" v-model="driver.docType">
                      <option v-for="(type, key) in types" :key="key" :value="type" selected>{{ type }}</option>
                    </Field>
                  </div>
                  <div class="col-sm-9">
                    <label>{{ $t('drivers.fields.document') }}</label>
                    <Field name="document" type="text" v-slot="{ field, errorMessage, meta }" v-model="driver.document">
                      <input class="form-control" id="document" aria-label="Document" aria-describedby="doc-addon"
                             v-model="field.value" :placeholder="$t('drivers.placeholders.document')" v-bind="field"/>
                      <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                    </Field>
                  </div>
                </div>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" name="enable" type="checkbox" :checked="driver.isEnabled()"
                       id="flexSwitchCheckDefault" @change="onEnable"/>
                <label class="form-check-label">{{
                    $t(driver.enabled_at ? 'common.fields.enabled' : 'common.fields.disabled')
                  }}</label>
                <ErrorMessage name="enable"/>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card-header text-center text-capitalize">
                <h6>{{ $t('drivers.forms.create_vehicle') }}</h6>
              </div>
              <img :src="this.driver.vehicle.photoUrl" class="card-img-top img-driver" alt="profile_photo">
              <button class="btn btn-sm btn-outline-white btn-edit-img" type="button" data-bs-toggle="modal"
                      data-bs-target="#image-vehicle">
                <span class="btn-inner--icon"><em class="fas fa-pen"></em></span>
              </button>
              <div class="form-group">
                <label>{{ $t('drivers.vehicle.brand') }}</label>
                <Field name="brand" type="text" v-slot="{ field, errorMessage, meta}" v-model="driver.vehicle.brand">
                  <input class="form-control" id="brand" aria-label="Brand" aria-describedby="brand-addon"
                         v-model="field.value" :placeholder="$t('drivers.placeholders.brand')" v-bind="field"/>
                  <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                </Field>
              </div>
              <div class="form-group">
                <label>{{ $t('drivers.vehicle.model') }}</label>
                <Field name="model" type="text" v-slot="{ field, errorMessage, meta}" v-model="driver.vehicle.model">
                  <input class="form-control" id="model" aria-label="Model" aria-describedby="model-addon"
                         v-model="field.value" :placeholder="$t('drivers.placeholders.model')" v-bind="field"/>
                  <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                </Field>
              </div>
              <div class="form-group">
                <label>{{ $t('drivers.vehicle.plate') }}</label>
                <Field name="plate" type="text" v-slot="{ field, errorMessage, meta}" v-model="driver.vehicle.plate">
                  <input class="form-control" id="plate" aria-label="Plate" aria-describedby="plate-addon"
                         v-model="field.value" :placeholder="$t('drivers.placeholders.plate')" v-bind="field"/>
                  <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                </Field>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <div class="card-footer text-end">
          <button class="btn btn-info" type="submit">{{ $t('common.actions.submit') }}</button>
        </div>
      </div>
    </Form>
    <ImageLoader :id="'image-vehicle'" :resourceId="driver.id" :path="pathVehicle" :event="vehicleEvent"
                 @imageVehicleLoaded="uploadImgVehicle"></ImageLoader>
    <ImageLoader :id="'image-driver'" :resourceId="driver.id" :path="pathDriver" :event="driverEvent"
                 @imageDriverLoaded="uploadImgDriver"></ImageLoader>
  </div>
</template>

<script setup lang="ts">
import StorageService from '@/services/StorageService'
import {ErrorMessage, Field, Form} from 'vee-validate'
import * as yup from 'yup'
import dayjs from 'dayjs'
import Driver from '@/models/Driver'
import DriverRepository from '@/repositories/DriverRepository'
import {Constants} from '@/constants/Constants'
import ToastService from '@/services/ToastService'
import ImageLoader from '@/components/ImageLoader.vue'
import i18n from '@/plugins/i18n'
import {onBeforeMount, ref, Ref} from 'vue'
import {useRoute} from 'vue-router'

const driver: Ref<Driver> = ref(new Driver)
const types: Ref<Array<string>> = ref(Constants.DOC_TYPES)
const driverEvent = 'image-driver-loaded'
const vehicleEvent = 'image-vehicle-loaded'
const pathDriver = StorageService.driverPath
const pathVehicle = StorageService.vehiclePath
const route = useRoute()
const schema = yup.object().shape({
  name: yup.string().required().min(3),
  email: yup.string().required().email(),
  phone: yup.string().required().min(8),
  docType: yup.mixed().oneOf(Constants.DOC_TYPES).required(),
  document: yup.string().required().min(6).max(10),
  brand: yup.string().required().min(3),
  plate: yup.string().required().min(3),
  model: yup.string().required().min(3)
})

onBeforeMount(() => {
  DriverRepository.getDriver(route.params.id as string).then(driverDB => {
    Object.assign(driver.value, driverDB)
  })
})

function uploadImgDriver(url: string): void {
  driver.value.photoUrl = url
  updateDriver()
}

function uploadImgVehicle(url: string): void {
  driver.value.vehicle.photoUrl = url
  updateDriver()
}

function updateDriver(): void {
  DriverRepository.update(driver.value).then(() => {
    ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.created'))
  }).catch(e => {
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function onEnable(event: Event): void {
  const target = event.target as HTMLInputElement
  driver.value.enabled_at = target.checked ? dayjs().unix() : 0
  DriverRepository.enable(driver.value.id?? '', driver.value.enabled_at).then(() => {
    const message = driver.value.enabled_at == 0 ?
        i18n.global.t('users.messages.disabled') : i18n.global.t('users.messages.enabled')
    ToastService.toast(ToastService.SUCCESS, message)
  }).catch(e => {
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}
</script>
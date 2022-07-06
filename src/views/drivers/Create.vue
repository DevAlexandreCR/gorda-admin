<template>
  <div class="container-fluid pb-4">
    <Form @submit="createDriver" :validation-schema="schema">
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
              <div class="form-group">
                <label class="form-label">{{ $t('drivers.placeholders.photo') }}</label>
                <Field name="photoUrl" class="form-control form-control-sm" type="file" accept="image/*" v-model="imageDriver">
                </Field>
              </div>
              <div class="form-group">
                <label>{{ $t('users.fields.name') }}</label>
                <Field name="name" type="text" v-model="driver.name" v-slot="{ field, errorMessage, meta }">
                  <input class="form-control form-control-sm" id="name" v-model="field.value" :placeholder="$t('common.placeholders.name')" aria-label="Name" aria-describedby="name-addon" v-bind="field"/>
                  <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
               </Field>
              </div>
              <div class="form-group">
                <label>{{ $t('users.fields.email') }}</label>
                <Field name="email" type="email" v-model="driver.email" v-slot="{ field, errorMessage, meta }" autocomplete="off">
                <input class="form-control form-control-sm" v-model="field.value" :placeholder="$t('common.placeholders.email')" id="email" aria-label="Email" aria-describedby="email-addon" v-bind="field"/>
                  <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                </Field>
              </div>
              <div class="form-group">
                <label>{{ $t('users.fields.password') }}</label>
                <Field name="password" type="password" v-slot="{ field, errorMessage, meta }" v-model="password">
                <input class="form-control form-control-sm" v-model="field.value" :placeholder="$t('users.fields.password')" id="password" aria-label="Password" aria-describedby="password-addon" v-bind="field"/>
                <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                </Field>
              </div> 
              <div class="form-group">
                <label>{{ $t('users.fields.phone') }}</label>
                <Field name="phone" type="phone"  v-model="driver.phone" v-slot="{ field, errorMessage, meta }">
                <input class="form-control form-control-sm" v-model="field.value" :placeholder="$t('common.placeholders.phone')" id="phone" aria-label="Phone" aria-describedby="phone-addon" v-bind="field"/>
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
                      <Field name="document" v-model="driver.document" v-slot="{ field, errorMessage, meta }">
                        <input class="form-control form-control-sm" id="document" v-model="field.value" :placeholder="$t('common.placeholders.comment')" aria-label="Document" aria-describedby="doc-addon" v-bind="field" autocomplete="none"/>
                        <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                    </Field>
                  </div>
                </div>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" name="enabled_at" type="checkbox" id="enableDriver" @change="onEnable"/>
                <label class="form-check-label">{{
                    $t(driver.enabled_at ? 'common.fields.enabled' : 'common.fields.disabled')
                  }}</label>
                <ErrorMessage name="enabled_at"/>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card-header text-center text-capitalize">
                <h6>{{ $t('drivers.forms.create_vehicle') }}</h6>
              </div>
              <div class="form-group">
                <label>{{ $t('drivers.vehicle.brand') }}</label>
                <Field name="brand" type="text"  v-model="driver.vehicle.brand" v-slot="{ field, errorMessage, meta }">
                 <input class="form-control form-control-sm" v-model="field.value" :placeholder="$t('drivers.placeholders.brand')" id="brand" aria-label="Brand" aria-describedby="brand-addon" v-bind="field" autocomplete="none"/>
                <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                 </Field>
              </div>
              <div class="form-group">
                <label>{{ $t('drivers.vehicle.model') }}</label>
                <Field name="model" type="text" class="form-control" v-model="driver.vehicle.model" v-slot="{ field, errorMessage, meta }">
                 <input class="form-control form-control-sm" v-model="field.value" :placeholder="$t('drivers.placeholders.model')" id="model" aria-label="Model" aria-describedby="model-addon" v-bind="field" autocomplete="none"/>
                <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                 </Field>
              </div>
              <div class="form-group">
                <label>{{ $t('drivers.vehicle.plate') }}</label>
                <Field name="plate" type="text" v-model="driver.vehicle.plate" v-slot="{ field, errorMessage, meta }">
               <input class="form-control form-control-sm" v-model="field.value" :placeholder="$t('drivers.placeholders.plate')" id="plate" aria-label="Plate" aria-describedby="plate-addon" v-bind="field" autocomplete="none"/>
                <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                 </Field>
              </div>
              <div class="form-group">
                <label class="form-label">{{ $t('drivers.placeholders.photo_vehicle') }}</label>
                <Field name="photoVehicleUrl" class="form-control form-control-sm" type="file" accept="image/*" v-model="imageVehicle">
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
  </div>
</template>

<script setup lang="ts">
import CustomValidator from '@/assets/validatiions/validators'
import StorageService from '@/services/StorageService'
import {ErrorMessage, Field, Form, FormActions} from 'vee-validate'
import * as yup from 'yup'
import {ObjectSchema} from 'yup'
import dayjs from 'dayjs'
import Driver from '@/models/Driver'
import DriverRepository from '@/repositories/DriverRepository'
import {Constants} from '@/constants/Constants'
import ToastService from '@/services/ToastService'
import {DriverInterface} from '@/types/DriverInterface'
import i18n from '@/plugins/i18n'
import {ref, Ref} from 'vue'

const driver: Ref<Driver> = ref(new Driver)
const password: Ref<string> = ref('')
const imageDriver: Ref<File[]> = ref([])
const imageVehicle: Ref<File[]> = ref([])
const types: Array<any> = Constants.DOC_TYPES
const schema: ObjectSchema<any> = yup.object().shape({
  name: yup.string().required().min(3),
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
  phone: yup.string().required().min(8),
  docType: yup.mixed().oneOf(Constants.DOC_TYPES).required(),
  document: yup.string().required().min(6).max(10),
  brand: yup.string().required().min(3),
  plate: yup.string().required().min(3),
  model: yup.string().required().min(3),
  photoUrl: CustomValidator.isImage(i18n.global.t('validations.image'), i18n.global.t('validations.size')).required(),
  photoVehicleUrl: CustomValidator.isImage(i18n.global.t('validations.image'), i18n.global.t('validations.size')).required()
})

function uploadImg(path: string, image: File): Promise<string> {
  const reference = StorageService.getStorageReference(path, driver.value.id ?? '', image.name)
  return StorageService.uploadFile(reference, image)
}

function createDriver(_values: DriverInterface, event: FormActions<any>): void {
    DriverRepository.create(driver.value, password.value).then((id) => {
      driver.value.id = id
      uploadImg(StorageService.driverPath, imageDriver.value[0]).then(url => {
        driver.value.photoUrl = url
        uploadImg(StorageService.vehiclePath, imageVehicle.value[0]).then(urlPhotoVehicle => {
          driver.value.vehicle.photoUrl = urlPhotoVehicle
          DriverRepository.update(driver.value)
          ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.created'))
          event.resetForm()
        })
      })
    }).catch(e => {
      ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
    })
}

function onEnable(e: Event): void {
  const target = e.target as HTMLInputElement
  driver.value.enabled_at = target.checked ? dayjs().unix() : 0
}
</script>
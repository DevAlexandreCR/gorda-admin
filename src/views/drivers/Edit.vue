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
                <button class="btn btn-sm btn-outline-white btn-edit-img" type="button" data-bs-toggle="modal" data-bs-target="#image-driver">
                  <span class="btn-inner--icon"><em class="fas fa-pen"></em></span>
                </button>
                <div class="form-group">
                  <label>{{ $t('users.fields.name') }}</label>
                  <Field name="name" type="text" class="form-control" :placeholder=" $t('common.placeholders.name')"
                         v-model="driver.name" id="name" aria-label="Name" aria-describedby="name-addon"/>
                  <ErrorMessage name="name"/>
                </div>
                <div class="form-group">
                  <label>{{ $t('users.fields.email') }}</label>
                  <Field name="email" type="email" class="form-control" id="email"
                         :placeholder="$t('common.placeholders.email')" v-model="driver.email" aria-label="Email"
                         aria-describedby="email-addon"/>
                  <ErrorMessage name="email"/>
                </div>
                <div class="form-group">
                  <label>{{ $t('users.fields.phone') }}</label>
                  <Field name="phone" type="phone" class="form-control" :placeholder=" $t('common.placeholders.phone')"
                         id="phone" v-model="driver.phone" aria-label="Phone" aria-describedby="phone-addon"/>
                  <ErrorMessage name="phone"/>
                </div>
                <div class="form-group">
                  <div class="row">
                    <div class="col-sm-3">
                      <label>{{ $t('drivers.fields.doc_type') }}</label>
                      <Field name="docType" class="form-select" id="doc_type" as="select" v-model="driver.docType">
                        <option v-for="(type, key) in types" :key="key" :value="type" selected>{{type}}</option>
                      </Field>
                      <ErrorMessage name="docType"/>
                    </div>
                    <div class="col-sm-9">
                      <label>{{ $t('drivers.fields.document') }}</label>
                      <Field name="document" class="form-control" id="document"
                             :placeholder="$t('drivers.placeholders.document')" v-model="driver.document" aria-label="Document"
                             aria-describedby="doc-addon">
                      </Field>
                      <ErrorMessage name="document"/>
                    </div>
                  </div>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" name="enable" type="checkbox" :checked="driver.isEnabled()" id="flexSwitchCheckDefault" @change="onEnable"/>
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
              <button class="btn btn-sm btn-outline-white btn-edit-img" type="button" data-bs-toggle="modal" data-bs-target="#image-vehicle">
                <span class="btn-inner--icon"><em class="fas fa-pen"></em></span>
              </button>
              <div class="form-group">
                <label>{{ $t('drivers.vehicle.brand') }}</label>
                <Field name="brand" type="text" class="form-control" :placeholder=" $t('drivers.placeholders.brand')"
                       v-model="driver.vehicle.brand" id="brand" aria-label="Brand" aria-describedby="brand-addon"/>
                <ErrorMessage name="brand"/>
              </div>
              <div class="form-group">
                <label>{{ $t('drivers.vehicle.model') }}</label>
                <Field name="model" type="text" class="form-control" id="model"
                       :placeholder="$t('drivers.placeholders.model')" v-model="driver.vehicle.model" aria-label="Model"
                       aria-describedby="model-addon"/>
                <ErrorMessage name="model"/>
              </div>
              <div class="form-group">
                <label>{{ $t('drivers.vehicle.plate') }}</label>
                <Field name="plate" type="text" class="form-control" id="plate"
                       :placeholder="$t('drivers.placeholders.plate')" v-model="driver.vehicle.plate" aria-label="Plate"
                       aria-describedby="plate-addon"/>
                <ErrorMessage name="plate"/>
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
    <ImageLoader :id="'image-vehicle'" :resourceId="driver.id" :path="pathVehicle" :event="vehicleEvent" @imageVehicleLoaded="uploadImgVehicle"></ImageLoader>
    <ImageLoader :id="'image-driver'" :resourceId="driver.id" :path="pathDriver" :event="driverEvent" @imageDriverLoaded="uploadImgDriver"></ImageLoader>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component'
import CustomValidator from "@/assets/validatiions/validators";
import StorageService from "@/services/StorageService"
import {ErrorMessage, Field, Form} from 'vee-validate'
import * as yup from 'yup'
import dayjs from 'dayjs'
import Driver from "@/models/Driver";
import DriverRepository from '@/repositories/DriverRepository'
import {Constants} from "@/constants/Constants";
import ToastService from "@/services/ToastService";
import ImageLoader from '@/components/ImageLoader.vue'

@Options({
  components: {
    Form,
    Field,
    ErrorMessage,
    ImageLoader
  },
})

export default class Create extends Vue {
  driver: Driver = new Driver()
  schemaImg: yup.ObjectSchema<any>
  types: Array<any> = Constants.DOC_TYPES
  readonly driverEvent = 'image-driver-loaded'
  readonly vehicleEvent = 'image-vehicle-loaded'
  readonly pathDriver = StorageService.driverPath
  readonly pathVehicle = StorageService.vehiclePath
  readonly schema = yup.object().shape({
    name: yup.string().required().min(3),
    email: yup.string().required().email(),
    phone: yup.string().required().min(8),
    docType: yup.mixed().oneOf(Constants.DOC_TYPES).required(),
    document: yup.string().required().min(6).max(10),
    brand: yup.string().required().min(3),
    plate: yup.string().required().min(3),
    model: yup.string().required().min(3)
  })

  created (): void {
    this.schemaImg = yup.object().shape({
      image: CustomValidator.isImage(this.$t('validations.image'), this.$t('validations.size')).required()
    })
    DriverRepository.getDriver(this.$route.params.id as string).then(driver => {
      Object.assign(this.driver, driver)
    })
  }

  uploadImgDriver(url: string): void {
    this.driver.photoUrl = url
    this.updateDriver()
  }

  uploadImgVehicle(url: string): void {
    this.driver.vehicle.photoUrl = url
    this.updateDriver()
  }

  updateDriver(): void {
    DriverRepository.update(this.driver).then(() => {
      ToastService.toast(ToastService.SUCCESS, this.$t('common.messages.created'))
    }).catch(e => {
      ToastService.toast(ToastService.ERROR, this.$t('common.messages.error'), e.message)
    })
  }

  onEnable(e: Event): void {
    const target = e.target as HTMLInputElement
    this.driver.enabled_at = target.checked ? dayjs().unix() : null
  }
}
</script>
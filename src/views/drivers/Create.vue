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
                <Field name="photoUrl" class="form-control form-control-sm" type="file" accept="image/*"
                       multiple v-model="imageDriver"/>
                <ErrorMessage name="photoUrl" class="is-invalid"/>
              </div>
              <div class="form-group">
                <label>{{ $t('users.fields.name') }}</label>
                <Field name="name" type="text" v-model="driver.name" v-slot="{ field, errorMessage, meta }">
                  <input class="form-control form-control-sm" id="name" v-model="driver.name" :placeholder="$t('common.placeholders.name')"
                         aria-label="Name" aria-describedby="name-addon" v-bind="field"/>
                  <span class="is-invalid" v-if="errorMessage && meta.dirty">{{ errorMessage }}</span>
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
                <div class="row">
                  <div class="col-sm-6">
                    <label>{{ $t('users.fields.phone') }}</label>
                    <Field name="phone" type="number"  v-model="driver.phone" v-slot="{ field, errorMessage, meta }">
                      <input class="form-control form-control-sm" v-model="field.value" :placeholder="$t('common.placeholders.phone')" id="phone" aria-label="Phone" aria-describedby="phone-addon" v-bind="field"/>
                      <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                    </Field>
                  </div>
                  <div class="col-sm-6">
                    <label>{{ $t('users.fields.phone2') }}</label>
                    <Field name="phone2" type="number"  v-model="driver.phone2" v-slot="{ field, errorMessage, meta }">
                      <input class="form-control form-control-sm" v-model="field.value" :placeholder="$t('common.placeholders.phone2')" id="phone2" aria-label="Phone 2" aria-describedby="phone2-addon" v-bind="field"/>
                      <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                    </Field>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <div class="row">
                  <div class="col-sm-3">
                    <label>{{ $t('drivers.fields.doc_type') }}</label>
                    <Field name="docType" class="form-select form-select-sm" id="doc_type" as="select" v-model="driver.docType">
                      <option v-for="(type, key) in types" :key="key" :value="type">{{ type }}</option>
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
              <div class="form-group">
                <div class="row">
                  <div class="col-sm-6">
                    <label>{{ $t('drivers.fields.status') }}</label>
                    <div class="form-check form-switch">
                      <input class="form-check-input" name="enabled_at" type="checkbox" id="enableDriver" @change="onEnable"/>
                      <label class="form-check-label">{{
                          $t(driver.enabled_at ? 'common.fields.enabled' : 'common.fields.disabled')
                        }}</label>
                      <ErrorMessage name="enabled_at"/>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <label>{{ $t('drivers.fields.payment_mode') }}</label>
                    <Field name="paymentMode" class="form-select form-select-sm" id="paymentMode" as="select" v-model="driver.paymentMode">
                      <option selected :value="DriverPaymentMode.MONTHLY">{{ $t('common.placeholders.' + DriverPaymentMode.MONTHLY) }}</option>
                      <option :value="DriverPaymentMode.PERCENTAGE">{{ $t('common.placeholders.' + DriverPaymentMode.PERCENTAGE) }}</option>
                    </Field>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card-header text-center text-capitalize">
                <h6>{{ $t('drivers.forms.create_vehicle') }}</h6>
              </div>
              <div class="form-group">
                <label class="form-label">{{ $t('drivers.placeholders.photo_vehicle') }}</label>
                <Field name="photoVehicleUrl" class="form-control form-control-sm" type="file" accept="image/*"
                       multiple v-model="imageVehicle"/>
                <ErrorMessage name="photoVehicleUrl" class="is-invalid"/>
              </div>
              <div class="form-group">
                <label>{{ $t('drivers.vehicle.brand') }}</label>
                <Field name="brand" type="text"  v-model="driver.vehicle.brand" v-slot="{ errorMessage, meta }">
                 <input class="form-control form-control-sm" v-model="driver.vehicle.brand" :placeholder="$t('drivers.placeholders.brand')" id="brand" aria-label="Brand" aria-describedby="brand-addon" autocomplete="none"/>
                <span class="is-invalid" v-if="errorMessage && meta.dirty">{{ errorMessage }}</span>
                 </Field>
              </div>
              <div class="form-group">
                <label>{{ $t('drivers.vehicle.model') }}</label>
                <Field name="model" as="select" class="form-select form-select-sm" v-model="driver.vehicle.model" v-slot="{ errorMessage, meta }">
                  <option v-for="(year, key) in DateHelper.arrayYears()" :key="key" :value="year">{{ year }}</option>
                  <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{  errorMessage }}</span>
                </Field>
              </div>
              <div class="form-group">
                <label>{{ $t('drivers.vehicle.plate') }}</label>
                <Field name="plate" type="text" v-model="driver.vehicle.plate" v-slot="{ errorMessage, meta }">
                  <input class="form-control form-control-sm" v-model="driver.vehicle.plate" :placeholder="$t('drivers.placeholders.plate')" id="plate" aria-label="Plate" aria-describedby="plate-addon" autocomplete="none"/>
                  <span class="is-invalid" v-if="errorMessage && meta.dirty">{{ errorMessage }}</span>
                </Field>
              </div>
              <div class="row">
                <div class="form-group col-sm-8">
                  <label>{{ $t('drivers.placeholders.color') }}</label>
                  <select name="colorObj" class="form-select form-select-sm" id="color" v-model="color">
                    <option v-for="(color, key) in Constants.COLORS" :key="key" :value="color.hex">{{ $t('common.colors.' + color.name) }}</option>
                  </select>
                </div>
                <div class="form-group col-sm-4">
                  <label>{{ $t('drivers.vehicle.color') }}</label>
                  <Field name="color" v-model="driver.vehicle.color.hex" v-slot="{ field, errorMessage, meta }">
                    <input name="color" class="form-control form-control-sm p-0" type="color" disabled v-model="field.value" :placeholder="$t('drivers.placeholders.color')" aria-label="Color" aria-describedby="color-addon" v-bind="field" autocomplete="none"/>
                    <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                  </Field>
                </div>
              </div>
              <div class="row">
                <div class="form-group col-sm-6">
                  <label>{{ $t('drivers.vehicle.soat_exp') }}</label>
                  <Field name="soat_exp" type="date" v-model="driver.vehicle.soat_exp" v-slot="{ field, errorMessage, meta }">
                    <input class="form-control form-control-sm" type="date" v-model="field.value"
                           :placeholder="$t('drivers.placeholders.soat_exp')" id="soat_exp" aria-label="Soat_exp"
                           aria-describedby="soat_exp-addon" v-bind="field" autocomplete="none"/>
                    <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                  </Field>
                </div>
                <div class="form-group col-sm-6">
                  <label>{{ $t('drivers.vehicle.tec_exp') }}</label>
                  <Field name="tec_exp" type="date" v-model="driver.vehicle.tec_exp" v-slot="{ field, errorMessage, meta }">
                    <input class="form-control form-control-sm" type="date" v-model="field.value" :placeholder="$t('drivers.placeholders.tec_exp')" id="tec_exp" aria-label="Pec_exp" aria-describedby="tec_exp-addon" v-bind="field" autocomplete="none"/>
                    <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                  </Field>
                </div>
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
import {string, date, mixed, object, ObjectSchema} from 'yup'
import dayjs from 'dayjs'
import Driver from '@/models/Driver'
import DriverRepository from '@/repositories/DriverRepository'
import {Constants} from '@/constants/Constants'
import ToastService from '@/services/ToastService'
import {DriverInterface} from '@/types/DriverInterface'
import i18n from '@/plugins/i18n'
import {onMounted, ref, Ref, watch} from 'vue'
import {useLoadingState} from '@/services/stores/LoadingState'
import router from '@/router'
import {useDriversStore} from '@/services/stores/DriversStore'
import {StrHelper} from '@/helpers/StrHelper'
import DateHelper from '@/helpers/DateHelper'
import {useSettingsStore} from "@/services/stores/SettingsStore";
import { DriverPaymentMode } from '@/constants/DriverPaymentMode'

const driver: Ref<Driver> = ref(new Driver)
const password: Ref<string> = ref('')
const imageDriver: Ref<File[]> = ref([])
const imageVehicle: Ref<File[]> = ref([])
const color: Ref<string> = ref(Constants.COLORS[0].hex)
const types: Array<any> = Constants.DOC_TYPES
const {setLoading} = useLoadingState()
const {addDriver} = useDriversStore()
const {branchSelected} = useSettingsStore()
const schema: ObjectSchema<any> = object().shape({
  name: string().required().min(3),
  email: string().required().email(),
  password: string().required().min(6),
  phone: string().required().min(8),
  phone2: string().nullable(),
  docType: mixed().oneOf(Constants.DOC_TYPES).required(),
  document: string().required().min(6).max(10),
  paymentMode: mixed().oneOf([DriverPaymentMode.MONTHLY, DriverPaymentMode.PERCENTAGE]).required(),
  brand: string().required().min(3),
  plate: string().required().min(3),
  model: string().required().min(3),
  color: string().matches(new RegExp(/^#([a-fA-F0-9]){3}$|[a-fA-F0-9]{6}$/)).required(),
  soat_exp: date().required(),
  tec_exp: date().required(),
  photoUrl: CustomValidator.isImage(i18n.global.t('validations.image'), i18n.global.t('validations.size')).required(),
  photoVehicleUrl: CustomValidator.isImage(i18n.global.t('validations.image'), i18n.global.t('validations.size')).required()
})

onMounted(() => {
  driver.value.docType = Constants.DOC_TYPE_CC
  driver.value.vehicle.model = DateHelper.arrayYears()[0].toString()
})

watch(driver, (newDriver) => {
  driver.value.name = StrHelper.toCamelCase(newDriver.name ?? '')
  driver.value.vehicle.brand = StrHelper.toCamelCase(newDriver.vehicle?.brand ?? '')
  driver.value.vehicle.model = StrHelper.toCamelCase(newDriver.vehicle?.model ?? '')
  driver.value.vehicle.plate = StrHelper.formatPlate(newDriver.vehicle?.plate ?? '')
  driver.value.phone = StrHelper.formatNumber(newDriver.phone ?? '')
  driver.value.phone2 = StrHelper.formatNumber(newDriver.phone2 ?? '')
}, {deep: true})

watch(color, (newColor) => {
  driver.value.vehicle.color = Constants.COLORS.find(c => c.hex == newColor)?? Constants.COLORS[0]
})

function uploadImg(path: string, image: File): Promise<string> {
  const reference = StorageService.getStorageReference(path, driver.value.id ?? '', image.name)
  return StorageService.uploadFile(reference, image)
}

function createDriver(_values: DriverInterface, event: FormActions<any>): void {
  setLoading(true)
  driver.value.vehicle.soat_exp = dayjs(driver.value.vehicle.soat_exp).unix()
  driver.value.vehicle.tec_exp = dayjs(driver.value.vehicle.tec_exp).unix()
  driver.value.phone = branchSelected?.calling_code + driver.value.phone
  DriverRepository.create(driver.value, password.value).then((id) => {
    driver.value.id = id
    uploadImg(StorageService.driverPath, imageDriver.value[0]).then(url => {
      driver.value.photoUrl = url
      uploadImg(StorageService.vehiclePath, imageVehicle.value[0]).then(urlPhotoVehicle => {
        setLoading(false)
        driver.value.vehicle.photoUrl = urlPhotoVehicle
        addDriver(driver.value)
        DriverRepository.update(driver.value)
        ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.created'))
        event.resetForm()
        router.push({name: 'drivers.index'})
      })
    })
  }).catch(e => {
    setLoading(false)
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function onEnable(e: Event): void {
  const target = e.target as HTMLInputElement
  driver.value.enabled_at = target.checked ? dayjs().unix() : 0
}
</script>
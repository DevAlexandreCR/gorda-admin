<template>
  <div class="container-fluid pb-4">
    <div class="d-flex justify-content-end mb-3">
      <button @click="goBack" class="btn btn-sm btn-info me-5">
        <em class="fas fa-arrow-left me-1"></em> {{ $t('common.actions.back') }}
      </button>
    </div>
    <Form @submit="updateDriver" :validation-schema="schema">
      <div class="card mx-auto mx-xxl-5">
        <div class="card-header text-center text-capitalize">
          <h6>{{ $t('drivers.forms.create') }}</h6>
        </div>
        <div class="card-body pt-2">
          <div class="row">
            <div class="col-md-6">
              <div class="card-header text-center text-capitalize">
                <h6>{{ $t('drivers.forms.create_driver') }}</h6>
              </div>
              <img v-if="driver.photoUrl" :src="driver.photoUrl" class="card-img-top img-driver" alt="profile_photo">
              <div v-else class="container-fluid text-center">
                <em class="fa-solid fa-user-astronaut fa-10x"></em>
              </div>
              <button class="btn btn-sm btn-info btn-edit-img py-1 px-2" type="button" data-bs-toggle="modal"
                data-bs-target="#image-driver">
                <span class="btn-inner--icon"><em class="fas fa-pen"></em></span>
              </button>
              <div class="form-group">
                <label>{{ $t('users.fields.name') }}</label>
                <Field name="name" type="text" v-slot="{ field, errorMessage, meta }" v-model="driver.name">
                  <input class="form-control form-control-sm" id="name" aria-label="Name" aria-describedby="name-addon"
                    v-model="field.value" :placeholder="$t('common.placeholders.name')" v-bind="field" />
                  <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                </Field>
              </div>
              <div class="form-group">
                <div class="row">
                  <div class="col-md-6">
                    <label>{{ $t('users.fields.email') }}</label>
                    <div class="input-group">
                      <input type="email" class="form-control form-control-sm" :placeholder="$t('common.placeholders.email')"
                             readonly aria-label="Email" name="email" aria-describedby="email-addon" v-model="driver.email">
                      <button class="badge bg-secondary border-0" type="button" data-bs-toggle="modal"
                              data-bs-target="#editGmail">
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label>{{ $t('users.fields.password') }}</label>
                    <div class="input-group">
                      <input type="password" class="form-control form-control-sm"
                             :placeholder="$t('common.placeholders.password')" readonly aria-label="Password" name="password"
                             aria-describedby="password-addon" v-model="driver.password">
                      <button class="badge bg-secondary border-0" type="button" data-bs-toggle="modal"
                              data-bs-target="#editPassword">
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <div class="row">
                  <div class="col-sm-6">
                    <label>{{ $t('users.fields.phone') }}</label>
                    <Field name="phone" type="phone"  v-model="driver.phone" v-slot="{ errorMessage, meta }">
                    <input class="form-control form-control-sm" v-model="driver.phone" :placeholder="$t('common.placeholders.phone')" id="phone" aria-label="Phone" aria-describedby="phone-addon"/>
                      <span class="is-invalid" v-if="errorMessage && !meta.dirty">{{ errorMessage }}</span>
                    </Field>
                  </div>
                  <div class="col-sm-6">
                    <label>{{ $t('users.fields.phone2') }}</label>
                    <Field name="phone2" type="phone"  v-model="driver.phone2" v-slot="{ errorMessage, meta }">
                    <input class="form-control form-control-sm" v-model="driver.phone2" :placeholder="$t('common.placeholders.phone2')" id="phone2" aria-label="Phone 2" aria-describedby="phone2-addon"/>
                      <span class="is-invalid" v-if="errorMessage && !meta.dirty">{{ errorMessage }}</span>
                    </Field>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <div class="row">
                  <div class="col-sm-3">
                    <label>{{ $t('drivers.fields.doc_type') }}</label>
                    <Field name="docType" class="form-select form-select-sm" id="doc_type" as="select"
                      v-model="driver.docType">
                      <option v-for="(type, key) in types" :key="key" :value="type" selected>{{ type }}</option>
                    </Field>
                  </div>
                  <div class="col-sm-9">
                    <label>{{ $t('drivers.fields.document') }}</label>
                    <Field name="document" type="text" v-slot="{ field, errorMessage, meta }" v-model="driver.document">
                      <input class="form-control form-control-sm" id="document" aria-label="Document"
                        aria-describedby="doc-addon" v-model="field.value"
                        :placeholder="$t('drivers.placeholders.document')" v-bind="field" />
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
                      <input class="form-check-input" name="enable" type="checkbox" id="flexSwitchCheckDefault" @change="onEnable" :checked="driver.isEnabled()"/>
                      <label class="form-check-label">{{
                          $t(driver.enabled_at ? 'common.fields.enabled' : 'common.fields.disabled')
                        }}</label>
                      <ErrorMessage name="enable"/>
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
              <div class="row">
                <div class="form-group col">
                  <label>{{ $t('drivers.forms.current_balance') }}</label>
                  <span class="form-control-plaintext">{{ driver.balance + branchSelected?.currency_code }}</span>
                </div>
                <button v-if="AuthService.isAdmin()"  type="button" class="col btn btn-sm btn-light" data-bs-target="#balance-modal" data-bs-toggle="modal">
                  {{ $t('drivers.forms.manage_balance') }}
                </button>
              </div>
              <div v-if="driver.paymentMode === DriverPaymentMode.MONTHLY" class="row mt-2">
                <button type="button" class="btn btn-sm btn-outline-primary" data-bs-target="#monthly-payment-modal" data-bs-toggle="modal">
                  {{ $t('drivers.monthly_payments.open_modal') }}
                </button>
              </div>
            </div>
            <div class="col-md-6">
              <RosterPanel v-if="driver.id" :driver-id="driver.id" />
              <div class="form-group mt-3">
                <label>{{ $t('users.fields.device') }}</label>
                <div class="input-group" v-if="driver.device">
                  <input type="text" class="form-control form-control-sm disabled"
                         disabled aria-label="Device" name="device.name"
                         aria-describedby="device-addon" v-model="driver.device.name">
                  <button class="badge bg-danger border-0" id="removeDevice" type="button" @click="removeDevice()">
                    <em class="fa fa-solid fa-trash"></em>
                  </button>
                </div>
                <input type="text" class="form-control form-control-sm" v-else
                       :placeholder="$t('common.placeholders.device')" disabled aria-label="Device" name="device"
                       aria-describedby="password-addon" v-model="driver.device">
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
    <ImageLoader :id="'image-driver'" :resourceId="driver.id" :path="pathDriver" :event="driverEvent"
      @imageDriverLoaded="uploadImgDriver"></ImageLoader>
    <!-- Recharge History -->
    <div v-if="recharges.length > 0" class="card mx-auto mx-xxl-5 mt-3">
      <div class="card-header text-center text-capitalize">
        <h6>{{ $t('drivers.recharges.history_title') }}</h6>
      </div>
      <div class="card-body p-0">
        <table class="table table-sm mb-0">
          <thead>
            <tr>
              <th>{{ $t('drivers.recharges.col_date') }}</th>
              <th>{{ $t('drivers.recharges.col_amount') }}</th>
              <th>{{ $t('drivers.recharges.col_balance') }}</th>
              <th>{{ $t('drivers.recharges.col_actor') }}</th>
              <th>{{ $t('drivers.recharges.col_note') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in recharges" :key="r.id">
              <td>{{ dayjs.unix(r.created_at).format('DD/MM/YY HH:mm') }}</td>
              <td :class="r.amount >= 0 ? 'text-success' : 'text-danger'">
                {{ (r.amount >= 0 ? '+' : '') + r.amount }}
              </td>
              <td>{{ r.balanceAfter }}</td>
              <td>{{ r.createdByName }}</td>
              <td>{{ r.note ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Monthly Payment History -->
    <div v-if="monthlyPayments.length > 0" class="card mx-auto mx-xxl-5 mt-3">
      <div class="card-header text-center text-capitalize">
        <h6>{{ $t('drivers.monthly_payments.history_title') }}</h6>
      </div>
      <div class="card-body p-0">
        <table class="table table-sm mb-0">
          <thead>
            <tr>
              <th>{{ $t('drivers.monthly_payments.col_period') }}</th>
              <th>{{ $t('drivers.monthly_payments.col_amount') }}</th>
              <th>{{ $t('drivers.monthly_payments.col_actor') }}</th>
              <th>{{ $t('drivers.monthly_payments.col_date') }}</th>
              <th>{{ $t('drivers.monthly_payments.col_note') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in monthlyPayments" :key="p.id">
              <td>{{ p.period }}</td>
              <td>{{ p.amount }}</td>
              <td>{{ p.createdByName }}</td>
              <td>{{ dayjs.unix(p.created_at).format('DD/MM/YY HH:mm') }}</td>
              <td>{{ p.note ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- Modal Balance-->
  <div class="modal fade" id="balance-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ $t('drivers.forms.add_balance') }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>{{ $t('drivers.forms.current_balance') }}</label>
            <span class="form-control-plaintext">{{ driver.balance + branchSelected?.currency_code }}</span>
          </div>
          <div class="form-group">
            <label>{{ $t('drivers.forms.add_balance') }}</label>
            <input type="number" class="form-control" v-model="newBalance" />
            <small class="text-muted">{{ $t('drivers.forms.balance_hint_positive') }}</small>
          </div>
          <div class="form-group mt-2">
            <label>{{ $t('drivers.forms.recharge_note') }}</label>
            <input type="text" class="form-control" v-model="rechargeNote" :placeholder="$t('drivers.forms.recharge_note_placeholder')" />
            <small class="text-muted">{{ $t('drivers.forms.balance_hint_negative') }}</small>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">
            {{ $t('common.actions.close') }}
          </button>
          <button @click="addBalance" type="button" class="btn bg-gradient-primary">{{ $t('common.actions.submit') }}</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal Monthly Payment -->
  <div class="modal fade" id="monthly-payment-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('drivers.monthly_payments.modal_title') }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>{{ $t('drivers.monthly_payments.field_period') }}</label>
            <input type="month" class="form-control" v-model="monthlyPaymentPeriod" />
            <small class="text-muted">{{ $t('drivers.monthly_payments.hint_period') }}</small>
          </div>
          <div class="form-group mt-2">
            <label>{{ $t('drivers.monthly_payments.field_amount') }}</label>
            <input type="number" class="form-control" v-model="monthlyPaymentAmount" min="0" />
            <small class="text-muted">{{ $t('drivers.monthly_payments.hint_amount') }}</small>
          </div>
          <div class="form-group mt-2">
            <label>{{ $t('drivers.monthly_payments.field_note') }}</label>
            <input type="text" class="form-control" v-model="monthlyPaymentNote" :placeholder="$t('drivers.monthly_payments.placeholder_note')" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">
            {{ $t('common.actions.close') }}
          </button>
          <button @click="addMonthlyPayment" type="button" class="btn bg-gradient-primary">{{ $t('common.actions.submit') }}</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="editGmail" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ $t('users.forms.edit') }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Form @submit="updateEmail" :validation-schema="schemaEmail">
          <div class="modal-body">
            <div class="mb-3">
              <Field name="email" type="email" v-slot="{ field }" v-model="driver.email">
                <input class="form-control form-control-sm" id="email" aria-label="Email" aria-describedby="email-addon"
                  v-model="field.value" :placeholder="$t('common.placeholders.email')" v-bind="field" />
              </Field>
              <ErrorMessage name="email" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">
              {{ $t('common.actions.close') }}
            </button>
            <button type="submit" class="btn bg-gradient-primary">{{ $t('common.actions.submit') }}</button>
          </div>
        </Form>
      </div>
    </div>
  </div>
  <!-- Modal Balance-->
  <div class="modal fade" id="editPassword" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ $t('users.forms.edit_password') }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Form @submit="updatePassword" :validation-schema="schemaPassword">
          <div class="modal-body">
            <div class="mb-3">
              <Field name="password" type="password" v-slot="{ field }" v-model="driver.password">
                <div class="input-group">
                  <span style="cursor: pointer" class="input-group-text" @click="showPassword = !showPassword">
                    <i class="fa" :class="showPassword ? 'fa-eye' : 'fa-eye-slash'"></i>
                  </span>
                  <input class="form-control form-control-sm" id="password" aria-label="Password" aria-describedby="password-addon" v-model="field.value"
                    :placeholder="$t('common.placeholders.password')" v-bind="field"
                    :type="showPassword ? 'text' : 'password'" />
                </div>
              </Field>
              <ErrorMessage name="password" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">
              {{ $t('common.actions.close') }}
            </button>
            <button type="submit" class="btn bg-gradient-primary">{{ $t('common.actions.submit') }}</button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StorageService from '@/services/StorageService'
import { ErrorMessage, Field, Form } from 'vee-validate'
import dayjs from 'dayjs'
import Driver from '@/models/Driver'
import DriverRepository from '@/repositories/DriverRepository'
import { Constants } from '@/constants/Constants'
import ToastService from '@/services/ToastService'
import ImageLoader from '@/components/ImageLoader.vue'
import RosterPanel from '@/components/vehicles/RosterPanel.vue'
import i18n from '@/plugins/i18n'
import { onBeforeMount, ref, Ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDriversStore } from '@/services/stores/DriversStore'
import { mixed, object, string } from 'yup'
import { useLoadingState } from '@/services/stores/LoadingState'
import { hide } from '@/helpers/ModalHelper'
import { StrHelper } from '@/helpers/StrHelper'
import { useI18n } from 'vue-i18n'
import AuthService from '@/services/AuthService'
import { useSettingsStore } from '@/services/stores/SettingsStore'
import { storeToRefs } from 'pinia'
import { DriverPaymentMode } from '@/constants/DriverPaymentMode'
import { RechargeInterface } from '@/types/RechargeInterface'
import MonthlyPaymentSettingsRepository from '@/repositories/MonthlyPaymentSettingsRepository'
import { MonthlyPaymentInterface } from '@/types/MonthlyPaymentInterface'
const driver: Ref<Driver> = ref(new Driver)
const recharges: Ref<RechargeInterface[]> = ref([])
const rechargesTotal = ref(0)
const monthlyPaymentPeriod = ref(dayjs().format('YYYY-MM'))
const monthlyPaymentAmount = ref(0)
const monthlyPaymentNote = ref('')
const monthlyPayments: Ref<MonthlyPaymentInterface[]> = ref([])
const monthlyPaymentsTotal = ref(0)
const suggestedAmount = ref(0)
const types: Ref<Array<string>> = ref(Constants.DOC_TYPES)
const showPassword = ref(false);
const driverEvent = 'image-driver-loaded'
const pathDriver = StorageService.driverPath
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const driverStore = useDriversStore()
const currentUser = AuthService.getCurrentUser()
const { setLoading } = useLoadingState()
const newBalance = ref(0)
const rechargeNote = ref('')
const { branchSelected } = storeToRefs(useSettingsStore())
const schema = object().shape({
  name: string().required().min(3),
  phone: string().required().min(8),
  docType: mixed().oneOf(Constants.DOC_TYPES).required(),
  document: string().required().min(6).max(10),
})

watch(driver, (newDriver) => {
  driver.value.name = StrHelper.toCamelCase(newDriver.name ?? '')
  driver.value.phone = StrHelper.formatNumber(newDriver.phone ?? '')
}, { deep: true })

const schemaEmail = object().shape({
  email: string().required().email()
})

const schemaPassword = object().shape({
  password: string().required()
})


function goBack() {
  router.back()
}

async function loadRecharges(): Promise<void> {
  if (!driver.value.id) return
  try {
    const result = await DriverRepository.listRecharges(driver.value.id)
    recharges.value = result.recharges
    rechargesTotal.value = result.total
  } catch (e) {
    // silent fail — history is non-critical
  }
}

async function loadMonthlyPayments(): Promise<void> {
  if (!driver.value.id) return
  try {
    const result = await DriverRepository.listMonthlyPayments(driver.value.id)
    monthlyPayments.value = result.rows
    monthlyPaymentsTotal.value = result.total
  } catch (e) {
    // silent fail — history is non-critical
  }
}

async function loadSuggestedAmount(): Promise<void> {
  try {
    const settings = await MonthlyPaymentSettingsRepository.get()
    suggestedAmount.value = settings.suggested_amount
    monthlyPaymentAmount.value = settings.suggested_amount
  } catch (e) {
    // silent fail — keep default 0
  }
}

onBeforeMount(() => {
  const id = route.params.id as string
  const driverTmp = driverStore.findById(id)
  if (driverTmp) {
    driver.value = driverTmp
  }
  setLoading(true)
  DriverRepository.getDriver(id)
    .then(async (updatedDriverData) => {
      const updatedDriver = new Driver()
      Object.assign(updatedDriver, updatedDriverData)
      driverStore.addDriver(updatedDriver)
      Object.assign(driver.value, updatedDriver)
      await loadRecharges()
      await loadMonthlyPayments()
      await loadSuggestedAmount()
      setLoading(false)
    })
    .catch(async (e) => {
      setLoading(false)
      await ToastService.toast(
        ToastService.ERROR,
        i18n.global.t('common.messages.error'),
        e.message
      )
    })
})

function uploadImgDriver(url: string): void {
  driver.value.photoUrl = url
  updateDriver()
}

function updateDriver(): void {
  setLoading(true)
  DriverRepository.update(driver.value).then(async () => {
    setLoading(false)
   await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  }).catch(async e => {
    setLoading(false)
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function updateEmail(): void {
  setLoading(true)
  DriverRepository.updateEmail(driver.value.id, driver.value.email).then(async () => {
    setLoading(false)
    hide('editGmail')
   await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  }).catch(async e => {
    setLoading(false)
   await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function updatePassword(): void {
  setLoading(true)
  DriverRepository.updatePassword(driver.value.id, driver.value.password).then(async () => {
    setLoading(false)
    hide('editPassword')
    await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  }).catch(async e => {
    setLoading(false)
   await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function addBalance(): void {
  setLoading(true)
  DriverRepository.createRecharge(driver.value, newBalance.value, rechargeNote.value).then(async (result) => {
    driver.value.balance = result.driver.balance
    newBalance.value = 0
    rechargeNote.value = ''
    await loadRecharges()
    setLoading(false)
    hide('balance-modal')
    await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  }).catch(async e => {
    setLoading(false)
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function addMonthlyPayment(): void {
  setLoading(true)
  DriverRepository.createMonthlyPayment(driver.value.id, {
    period: monthlyPaymentPeriod.value,
    amount: monthlyPaymentAmount.value,
    note: monthlyPaymentNote.value || null,
  }).then(async (result) => {
    driver.value.enabled_at = result.driver.enabled_at
    monthlyPaymentPeriod.value = dayjs().format('YYYY-MM')
    monthlyPaymentAmount.value = suggestedAmount.value
    monthlyPaymentNote.value = ''
    await loadMonthlyPayments()
    setLoading(false)
    hide('monthly-payment-modal')
    await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  }).catch(async e => {
    setLoading(false)
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function onEnable(event: Event): void {
  setLoading(true)
  const target = event.target as HTMLInputElement
  driver.value.enabled_at = target.checked ? dayjs().unix() : 0
  DriverRepository.enable(driver.value.id ?? '', driver.value.enabled_at).then(async () => {
    setLoading(false)
    const message = driver.value.enabled_at == 0 ?
      i18n.global.t('users.messages.disabled') : i18n.global.t('users.messages.enabled')
   await ToastService.toast(ToastService.SUCCESS, message)
  }).catch(async e => {
    setLoading(false)
   await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function removeDevice(): void {
  driver.value.device = null
}
</script>
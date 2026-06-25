<template>
  <div class="container-fluid pb-4">
    <Form @submit="updateDriver" :validation-schema="schema">

      <!-- Page header: breadcrumb + driver name + back button -->
      <div class="d-flex justify-content-between align-items-start mb-4 px-xxl-5">
        <div>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-1">
              <li class="breadcrumb-item text-muted" style="opacity: 0.7">Conductores</li>
              <li class="breadcrumb-item active fw-semibold">Editar conductor</li>
            </ol>
          </nav>
          <h5 class="mb-0 fw-bold" style="color: var(--detail-section-label)">{{ driver.name }}</h5>
        </div>
        <button type="button" @click="goBack" class="btn btn-sm btn-outline-secondary">
          <em class="fas fa-arrow-left me-1"></em>{{ $t('common.actions.back') }}
        </button>
      </div>

      <!-- Profile header card -->
      <div class="card mx-auto mx-xxl-5 mb-4">
        <div class="card-body">
          <div class="d-flex gap-4 align-items-start">

            <!-- Avatar with pencil overlay -->
            <div class="position-relative" style="flex: none; padding-top: 0.25rem">
              <div class="detail-avatar-wrapper">
                <img v-if="driver.photoUrl" :src="driver.photoUrl" class="detail-avatar-img" alt="profile_photo">
                <div v-else class="detail-avatar-placeholder">
                  <em class="fa-solid fa-user-astronaut fa-3x text-muted"></em>
                </div>
              </div>
              <button type="button" class="position-absolute detail-avatar-edit-btn"
                      data-bs-toggle="modal" data-bs-target="#image-driver">
                <em class="fas fa-pencil"></em>
              </button>
            </div>

            <!-- Identity inputs -->
            <div class="flex-fill">
              <div class="row g-3">
                <!-- Nombre completo - full row -->
                <div class="col-12">
                  <label class="form-label small fw-bold">{{ $t('users.fields.name') }}</label>
                  <Field name="name" type="text" v-slot="{ field, errorMessage, meta }" v-model="driver.name">
                    <input class="form-control form-control-sm" id="name" aria-label="Name" aria-describedby="name-addon"
                      v-model="field.value" :placeholder="$t('common.placeholders.name')" v-bind="field" />
                    <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                  </Field>
                </div>
                <!-- Email (readonly + Editar) -->
                <div class="col-md-6">
                  <label class="form-label small fw-bold">{{ $t('users.fields.email') }}</label>
                  <div class="input-group">
                    <input type="email" class="form-control form-control-sm" :placeholder="$t('common.placeholders.email')"
                           readonly aria-label="Email" name="email" aria-describedby="email-addon" v-model="driver.email">
                    <button class="badge bg-secondary border-0" type="button" data-bs-toggle="modal"
                            data-bs-target="#editGmail">
                      {{ $t('common.actions.edit') }}
                    </button>
                  </div>
                </div>
                <!-- Password (readonly + Editar) -->
                <div class="col-md-6">
                  <label class="form-label small fw-bold">{{ $t('users.fields.password') }}</label>
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
                <!-- Phone -->
                <div class="col-sm-6">
                  <label class="form-label small fw-bold">{{ $t('users.fields.phone') }}</label>
                  <Field name="phone" type="phone" v-model="driver.phone" v-slot="{ errorMessage, meta }">
                    <input class="form-control form-control-sm" v-model="driver.phone" :placeholder="$t('common.placeholders.phone')" id="phone" aria-label="Phone" aria-describedby="phone-addon"/>
                    <span class="is-invalid" v-if="errorMessage && !meta.dirty">{{ errorMessage }}</span>
                  </Field>
                </div>
                <!-- Phone2 -->
                <div class="col-sm-6">
                  <label class="form-label small fw-bold">{{ $t('users.fields.phone2') }}</label>
                  <Field name="phone2" type="phone" v-model="driver.phone2" v-slot="{ errorMessage, meta }">
                    <input class="form-control form-control-sm" v-model="driver.phone2" :placeholder="$t('common.placeholders.phone2')" id="phone2" aria-label="Phone 2" aria-describedby="phone2-addon"/>
                    <span class="is-invalid" v-if="errorMessage && !meta.dirty">{{ errorMessage }}</span>
                  </Field>
                </div>
                <!-- DocType -->
                <div class="col-sm-3">
                  <label class="form-label small fw-bold">{{ $t('drivers.fields.doc_type') }}</label>
                  <Field name="docType" class="form-select form-select-sm" id="doc_type" as="select" v-model="driver.docType">
                    <option v-for="(type, key) in types" :key="key" :value="type" selected>{{ type }}</option>
                  </Field>
                </div>
                <!-- Document -->
                <div class="col-sm-9">
                  <label class="form-label small fw-bold">{{ $t('drivers.fields.document') }}</label>
                  <Field name="document" type="text" v-slot="{ field, errorMessage, meta }" v-model="driver.document">
                    <input class="form-control form-control-sm" id="document" aria-label="Document"
                      aria-describedby="doc-addon" v-model="field.value"
                      :placeholder="$t('drivers.placeholders.document')" v-bind="field" />
                    <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                  </Field>
                </div>
              </div>
            </div>
          </div>

          <!-- Header action row -->
          <div class="d-flex justify-content-end gap-2 pt-3 mt-3"
               style="border-top: 1px solid var(--detail-divider)">
            <button type="button" class="btn btn-sm bg-gradient-secondary" @click="goBack">
              {{ $t('common.actions.close') }}
            </button>
            <button type="submit" class="btn btn-sm bg-gradient-primary">
              {{ $t('common.actions.submit') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Two balanced columns -->
      <div class="row mx-auto mx-xxl-5 mb-4 g-4">

        <!-- LEFT: Vehículos + Dispositivo -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-body">
              <h6 class="detail-section-label">
                <em class="fas fa-car-side me-2" style="color: #cb0c9f"></em>
                {{ $t('drivers.detail.section_vehicles') }}
              </h6>
              <hr class="detail-divider">
              <RosterPanel v-if="driver.id" :driver-id="driver.id" />
              <h6 class="detail-section-label mt-4">
                <em class="fas fa-mobile-screen me-2" style="color: #cb0c9f"></em>
                {{ $t('drivers.detail.section_device') }}
              </h6>
              <hr class="detail-divider">
              <div class="form-group">
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

        <!-- RIGHT: Estado y pagos -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-body">
              <h6 class="detail-section-label">
                <em class="fas fa-wallet me-2" style="color: #cb0c9f"></em>
                {{ $t('drivers.detail.section_status_payments') }}
              </h6>
              <hr class="detail-divider">

              <div class="row align-items-end g-3">
                <div class="col-6">
                  <label class="form-label small fw-bold">{{ $t('drivers.fields.status') }}</label>
                  <div class="form-check form-switch">
                    <input class="form-check-input" name="enable" type="checkbox" id="flexSwitchCheckDefault" @change="onEnable" :checked="driver.isEnabled()"/>
                    <label class="form-check-label">{{
                        $t(driver.enabled_at ? 'common.fields.enabled' : 'common.fields.disabled')
                      }}</label>
                    <ErrorMessage name="enable"/>
                  </div>
                </div>
                <div class="col-6">
                  <label class="form-label small fw-bold">{{ $t('drivers.fields.payment_mode') }}</label>
                  <Field name="paymentMode" class="form-select form-select-sm" id="paymentMode" as="select" v-model="driver.paymentMode">
                    <option selected :value="DriverPaymentMode.MONTHLY">{{ $t('common.placeholders.' + DriverPaymentMode.MONTHLY) }}</option>
                    <option :value="DriverPaymentMode.PERCENTAGE">{{ $t('common.placeholders.' + DriverPaymentMode.PERCENTAGE) }}</option>
                  </Field>
                </div>
              </div>

              <hr class="detail-divider my-3">

              <!-- Dark gradient balance block -->
              <div class="rounded-3 p-3 d-flex justify-content-between align-items-center"
                   style="background: linear-gradient(310deg,#141727,#3a416f)">
                <div>
                  <div class="text-uppercase fw-bold mb-1"
                       style="font-size: 0.65rem; color: rgba(255,255,255,0.5); letter-spacing: 0.06em">
                    {{ $t('drivers.forms.current_balance') }}
                  </div>
                  <div class="d-flex align-items-baseline gap-2">
                    <span style="font-size: 1.8rem; font-weight: 700; color: #fff; letter-spacing: -0.03em">{{ driver.balance }}</span>
                    <span style="font-size: 0.72rem; font-weight: 700; color: rgba(255,255,255,0.4)">{{ branchSelected?.currency_code }}</span>
                  </div>
                </div>
                <button v-if="AuthService.isAdmin()" type="button" class="btn btn-sm"
                        data-bs-target="#balance-modal" data-bs-toggle="modal"
                        style="background: rgba(255,255,255,0.12); color: #fff; border: none; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em">
                  <em class="fas fa-sliders me-1"></em>{{ $t('drivers.forms.manage_balance') }}
                </button>
              </div>

              <!-- Monthly payment trigger -->
              <div v-if="driver.paymentMode === DriverPaymentMode.MONTHLY" class="mt-3">
                <button type="button" class="btn btn-sm btn-outline-primary w-100"
                        data-bs-target="#monthly-payment-modal" data-bs-toggle="modal">
                  <em class="fas fa-calendar-plus me-1"></em>{{ $t('drivers.monthly_payments.open_modal') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>

    <ImageLoader :id="'image-driver'" :resourceId="driver.id" :path="pathDriver" :event="driverEvent"
      @imageDriverLoaded="uploadImgDriver"></ImageLoader>

    <!-- Historial (outside Form) -->
    <div class="card mx-auto mx-xxl-5">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h6 class="mb-0 fw-bold" style="color: var(--detail-section-label)">
          {{ $t('drivers.detail.section_history') }}
        </h6>
        <div class="d-flex gap-2">
          <button type="button" class="history-tab-pill" :class="{ active: activeHistoryTab === 'saldo' }" @click="activeHistoryTab = 'saldo'">
            <em class="fas fa-coins me-1"></em>{{ $t('drivers.detail.tab_saldo') }}
          </button>
          <button type="button" class="history-tab-pill" :class="{ active: activeHistoryTab === 'mensualidades' }" @click="activeHistoryTab = 'mensualidades'">
            <em class="fas fa-calendar-check me-1"></em>{{ $t('drivers.detail.tab_mensualidades') }}
          </button>
        </div>
      </div>
      <div class="card-body p-0">
        <!-- Saldo pane -->
        <template v-if="activeHistoryTab === 'saldo'">
          <p v-if="recharges.length === 0" class="text-muted small p-3 mb-0">{{ $t('drivers.detail.empty_recharges') }}</p>
          <table v-else class="table table-sm mb-0">
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
        </template>
        <!-- Mensualidades pane -->
        <template v-else>
          <p v-if="monthlyPayments.length === 0" class="text-muted small p-3 mb-0">{{ $t('drivers.detail.empty_monthly_payments') }}</p>
          <table v-else class="table table-sm mb-0">
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
        </template>
      </div>
    </div>

  </div>

  <!-- Modal Balance -->
  <div class="modal fade" id="balance-modal" tabindex="-1" aria-labelledby="balanceModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content border-0 rounded-3">
        <div class="modal-header border-0 pb-0">
          <div class="d-flex align-items-center gap-2">
            <span class="modal-icon-chip">
              <em class="fas fa-coins"></em>
            </span>
            <h6 class="modal-title mb-0" id="balanceModalLabel">{{ $t('drivers.forms.add_balance') }}</h6>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
        <div class="modal-footer border-0">
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
      <div class="modal-content border-0 rounded-3">
        <div class="modal-header border-0 pb-0">
          <div class="d-flex align-items-center gap-2">
            <span class="modal-icon-chip">
              <em class="fas fa-calendar-check"></em>
            </span>
            <h6 class="modal-title mb-0">{{ $t('drivers.monthly_payments.modal_title') }}</h6>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
        <div class="modal-footer border-0">
          <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">
            {{ $t('common.actions.close') }}
          </button>
          <button @click="addMonthlyPayment" type="button" class="btn bg-gradient-primary">{{ $t('common.actions.submit') }}</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Edit Gmail -->
  <div class="modal fade" id="editGmail" tabindex="-1" aria-labelledby="editGmailLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content border-0 rounded-3">
        <div class="modal-header border-0 pb-0">
          <div class="d-flex align-items-center gap-2">
            <span class="modal-icon-chip">
              <em class="fas fa-envelope"></em>
            </span>
            <h6 class="modal-title mb-0" id="editGmailLabel">{{ $t('users.forms.edit') }}</h6>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
          <div class="modal-footer border-0">
            <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">
              {{ $t('common.actions.close') }}
            </button>
            <button type="submit" class="btn bg-gradient-primary">{{ $t('common.actions.submit') }}</button>
          </div>
        </Form>
      </div>
    </div>
  </div>

  <!-- Modal Edit Password -->
  <div class="modal fade" id="editPassword" tabindex="-1" aria-labelledby="editPasswordLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content border-0 rounded-3">
        <div class="modal-header border-0 pb-0">
          <div class="d-flex align-items-center gap-2">
            <span class="modal-icon-chip">
              <em class="fas fa-key"></em>
            </span>
            <h6 class="modal-title mb-0" id="editPasswordLabel">{{ $t('users.forms.edit_password') }}</h6>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
          <div class="modal-footer border-0">
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
const activeHistoryTab = ref<'saldo' | 'mensualidades'>('saldo')
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
  const previousEnabledAt = driver.value.enabled_at
  driver.value.enabled_at = target.checked ? dayjs().unix() : 0
  DriverRepository.enable(driver.value.id ?? '', driver.value.enabled_at).then(async () => {
    setLoading(false)
    const message = driver.value.enabled_at == 0 ?
      i18n.global.t('users.messages.disabled') : i18n.global.t('users.messages.enabled')
   await ToastService.toast(ToastService.SUCCESS, message)
  }).catch(async e => {
    setLoading(false)
    driver.value.enabled_at = previousEnabledAt
   await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function removeDevice(): void {
  driver.value.device = null
}
</script>

<style scoped lang="scss">
.detail-avatar-wrapper {
  width: 76px;
  height: 76px;
  border-radius: 0.75rem;
  overflow: hidden;
  background: linear-gradient(310deg, #7928ca, #ff0080);
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-avatar-img {
  width: 76px;
  height: 76px;
  object-fit: cover;
}

.detail-avatar-placeholder {
  width: 76px;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
}

.detail-avatar-edit-btn {
  bottom: -4px;
  right: -4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(310deg, #2152ff, #21d4fd);
  border: 2px solid var(--card-bg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.55rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  line-height: 1;
  padding: 0;
}

.detail-section-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--detail-section-label);
  margin-bottom: 0.25rem;
}

:global(body.dark-version) .detail-section-label {
  color: rgba(255, 255, 255, 0.92) !important;
}

.detail-divider {
  border-color: var(--detail-divider);
  opacity: 1;
  margin: 0.75rem 0;
}

:global(body.dark-version) .detail-divider {
  border-color: rgba(255, 255, 255, 0.15) !important;
}

.history-tab-pill {
  padding: 0.35rem 0.9rem;
  border-radius: 50rem;
  border: 1px solid var(--detail-divider);
  background: var(--card-bg);
  color: var(--muted-text);
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &.active {
    border-color: #cb0c9f;
    background: var(--detail-pill-active-bg);
    color: var(--detail-pill-active-text);
  }
}

.modal-icon-chip {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  background: linear-gradient(310deg, #7928ca, #ff0080);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.78rem;
  flex: none;
}
</style>

<template>
  <div class="mx-3">
      <div class="card mb-4">
      <div class="row m-3">
        <div class="col-4" v-if="currentUser && currentUser.isAdmin()">
          <h6 class="ms-2">{{ $t('common.models.drivers', filteredDrivers.length) + ' ' + filteredDrivers.length }}</h6>
        </div>
        <div class="col-4 d-flex justify-content-end" :class="{ 'col-8': !(currentUser && currentUser.isAdmin()) }">
          <div class="form-group d-inline-flex">
            <select class="form-select form-select-sm" v-model="enabled">
              <option :value="-1">{{ $t('common.fields.status') }}</option>
              <option :value="1">{{ $t('common.fields.enabled') }}</option>
              <option :value="0">{{ $t('common.fields.disabled') }}</option>
            </select>
            <select class="form-select form-select-sm" v-model="paymentMode">
              <option :value="false">{{ $t('drivers.fields.payment_mode') }}</option>
              <option :value="DriverPaymentMode.MONTHLY">{{ $t('common.placeholders.' + DriverPaymentMode.MONTHLY) }}</option>
              <option :value="DriverPaymentMode.PERCENTAGE">{{ $t('common.placeholders.' + DriverPaymentMode.PERCENTAGE) }}</option>
            </select>
          </div>
        </div>
        <div class="col-4 d-flex justify-content-end" :class="{ 'col-3': !(currentUser && currentUser.isAdmin()) }">
            <div class="form-group me-2 w-100 col">
              <Field name="driver" type="search" v-slot="{ field, errorMessage, meta }" v-model="searchDriver">
                <input class="form-control form-control-sm me-2" type="search" v-model="field.value"
                       :placeholder="$t('common.placeholders.search')" v-bind="field" autocomplete="off"/>
                <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
              </Field>
            </div>
            <router-link :to="{ name: 'drivers.create'}" tag="a" class="btn btn-sm btn-primary btn-rounded float-end"
                         data-original-title="Create Driver">
              <em class="fas fa-plus"></em>
            </router-link>
        </div>
      </div>
      <div class="card-body px-0 pt-0 pb-2">
        <div class="table-responsive p-0">
          <table class="table align-items-center mb-0">
            <caption hidden></caption>
            <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('common.fields.name') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('common.fields.phone') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('drivers.fields.vehicle') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('drivers.fields.plate') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('common.fields.status') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('common.fields.createdAt') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('common.fields.lastConnection') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="driver in paginatedDrivers" :key="driver.id">
              <td class="py-0">
                <div class="d-flex px-2 py-1">
                  <div>
                    <img :src="driver.photoUrl" class="avatar avatar-sm me-3" alt="Profile image">
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ driver.name }}</h6>
                    <p class="text-xs text-secondary mb-0">{{ driver.email }}</p>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ driver.phone }}</p>
              </td>
              <td class="py-0">
                <div class="d-flex px-2 py-1">
                  <div>
                    <img :src="driver.vehicle.photoUrl" class="avatar avatar-sm me-3" alt="Profile image">
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ driver.vehicle.brand }}</h6>
                    <p class="text-xs text-secondary mb-0">{{ driver.vehicle.model }}</p>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ driver.vehicle.plate }}</p>
              </td>
              <td class="align-middle text-center text-sm">
                <span class="badge badge-sm"
                      :class="driver.enabled_at ? 'bg-gradient-success' : 'bg-gradient-danger'"
                >{{ $t(driver.enabled_at ? 'common.fields.enabled' : 'common.fields.disabled') }}</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">{{ format(driver.created_at) }}</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">{{ format(driver.last_connection) }}</span>
              </td>
              <td class="align-middle p-0">
                <div class="row row-cols-2 mx-2">
                  <div class="form-check form-switch col-2">
                    <input class="form-check-input" name="enable" type="checkbox" :checked="driver.isEnabled()"
                           :id="driver.id" @change="onEnable"/>
                  </div>
                  <div class="col-4">
                    <router-link
                      :to="{ name: 'drivers.edit', params: { id: driver.id } }"
                      tag="a"
                      class="btn btn-sm btn-info btn-rounded rounded-pill py-1 m-0"
                      data-original-title="Edit Driver">
                      <em class="fas fa-pencil"></em>
                    </router-link>
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="container text-center mt-2">
            <Paginator :data="filteredDrivers" :currentPage="currentPage" :perPage="30" @paginatedData="getPaginatedData"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DateHelper from '@/helpers/DateHelper'
import Paginator from '@/components/Paginator.vue'
import {useDriversStore} from '@/services/stores/DriversStore'
import { useDashboardStore } from '../../services/stores/dashboardStore'
import {Field} from 'vee-validate'
import Driver from '@/models/Driver'
import {onMounted, ref, Ref, watch, watchEffect} from 'vue'
import dayjs from 'dayjs'
import DriverRepository from '@/repositories/DriverRepository'
import i18n from '@/plugins/i18n'
import ToastService from '@/services/ToastService'
import {useLoadingState} from '@/services/stores/LoadingState'
import AuthService from '@/services/AuthService'
import { useRoute } from 'vue-router'
import { DriverPaymentMode } from '@/constants/DriverPaymentMode'

const {drivers, filter, findById} = useDriversStore()
const dashboardStore = useDashboardStore()
const route = useRoute()
const paginatedDrivers: Ref<Array<Driver>> = ref([])
const filteredDrivers: Ref<Array<Driver>> = ref([])
const {setLoading} = useLoadingState()
const searchDriver: Ref<string> = ref(route.query.search as string || dashboardStore.drivers.search)
const enabled: Ref<number> = ref(route.query.enabled ? Number(route.query.enabled) : dashboardStore.drivers.enabled)
const currentPage = ref(route.query.page ? Number(route.query.page) : dashboardStore.drivers.currentPage)
const paymentMode: Ref<DriverPaymentMode | false> = ref(false)
const currentUser = AuthService.getCurrentUser()

function format(unix: number): string {
  return DateHelper.unixToDate(unix, 'YYYY-MM-DD')
}

function getPaginatedData(data: any[], page: number): void {
  paginatedDrivers.value = data
  currentPage.value = page
  dashboardStore.setDriversState({
    ...dashboardStore.drivers,
    currentPage: page
  })
}

watchEffect(() => {
  const filtered = filter(searchDriver.value, enabled.value)
  filteredDrivers.value = filtered
  const totalPages = Math.ceil(filtered.length)
  if (currentPage.value > totalPages && totalPages > 0) {
    currentPage.value = 1
    dashboardStore.setDriversState({
      ...dashboardStore.drivers,
      currentPage: 1
    })
  }
})

watchEffect(() => {
  const filtered = filter(searchDriver.value, enabled.value);
  filteredDrivers.value.splice(0, filteredDrivers.value.length, ...filtered)
})

watchEffect(() => {
  const filtered = filter(searchDriver.value, enabled.value);
  filteredDrivers.value.splice(0, filteredDrivers.value.length, ...filtered)
})

watchEffect(() => {
  const filtered = filter(searchDriver.value, enabled.value, paymentMode.value);
  filteredDrivers.value.splice(0, filteredDrivers.value.length, ...filtered)
})

onMounted(() => {
  filteredDrivers.value.splice(0, filteredDrivers.value.length, ...(drivers))
})

watch([searchDriver, enabled, currentPage], () => {
  dashboardStore.setDriversState({
    search: searchDriver.value,
    enabled: enabled.value,
    currentPage: currentPage.value
  })
})

function onEnable(event: Event): void {
  setLoading(true)
  const target = event.target as HTMLInputElement
  const driver = findById(target.id) ?? new Driver()
  driver.enabled_at = target.checked ? dayjs().unix() : 0
  DriverRepository.enable(driver.id, driver.enabled_at).then(() => {
    setLoading(false)
    const message = driver.enabled_at == 0 ?
        i18n.global.t('users.messages.disabled') : i18n.global.t('users.messages.enabled')
    ToastService.toast(ToastService.SUCCESS, message)
  }).catch(e => {
    setLoading(false)
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}
</script>
<template>
  <div class="container-fluid">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <a class="nav-link active" id="pending-tab" data-bs-toggle="tab" data-bs-target="#pending" type="button"
                role="tab" aria-controls="pending" @click="currentTap = 'pending'" aria-selected="true">
          <div class="d-flex align-items-center">
            <div
                class="icon icon-shape icon-sm border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center"
                :class="{ 'shadow': currentTap === 'pending' }">
              <em class="fa-regular fa-clock"></em>
            </div>
            <span class="d-none d-sm-inline">{{ $t('services.statuses.pending') }}</span>
            <div class="p-1">
              <span class="badge badge-circle bg-danger" v-show="pendings.length > 0">{{ pendings.length }}</span>
            </div>
          </div>
        </a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link" id="progress-tab" data-bs-toggle="tab" data-bs-target="#progress" type="button"
                role="tab" aria-controls="progress" @click="currentTap = 'progress'" aria-selected="false">
          <div class="d-flex align-items-center">
            <div
                class="icon icon-shape icon-sm border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center"
                :class="{ 'shadow': currentTap === 'progress' }">
              <em class="fa-solid fa-spinner"></em>
            </div>
            <span class="d-none d-sm-inline">{{ $t('services.statuses.in_progress') }}</span>
            <div class="p-1">
              <span class="badge badge-circle bg-success" v-show="inProgress.length > 0">{{ inProgress.length }}</span>
            </div>
          </div>
        </a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link" id="history-tab" data-bs-toggle="tab" @click="currentTap = 'history'"
                data-bs-target="#history" type="button"
                role="tab"
                aria-controls="history" aria-selected="false">
          <div class="d-flex align-items-center">
            <div
                class="icon icon-shape icon-sm border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center"
                :class="{ 'shadow': currentTap === 'history' }">
              <em class="fa-regular fa-folder-open"></em>
            </div>
            <span class="d-none d-sm-inline">{{ $t('services.history') }}</span>
          </div>
        </a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link" id="map-tab" data-bs-toggle="tab" @click="currentTap = 'mapTab'"
                data-bs-target="#mapTab" type="button" role="tab"
                aria-controls="map" aria-selected="false">
          <div class="d-flex align-items-center">
            <div
                class="icon icon-shape icon-sm border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center"
                :class="{ 'shadow': currentTap === 'mapTab' }">
              <em class="fa-solid fa-map-location-dot"></em>
            </div>
            <span class="d-none d-sm-inline">{{ $t('common.placeholders.map') }}</span>
          </div>
        </a>
      </li>
    </ul>
    <div class="tab-content pt-2" id="myTabContent">
      <div class="tab-pane fade show active" id="pending" role="tabpanel" aria-labelledby="pending-tab">
        <create-service></create-service>
        <services-table :table="Tables.pendings" :services="pendings" @cancelService="cancel" :pagination="paginationPendings"></services-table>
      </div>
      <div class="tab-pane fade" id="progress" role="tabpanel" aria-labelledby="progress-tab">
        <div class="form-group me-2 col-sm-4">
          <input class="form-control form-control-sm me-2" type="search" v-model="searchService" name="search"
                 :placeholder="$t('common.placeholders.search')" autocomplete="off"/>
        </div>
        <services-table :table="Tables.inProgress" :services="filteredInProgress" @cancelService="cancel"
                        @endService="end"
                        @releaseService="release" :pagination="paginationInProgress"></services-table>
      </div>
      <div class="tab-pane fade" id="history" role="tabpanel" aria-labelledby="history-tab">
        <History v-if="currentTap === 'history'"></History>
      </div>
      <div class="tab-pane fade card card-body" id="mapTab" role="tabpanel" aria-labelledby="map-tab">
        <DriverMap v-if="currentTap === 'mapTab'"/>
      </div>
    </div>
    <AssignDriver :drivers="drivers"></AssignDriver>
  </div>
</template>

<script setup lang="ts">
import CreateService from '@/components/services/CreateService.vue'
import ServicesTable from '@/components/services/ServicesTable.vue'
import ServiceRepository from '@/repositories/ServiceRepository'
import Service from '@/models/Service'
import ToastService from '@/services/ToastService'
import AssignDriver from '@/components/services/AssingDriver.vue'
import {onMounted, reactive, ref, Ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {storeToRefs} from 'pinia'
import {useDriversStore} from '@/services/stores/DriversStore'
import DriverMap from '@/components/DriverMap.vue'
import History from '@/components/services/History.vue'
import {useServicesStore} from '@/services/stores/ServiceStore'
import {Tables} from '@/constants/Tables'
import {ServiceList} from '@/models/ServiceList'
import {Pagination} from "@/types/Pagination";

const {t} = useI18n()
const driverStore = useDriversStore()
const {pendings, inProgress} = storeToRefs(useServicesStore())
const {filterInProgressServices} = useServicesStore()
const {drivers} = storeToRefs(driverStore)
const currentTap: Ref<string> = ref('pendings')
const searchService: Ref<string> = ref('')
const filteredInProgress: Ref<Array<ServiceList>> = ref([])
const paginationInProgress = reactive<Pagination>({
  totalCount: 0,
  currentPage: 1,
  perPage: 20
})
const paginationPendings = reactive<Pagination>({
  totalCount: 0,
  currentPage: 1,
  perPage: 20
})

watch(pendings, (newPendings) => {
  paginationPendings.totalCount = newPendings.length
})
watch(searchService, (search) => {
  filteredInProgress.value.splice(0, filteredInProgress.value.length)
  if (search.length > 2) {
    filterInProgressServices(search).forEach(service => {
      filteredInProgress.value.push(service)
      paginationInProgress.totalCount = filteredInProgress.value.length
    })
  } else {
    inProgress.value.forEach(service => {
      filteredInProgress.value.push(service)
      paginationInProgress.totalCount = filteredInProgress.value.length
    })
  }
})

watch(inProgress.value, (services) => {
  if (searchService.value.length <= 2) {
    filteredInProgress.value.splice(0, filteredInProgress.value.length)
    services.forEach(service => {
      filteredInProgress.value.push(service)
      paginationInProgress.totalCount = filteredInProgress.value.length
    })
  }
})

function cancel(serviceId: string): void {
  ServiceRepository.updateStatus(serviceId, Service.STATUS_CANCELED).then(async () => {
    await ToastService.toast(ToastService.SUCCESS, t('common.messages.updated'))
  }).catch(async (e) => {
    await ToastService.toast(ToastService.ERROR, t('common.messages.error'), e.message)
  })
}

function release(service: Service): void {
  if (!service.driver_id) return
  ServiceRepository.release(service.id, service.driver_id).then(async () => {
    await ToastService.toast(ToastService.SUCCESS, t('common.messages.updated'))
  }).catch(async (e) => {
    await ToastService.toast(ToastService.ERROR, t('common.messages.error'), e.message)
  })
}

function end(serviceId: string): void {
  ServiceRepository.updateStatus(serviceId, Service.STATUS_TERMINATED).then(async () => {
    await ToastService.toast(ToastService.SUCCESS, t('common.messages.updated'))
  }).catch(async (e) => {
    await ToastService.toast(ToastService.ERROR, t('common.messages.error'), e.message)
  })
}

onMounted(() => {
  filteredInProgress.value.splice(0, filteredInProgress.value.length)
  inProgress.value.forEach(service => {
    filteredInProgress.value.push(service)
  })
})
</script>
<template>
  <div class="container-fluid">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="pending-tab" data-bs-toggle="tab" data-bs-target="#pending" type="button"
                role="tab" aria-controls="pending" @click="currentTap = 'pending'" aria-selected="true">
          {{ $t('services.statuses.pending') }}
          <span class="badge badge-circle bg-danger"
                v-show="pendings.length > 0">{{ pendings.length }}</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="progress-tab" data-bs-toggle="tab" data-bs-target="#progress" type="button"
                role="tab" aria-controls="progress" @click="currentTap = 'progress'" aria-selected="false">
          {{ $t('services.statuses.in_progress') }}
          <span class="badge badge-circle bg-success"
                v-show="inProgress.length > 0">{{ inProgress.length }}</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="history-tab" data-bs-toggle="tab" @click="currentTap = 'history'"
                data-bs-target="#history" type="button"
                role="tab"
                aria-controls="history" aria-selected="false">{{ $t('services.history') }}
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="map-tab" data-bs-toggle="tab" @click="currentTap = 'mapTab'"
                data-bs-target="#mapTab" type="button" role="tab"
                aria-controls="map" aria-selected="false">{{ $t('common.placeholders.map') }}
        </button>
      </li>
    </ul>
    <div class="tab-content pt-2" id="myTabContent">
      <div class="tab-pane fade show active" id="pending" role="tabpanel" aria-labelledby="pending-tab">
        <create-service></create-service>
        <services-table :table="Tables.pendings" :services="pendings" @cancelService="cancel"></services-table>
      </div>
      <div class="tab-pane fade" id="progress" role="tabpanel" aria-labelledby="progress-tab">
        <div class="form-group me-2 w-100 col">
          <Field name="driver" type="search" v-slot="{ field, errorMessage, meta }" v-model="searchService">
            <input class="form-control form-control-sm me-2" type="search" v-model="field.value"
                   :placeholder="$t('common.placeholders.search')" v-bind="field" autocomplete="off"/>
            <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
          </Field>
        </div>
        <services-table :table="Tables.inProgress" :services="filteredInProgress" @cancelService="cancel"
                        @endService="end"
                        @releaseService="release"></services-table>
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
import {onMounted, ref, Ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {storeToRefs} from 'pinia'
import {useDriversStore} from '@/services/stores/DriversStore'
import DriverMap from '@/components/DriverMap.vue'
import History from '@/components/services/History.vue'
import {useServicesStore} from '@/services/stores/ServiceStore'
import {Tables} from '@/constants/Tables'
import {ServiceList} from '@/models/ServiceList'
import {Field} from 'vee-validate'

const {t} = useI18n()
const driverStore = useDriversStore()
const {pendings, inProgress} = storeToRefs(useServicesStore())
const {filterInProgressServices} = useServicesStore()
const {drivers} = storeToRefs(driverStore)
const currentTap: Ref<string> = ref('pendings')
const searchService: Ref<string> = ref('')
const filteredInProgress: Ref<Array<ServiceList>> = ref([])

watch(searchService, (search) => {
  filteredInProgress.value.splice(0, filteredInProgress.value.length)
  if (search.length > 2) {
    filterInProgressServices(search).forEach(service => {
      filteredInProgress.value.push(service)
    })
  } else {
    inProgress.value.forEach(service => {
      filteredInProgress.value.push(service)
    })
  }
})

watch(inProgress.value, (services) => {
  if (searchService.value.length <= 2) {
    filteredInProgress.value.splice(0, filteredInProgress.value.length)
    services.forEach(service => {
      filteredInProgress.value.push(service)
    })
  }
})

function cancel(serviceId: string): void {
  ServiceRepository.updateStatus(serviceId, Service.STATUS_CANCELED).then(() => {
    ToastService.toast(ToastService.SUCCESS, t('common.messages.updated'))
  }).catch(e => {
    ToastService.toast(ToastService.ERROR, t('common.messages.error'), e.message)
  })
}

function release(service: Service): void {
  service.status = Service.STATUS_PENDING
  service.driver_id = null
  service.applicants = null
  service.metadata = null
  ServiceRepository.update(service).then(() => {
    ToastService.toast(ToastService.SUCCESS, t('common.messages.updated'))
  }).catch(e => {
    ToastService.toast(ToastService.ERROR, t('common.messages.error'), e.message)
  })
}

function end(serviceId: string): void {
  ServiceRepository.updateStatus(serviceId, Service.STATUS_TERMINATED).then(() => {
    ToastService.toast(ToastService.SUCCESS, t('common.messages.updated'))
  }).catch(e => {
    ToastService.toast(ToastService.ERROR, t('common.messages.error'), e.message)
  })
}

onMounted(() => {
  filteredInProgress.value.splice(0, filteredInProgress.value.length)
  inProgress.value.forEach(service => {
    filteredInProgress.value.push(service)
  })
})
</script>
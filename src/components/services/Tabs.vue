<template>
  <div class="container-fluid">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="pending-tab" data-bs-toggle="tab" data-bs-target="#pending" type="button"
                role="tab" aria-controls="pending" aria-selected="true">{{ $t('services.statuses.pending') }}
          <span class="badge badge-circle bg-danger"
                v-show="services.pending.length > 0">{{ services.pending.length }}</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="progress-tab" data-bs-toggle="tab" data-bs-target="#progress" type="button"
                role="tab" aria-controls="progress" aria-selected="false">{{ $t('services.statuses.in_progress') }}
          <span class="badge badge-circle bg-success"
                v-show="services.inProgress.length > 0">{{ services.inProgress.length }}</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="history-tab" data-bs-toggle="tab" data-bs-target="#history" type="button"
                role="tab"
                aria-controls="history" aria-selected="false">{{ $t('services.history') }}
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="map-tab" data-bs-toggle="tab" data-bs-target="#mapTab" type="button" role="tab"
                aria-controls="map" aria-selected="false">{{ $t('common.placeholders.map') }}
        </button>
      </li>
    </ul>
    <div class="tab-content pt-2" id="myTabContent">
      <div class="tab-pane fade show active" id="pending" role="tabpanel" aria-labelledby="pending-tab">
        <create-service></create-service>
        <services-table :drivers="drivers" :services="services.pending" @cancelService="cancel"></services-table>
      </div>
      <div class="tab-pane fade" id="progress" role="tabpanel" aria-labelledby="progress-tab">
        <services-table :drivers="drivers" :services="services.inProgress" @cancelService="cancel" @endService="end"
                        @releaseService="release"></services-table>
      </div>
      <div class="tab-pane fade" id="history" role="tabpanel" aria-labelledby="history-tab">
        <services-table :drivers="drivers" :isHistory="true" :services="services.history"></services-table>
      </div>
      <div class="tab-pane fade card card-body" id="mapTab" role="tabpanel" aria-labelledby="map-tab">
        <DriverMap/>
      </div>
    </div>
    <AssignDriver :drivers="drivers"></AssignDriver>
  </div>
</template>

<script setup lang="ts">
import CreateService from '@/components/services/CreateService.vue'
import ServicesTable from '@/components/services/ServicesTable.vue'
import ServiceRepository from '@/repositories/ServiceRepository'
import {DataSnapshot} from 'firebase/database'
import dayjs from 'dayjs'
import Service from '@/models/Service'
import ToastService from '@/services/ToastService'
import AssignDriver from '@/components/services/AssingDriver.vue'
import {onBeforeMount, reactive, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {storeToRefs} from 'pinia'
import {useDriversStore} from '@/services/stores/DriversStore'
import DriverMap from '@/components/DriverMap.vue'

const {t} = useI18n()
const driverStore = useDriversStore()
const {drivers} = storeToRefs(driverStore)
const services = reactive({
  pending: Array<Service>(),
  inProgress: Array<Service>(),
  history: Array<Service>()
})

function onServiceAdded(data: DataSnapshot): void {
  const service = new Service()
  Object.assign(service, data.val())
  service.id = data.key as string
  services.history.unshift(service)
}

function onServiceChanged(data: DataSnapshot): void {
  const service = new Service()
  Object.assign(service, data.val())
  services.history[services.history.findIndex(serv => serv.id === service.id)] = service
}

watch(services.history,(newServices) => {
  services.pending.splice(0,services.pending.length)
  newServices.forEach(service => {
    if (service.status == Service.STATUS_PENDING) services.pending.push(service)
  })
})

watch(services.history,(newServices) => {
  services.inProgress.splice(0,services.inProgress.length)
  newServices.forEach(service => {
    if (service.status == Service.STATUS_IN_PROGRESS) services.inProgress.push(service)
  })
})

onBeforeMount((): void => {
  ServiceRepository.serviceListener(onServiceAdded, onServiceChanged, dayjs().subtract(1, 'day').unix())
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
</script>
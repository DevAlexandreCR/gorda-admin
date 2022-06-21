<template>
  <div class="container-fluid">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="pending-tab" data-bs-toggle="tab" data-bs-target="#pending" type="button"
                role="tab" aria-controls="pending" aria-selected="true">{{ $t('services.statuses.pending') }}
          <span class="badge badge-circle bg-danger"
                v-show="pendingServices.length > 0">{{ pendingServices.length }}</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="progress-tab" data-bs-toggle="tab" data-bs-target="#progress" type="button"
                role="tab" aria-controls="progress" aria-selected="false">{{ $t('services.statuses.in_progress') }}
          <span class="badge badge-circle bg-success"
                v-show="inProgressServices.length > 0">{{ inProgressServices.length }}</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="history-tab" data-bs-toggle="tab" data-bs-target="#history" type="button"
                role="tab"
                aria-controls="history" aria-selected="false">{{ $t('services.history') }}
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="map-tab" data-bs-toggle="tab" data-bs-target="#map" type="button" role="tab"
                aria-controls="map" aria-selected="false">{{ $t('common.placeholders.map') }}
        </button>
      </li>
    </ul>
    <div class="tab-content pt-2" id="myTabContent">
      <div class="tab-pane fade show active" id="pending" role="tabpanel" aria-labelledby="pending-tab">
        <create-service></create-service>
        <services-table :drivers="drivers" :services="pendingServices" @cancelService="cancel"></services-table>
      </div>
      <div class="tab-pane fade" id="progress" role="tabpanel" aria-labelledby="progress-tab">
        <services-table :drivers="drivers" :services="inProgressServices" @cancelService="cancel" @endService="end"
                        @releaseService="release"></services-table>
      </div>
      <div class="tab-pane fade" id="history" role="tabpanel" aria-labelledby="history-tab">
        <services-table :drivers="drivers" :isHistory="true" :services="historyServices"></services-table>
      </div>
      <div class="tab-pane fade" id="map" role="tabpanel" aria-labelledby="map-tab">...</div>
    </div>
    <AssignDriver :drivers="drivers"></AssignDriver>
  </div>
</template>

<script setup lang="ts">
import CreateService from '@/components/services/CreateService.vue'
import ServicesTable from '@/components/services/ServicesTable.vue'
import {ServiceInterface} from '@/types/ServiceInterface'
import ServiceRepository from '@/repositories/ServiceRepository'
import {DataSnapshot} from 'firebase/database'
import dayjs from 'dayjs'
import Service from '@/models/Service'
import ToastService from '@/services/ToastService'
import AssignDriver from '@/components/services/AssingDriver.vue'
import Driver from '@/models/Driver'
import DriverRepository from '@/repositories/DriverRepository'
import {onBeforeMount, ref, Ref} from 'vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

const pendingServices: Ref<Array<ServiceInterface>> = ref([])
const inProgressServices: Ref<Array<ServiceInterface>> = ref([])
const historyServices: Ref<Array<ServiceInterface>> = ref([])
const drivers: Ref<Array<Driver>> = ref([])

function onServiceAdded(data: DataSnapshot): void {
  const service = new Service()
  Object.assign(service, data.val())
  service.id = data.key as string
  historyServices.value.unshift(service)
  setServiceOnChange(service)
}

function onServiceChanged(data: DataSnapshot): void {
  const service = new Service()
  Object.assign(service, data.val())
  setServiceOnChange(service)
}

function setServiceOnChange(service: Service): void {
  switch (service.status) {
    case Service.STATUS_PENDING:
      pendingServices.value = pendingServices.value.filter(serv => {
        return serv.id != service.id
      })
      inProgressServices.value = inProgressServices.value.filter(serv => {
        return serv.id != service.id
      })
      pendingServices.value.unshift(service)
      break
    case Service.STATUS_IN_PROGRESS:
      inProgressServices.value.unshift(service)
      pendingServices.value = pendingServices.value.filter(serv => {
        return serv.id !== service.id
      })
      break
    default:
      inProgressServices.value = inProgressServices.value.filter(serv => {
        return serv.id !== service.id
      })
      pendingServices.value = pendingServices.value.filter(serv => {
        return serv.id !== service.id
      })
      historyServices.value[historyServices.value.findIndex(serv => serv.id === service.id)].status = service.status
      break
  }
}

onBeforeMount((): void => {
  ServiceRepository.serviceListener(onServiceAdded, onServiceChanged, dayjs().subtract(1, 'day').unix())
  DriverRepository.getAll().then(dbDrivers => {
    dbDrivers.forEach(driver => {
      const driverTmp = new Driver()
      Object.assign(driverTmp, driver)
      drivers.value.push(driverTmp)
    })
  })
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
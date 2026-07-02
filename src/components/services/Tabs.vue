<template>
  <div class="container-fluid">
    <ul class="nav nav-tabs service-tabs" id="myTab">
      <li class="nav-item">
        <a class="nav-link active" id="pending-tab" data-bs-toggle="tab" data-bs-target="#pending" type="button"
                role="tab" aria-controls="pending" @click="currentTap = 'pending'" aria-selected="true">
          <div class="d-flex align-items-center">
            <span>{{ $t('services.statuses.pending') }}</span>
            <span class="badge badge-circle tab-count" v-show="pendings.length > 0">{{ pendings.length }}</span>
          </div>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="progress-tab" data-bs-toggle="tab" data-bs-target="#progress" type="button"
                role="tab" aria-controls="progress" @click="currentTap = 'progress'" aria-selected="false">
          <div class="d-flex align-items-center">
            <span>{{ $t('services.statuses.in_progress') }}</span>
            <span class="badge badge-circle tab-count" v-show="inProgress.length > 0">{{ inProgress.length }}</span>
          </div>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="history-tab" data-bs-toggle="tab" @click="currentTap = 'history'"
                data-bs-target="#history" type="button"
                role="tab"
                aria-controls="history" aria-selected="false">
          <div class="d-flex align-items-center">
            <span>{{ $t('services.history') }}</span>
          </div>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="map-tab" data-bs-toggle="tab" @click="currentTap = 'mapTab'"
                data-bs-target="#mapTab" type="button" role="tab"
                aria-controls="map" aria-selected="false">
          <div class="d-flex align-items-center">
            <span>{{ $t('common.placeholders.map') }}</span>
          </div>
        </a>
      </li>
    </ul>
    <div class="tab-content pt-2" id="myTabContent">
      <div class="tab-pane fade show active" id="pending" role="tabpanel" aria-labelledby="pending-tab">
        <create-service></create-service>
        <services-table :table="Tables.pendings" :services="pendings" @cancelService="cancel" @restartService="restart" :pagination="paginationPendings"></services-table>
      </div>
      <div class="tab-pane fade" id="progress" role="tabpanel" aria-labelledby="progress-tab">
        <services-table :table="Tables.inProgress" :services="filteredInProgress" @cancelService="cancel"
                        @endService="end"
                        @releaseService="release" :pagination="paginationInProgress">
          <template #actions>
            <div class="gorda-inprogress-search">
              <em class="fas fa-magnifying-glass"></em>
              <input type="search" v-model="searchService" name="search"
                     :placeholder="$t('common.placeholders.search')" autocomplete="off"/>
            </div>
          </template>
        </services-table>
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
  ServiceRepository.release(service.id).then(async () => {
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

function restart(service: ServiceList): void {
  if (service.driver_id) {
    ToastService.toast(ToastService.ERROR, t('common.messages.error'), t('services.messages.driver_assigned'))
    return
  }
  if (hasApplicants(service)) {
    ToastService.toast(ToastService.ERROR, t('common.messages.error'), t('services.messages.has_applicants'))
    return
  }
  ServiceRepository.restart(service).then(async () => {
    await ToastService.toast(ToastService.SUCCESS, t('common.messages.created'))
  }).catch(async (e) => {
    await ToastService.toast(ToastService.ERROR, t('common.messages.error'), e.message)
  })
}

function hasApplicants(service: ServiceList): boolean {
  const applicants = service.applicants as unknown
  if (!applicants) return false
  if (Array.isArray(applicants)) return applicants.length > 0
  if (typeof applicants === 'object') return Object.keys(applicants as Record<string, unknown>).length > 0
  return true
}

onMounted(() => {
  filteredInProgress.value.splice(0, filteredInProgress.value.length)
  inProgress.value.forEach(service => {
    filteredInProgress.value.push(service)
  })
})
</script>

<style scoped>
.service-tabs {
  border-bottom: none;
  gap: 0.5rem;
  align-items: center;
}

.service-tabs .nav-link {
  background-color: transparent;
  color: var(--text-muted);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 700;
  padding: 0.5rem 1rem;
  box-shadow: none;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.service-tabs .nav-link:hover {
  color: var(--primary);
  border: none;
}

.service-tabs .nav-link.active {
  background-color: var(--surface-card);
  color: var(--primary);
  border: none;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.service-tabs .tab-count {
  margin-left: 0.5rem;
  border-radius: var(--radius-pill);
  background-color: rgba(131, 146, 171, .18);
  color: var(--text-muted);
  font-weight: 700;
}

.service-tabs .nav-link.active .tab-count {
  background-color: var(--primary);
  color: #ffffff;
}

.gorda-inprogress-search {
  display: flex;
  align-items: center;
  gap: .5rem;
  background: var(--surface-input);
  border: 1px solid var(--border-subtle);
  border-radius: .5rem;
  padding: .4rem .75rem;
  min-width: 240px;
}

.gorda-inprogress-search em {
  color: var(--text-secondary);
  font-size: .8rem;
}

.gorda-inprogress-search input {
  border: none;
  outline: none;
  background: transparent;
  font-size: .8rem;
  color: var(--text-body);
  width: 100%;
}
</style>

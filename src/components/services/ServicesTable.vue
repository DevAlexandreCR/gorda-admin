<template>
  <div class="card px-2 py-1">
    <div class="table-responsive">
      <table class="table table-sm table-borderless align-items-center mb-0">
        <caption hidden></caption>
        <thead>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 w-2">#</th>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">{{ $t('services.fields.hour') }}</th>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">{{ $t('services.fields.status') }}</th>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">{{ $t('services.fields.start_address') }}</th>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2" v-if="showDestination">{{ $t('services.fields.end_address') }}</th>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">{{ $t('services.fields.phone') }}</th>
        <th  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2" >{{ $t('services.fields.name') }}</th>
        <th  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2" >{{ $t('services.fields.comment') }}</th>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2" v-if="showDriverColumn">{{ $t('services.fields.driver') }}</th>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2" v-if="showDriverNameColumn">{{ $t('services.fields.driver_name') }}</th>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2" v-if="showActionColumn"></th>
        </thead>
        <tbody class="text-sm text-opacity-25"  v-if="paginatedServices.length > 0">
        <tr v-for="(service, index) in paginatedServices" :key="service.id">
          <td class="text-secondary font-weight-bolder opacity-7 text-center">{{ index + 1 }}</td>
          <td class="py-1 col-1">{{ props.table === Tables.history ? format(service.created_at) : DateHelper.aGo(service.a_go) }}</td>
          <td class="py-1">{{ $t('services.statuses.' + service.status) }}</td>
          <td class="py-1">{{ service.start_loc?.name }}</td>
          <td class="py-1" v-if="showDestination">{{ service.end_loc?.name ?? 'N/A' }}</td>
          <td class="py-1">{{ service.phone }}</td>
          <td class="py-1">{{ service.name }}</td>
          <td class="py-1 text-truncate" style="max-width: 100px" data-bs-target="tooltip"
            :title="service.comment" data-bs-placement="top">{{ service.comment ?? 'N/A' }}</td>
          <td class="py-1" v-if="showDriverColumn && service.driver">
            <div class="d-flex px-2 py-0">
              <div>
                <img :src="service.driver.photoUrl" class="avatar avatar-sm my-0 me-3"
                     alt="Profile">
              </div>
              <div class="d-flex flex-column justify-content-center">
                <h6 class="my-0 text-sm">{{ service.driver.vehicle.plate }}</h6>
                <p class="text-xs text-secondary my-0">{{ service.driver.phone }}</p>
              </div>
            </div>
          </td>
          <td v-else-if="showDriverColumn"></td>
          <td class="py-1 text-truncate" v-if="showDriverNameColumn && service.driver" style="max-width: 100px" data-bs-target="tooltip"
              :title="service.driver.name" data-bs-placement="top">{{ service.driver.name }}</td>
          <td v-else-if="showDriverNameColumn"></td>
          <td class="py-1 col-1" v-if="showActionColumn">
            <button class="btn btn-sm btn-danger btn-rounded py-1 px-2 mx-1 my-0" @click="cancel(service)" v-if="props.table !== Tables.history"
                    data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('common.actions.cancel')">
              <em class="fas fa-ban"></em></button>
            <button class="btn btn-sm btn-info btn-rounded py-1 px-2 mx-1 my-0" v-if="props.table === Tables.pendings && !service.driver_id" @click="restart(service)"
                    data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('common.actions.restart')" :disabled="hasApplicants(service)">
              <em class="fas fa-rotate-left"></em></button>
            <span v-if="props.table === Tables.pendings && applicantsCount(service) > 0" class="badge bg-info text-white mx-1"
                  :title="$t('services.messages.has_applicants')">{{ applicantsCount(service) }}</span>
            <button class="btn btn-sm btn-secondary btn-rounded py-1 px-2 mx-1 my-0" v-if="service.isPending() && props.table !== Tables.history"
              data-bs-placement="top" :title="$t('common.actions.assign')"  data-bs-toggle="modal" :id="service.id" data-bs-target="#driverModal">
              <em class="fas fa-car"></em></button>
            <button class="btn btn-sm btn-dark btn-rounded py-1 px-2 mx-1 my-0" v-if="service.isInProgress() && props.table !== Tables.history" @click="release(service)"
                    data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('common.actions.release')">
              <em class="fas fa-car-crash"></em></button>
            <button class="btn btn-sm btn-dark btn-rounded py-1 px-2 mx-1 my-0" v-if="service.isInProgress() && props.table !== Tables.history" @click="end(service)"
                    data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('common.actions.terminate')">
              <em class="fas fa-check"></em></button>
            <button class="btn btn-sm btn-dark btn-rounded py-1 px-2 mx-1 my-0" @click="show(service)" v-if="props.table === Tables.history"
                    :title="$t('common.actions.see')">
              <em class="fas fa-eye"></em></button>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-if="props.table === Tables.history" class="container-fluid mt-2">
        <DBPaginator :pagination="props.pagination" @paginatedData="paginatedData"/>
      </div>
      <div v-else class="container-fluid mt-2">
        <Paginator :data="props.services" :perPage="pagination.perPage" @paginatedData="getPaginatedData"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DateHelper from '@/helpers/DateHelper'
import Paginator from '@/components/Paginator'
import Service from '@/models/Service'
import {onBeforeUnmount, onMounted, ref, Ref, watch, computed} from 'vue'
import {ServiceList} from '@/models/ServiceList'
import {Tables} from '@/constants/Tables'
import DBPaginator from '@/components/DBPaginator.vue'
import {Pagination} from '@/types/Pagination'
import {ServiceCursor} from '@/types/ServiceCursor'


interface Props {
  services: Array<ServiceList>
  table: Tables
  pagination: Pagination
}

const props = defineProps<Props>()
const emit = defineEmits([
  Service.EVENT_CANCEL,
  Service.EVENT_RELEASE,
  Service.EVENT_TERMINATE,
  'paginate',
  Service.EVENT_SHOW,
  Service.EVENT_RESTART
])
let interval: number
const paginatedServices: Ref<Array<ServiceList>> = ref(Array<ServiceList>())
const showDestination = computed(() => props.table === Tables.pendings)
const showDriverColumn = computed(() => props.table !== Tables.pendings)
const showDriverNameColumn = computed(() => props.table !== Tables.pendings && props.table !== Tables.inProgress && props.table !== Tables.history)
const showActionColumn = computed(() => true)

watch(props.services, (newServices) => {
  paginatedServices.value = Array.from(newServices)
})


onMounted(() => {
  paginatedServices.value = Array.from(props.services)
  if(props.table !== Tables.history) interval = window.setInterval(getTime, 1000)
})

onBeforeUnmount(() => {
  window.clearInterval(interval)
})

function format(unix: number): string {
  return DateHelper.unixToDate(unix, 'MM-DD HH:mm:ss')
}

function cancel(service: Service): void {
  emit(Service.EVENT_CANCEL, service.id)
}

function release(service: ServiceList): void {
  service.driver = null
  emit(Service.EVENT_RELEASE, service)
}

function end(service: Service): void {
  emit(Service.EVENT_TERMINATE, service.id)
}

function show(service: Service): void {
  emit(Service.EVENT_SHOW, service)
}

function restart(service: ServiceList): void {
  emit(Service.EVENT_RESTART, service)
}

function applicantsCount(service: ServiceList): number {
  const applicants = service.applicants as unknown
  if (!applicants) return 0
  if (Array.isArray(applicants)) return applicants.length
  if (typeof applicants === 'object') return Object.keys(applicants as Record<string, unknown>).length
  return 1
}

function hasApplicants(service: ServiceList): boolean {
  return applicantsCount(service) > 0
}

function getPaginatedData(data: []): void {
  paginatedServices.value = data
}

function paginatedData(page: number, next: boolean): void {
  const services = props.services;
  const cursor: ServiceCursor = {
    id: next ? services[services.length - 1].id : services[0].id,
    created: next ? services[services.length - 1].created_at : services[0].created_at,
  }
  emit('paginate', page, cursor, next)
}
function getTime(): void {
  paginatedServices.value.forEach(service => {
    service.a_go  = DateHelper.unix() - service.created_at
  })
}
</script>

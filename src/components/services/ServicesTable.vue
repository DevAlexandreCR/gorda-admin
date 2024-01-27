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
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">{{ $t('services.fields.phone') }}</th>
        <th  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2" >{{ $t('services.fields.name') }}</th>
        <th  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2" >{{ $t('services.fields.comment') }}</th>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">{{ $t('services.fields.driver') }}</th>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2" v-if="props.table !== Tables.pendings">{{ $t('services.fields.driver_name') }}</th>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2" v-if="props.table !== Tables.history"></th>
        </thead>
        <tbody class="text-sm text-opacity-25">
        <tr v-for="(service, index) in paginatedServices" :key="service.id">
          <td class="text-secondary font-weight-bolder opacity-7 text-center">{{ index+1 }}</td>
          <td class="py-1 col-1">{{ props.table === Tables.history ? format(service.created_at) : DateHelper.aGo(service.a_go) }}</td>
          <td class="py-1">{{ $t('services.statuses.' + service.status) }}</td>
          <td class="py-1">{{ service.start_loc?.name }}</td>
          <td class="py-1">{{ service.phone }}</td>
          <td class="py-1">{{ service.name }}</td>
          <td class="py-1 text-truncate" style="max-width: 100px" data-bs-target="tooltip"
            :title="service.comment" data-bs-placement="top">{{ service.comment ?? 'N/A' }}</td>
          <td class="py-1" v-if="service.driver">
            <div class="d-flex px-2 py-0">
              <div>
                <img :src="service.driver.photoUrl" class="avatar avatar-sm my-0 me-3"
                     alt="Profile image">
              </div>
              <div class="d-flex flex-column justify-content-center">
                <h6 class="my-0 text-sm">{{ service.driver.vehicle.plate }}</h6>
                <p class="text-xs text-secondary my-0">{{ service.driver.phone }}</p>
              </div>
            </div>
          </td>
          <td class="py-1 text-truncate" v-if="service.driver" style="max-width: 100px" data-bs-target="tooltip"
              :title="service.driver.name" data-bs-placement="top">{{ service.driver.name }}</td>
          <td class="py-1" v-else>
              <button class="btn btn-link py-1 my-0" data-bs-placement="top"  data-bs-toggle="modal" :id="service.id" v-if="props.table !== Tables.history"
                data-bs-target="#driverModal">{{ $t('common.actions.assign') }}</button></td>
          <td class="py-1 col-1" v-show="props.table !== Tables.history">
            <button class="btn btn-sm btn-danger btn-rounded py-1 px-2 mx-1 my-0" @click="cancel(service)"
                    data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('common.actions.cancel')">
              <em class="fas fa-ban"></em></button>
            <button class="btn btn-sm btn-secondary btn-rounded py-1 px-2 mx-1 my-0" v-if="service.isPending()"
              data-bs-placement="top" :title="$t('common.actions.assign')"  data-bs-toggle="modal" :id="service.id" data-bs-target="#driverModal">
              <em class="fas fa-car"></em></button>
            <button class="btn btn-sm btn-dark btn-rounded py-1 px-2 mx-1 my-0" v-if="service.isInProgress()" @click="release(service)"
                    data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('common.actions.release')">
              <em class="fas fa-car-crash"></em></button>
            <button class="btn btn-sm btn-dark btn-rounded py-1 px-2 mx-1 my-0" v-if="service.isInProgress()" @click="end(service)"
                    data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('common.actions.terminate')">
              <em class="fas fa-check"></em></button>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="container-fluid mt-2">
        <Paginator :data="props.services" :perPage="20" @paginatedData="getPaginatedData"/>
      </div>
      <div class="container-fluid mt-2">
    <OptimePaginator :totalCount="props.pagination.totalCount" :perPage="props.pagination.perPage"
                     :currentPage="props.pagination.currentPage" :data="props.services" @paginatedData="getPaginatedData"/>
  </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DateHelper from '@/helpers/DateHelper'
import Paginator from '@/components/Paginator'
import Service from '@/models/Service'
import { ref, Ref, onBeforeUnmount, onMounted, watch, defineProps, defineEmits } from 'vue'
import { ServiceList } from '@/models/ServiceList'
import { Tables } from '@/constants/Tables'
import OptimePaginator from '@/components/OptimiPaginator'
import {useServicesStore} from "@/services/stores/ServiceStore";
import {Pagination} from '@/types/Pagination'


interface Props {
  services: Array<ServiceList>
  table: Tables
  pagination: Pagination
}

const { getHistoryServices, pagination } = useServicesStore()
const props = defineProps<Props>()
const emit = defineEmits([Service.EVENT_CANCEL, Service.EVENT_RELEASE, Service.EVENT_TERMINATE])
let interval: number
const paginatedServices: Ref<Array<Service>> = ref([])
const dataServices: Ref<Array<Service>> = ref([])

watch(props.services, (newServices) => {
  dataServices.value = Array.from(newServices)
})


onMounted(() => {
  if (props.table !== Tables.history) interval = window.setInterval(getTime, 1000)
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

function getPaginatedData(page: number): void {
  pagination.currentPage = page
  getHistoryServices()
}

function getTime(): void {
  paginatedServices.value.forEach(service => {
    service.a_go  = DateHelper.unix() - service.created_at
  })
}
</script>


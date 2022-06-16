<template>
  <div class="card px-2 py-1">
    <div class="table-responsive">
      <table class="table table-sm table-borderless align-items-center mb-0">
        <caption hidden></caption>
        <thead>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">{{ $t('services.fields.hour') }}</th>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">{{ $t('services.fields.status') }}</th>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">{{ $t('services.fields.start_address') }}</th>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">{{ $t('services.fields.phone') }}</th>
        <th  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2" >{{ $t('services.fields.name') }}</th>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">{{ $t('services.fields.driver') }}</th>
        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"></th>
        </thead>
        <tbody>
        <tr v-for="service of services" :key="service.id">
          <td>{{ format(service.created_at) }}</td>
          <td>{{ $t('services.statuses.' + service.status) }}</td>
          <td>{{ service.start_address }}</td>
          <td>{{ service.start_loc.name }}</td>
          <td>{{ service.phone }}</td>
          <td>{{ service.name }}</td>
          <td v-if="getDriver(service.driver_id)">
                <div class="d-flex px-2 py-1">
                  <div>
                    <img :src="getDriver(service.driver_id).photoUrl" class="avatar avatar-sm me-3" alt="Profile image">
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ getDriver(service.driver_id).vehicle.plate }}</h6>
                    <p class="text-xs text-secondary mb-0">{{ getDriver(service.driver_id).phone }}</p>
                  </div>
                </div>
              </td>
              <td v-else>   
              <button class="btn btn-link" data-bs-placement="top"  data-bs-toggle="modal" :id="service.id" 
                data-bs-target="#driverModal">{{ $t('common.actions.assign') }}</button></td>
          <td v-if="!isHistory">
            <button class="btn btn-sm btn-danger btn-rounded py-1 px-2 mx-1" @click="cancel(service)"
                    data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('common.actions.cancel')">
              <em class="fas fa-ban"></em></button>
            <button class="btn btn-sm btn-secondary btn-rounded py-1 px-2 mx-1" v-if="service.isPending()" 
              data-bs-placement="top" :title="$t('common.actions.assign')"  data-bs-toggle="modal" :id="service.id" data-bs-target="#driverModal">
              <em class="fas fa-car"></em></button>
            <button class="btn btn-sm btn-dark btn-rounded py-1 px-2 mx-1" v-if="service.isinProgress()" @click="release(service)"
              data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('common.actions.release')">
              <em class="fas fa-car-crash"></em></button>
            <button class="btn btn-sm btn-dark btn-rounded py-1 px-2 mx-1" v-if="service.isinProgress()" @click="end(service)"
                    data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('common.actions.terminate')">
              <em class="fas fa-check"></em></button>
          </td>
          <td v-else>
            <button class="btn btn-sm btn-info btn-rounded px-2 py-1"><em class="fas fa-eye"></em></button>
            <button class="btn btn-sm btn-dark btn-rounded px-2 py-1"><em class="fas fa-pencil"></em></button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-class-component'
import DateHelper from '@/helpers/DateHelper'
import Service from '@/models/Service'
import Driver from '@/models/Driver'


class Props {
  services: Array<Service>
  isHistory: boolean
  drivers: Array<Driver>
}

export default class ServicesTable extends Vue.with(Props) {

  format(unix: number): string {
    return DateHelper.unixToDate(unix, 'MM-DD HH:mm:ss')
  }

  cancel(service: Service): void {
    this.$emit(Service.EVENT_CANCEL, service.id)
  }

  release(service: Service): void {
    this.$emit(Service.EVENT_RELEASE, service)
  }

  end(service: Service): void {
    this.$emit(Service.EVENT_TERMINATE, service.id)
  }

  getDriver(driverId: string): Driver|null {
    if (driverId) {
      return this.drivers.find(driver => driver.id === driverId)?? null
    }

    return null
  }
  
}
</script>
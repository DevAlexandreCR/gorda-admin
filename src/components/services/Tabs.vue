<template>
  <ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="pending-tab" data-bs-toggle="tab" data-bs-target="#pending" type="button" role="tab" aria-controls="pending" aria-selected="true">{{ $t('services.statuses.pending') }}</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="progress-tab" data-bs-toggle="tab" data-bs-target="#progress" type="button" role="tab" aria-controls="progress" aria-selected="false">{{ $t('services.statuses.in_progress') }}</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="history-tab" data-bs-toggle="tab" data-bs-target="#history" type="button" role="tab" aria-controls="history" aria-selected="false">{{ $t('services.history') }}</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="map-tab" data-bs-toggle="tab" data-bs-target="#map" type="button" role="tab" aria-controls="map" aria-selected="false">{{ $t('common.placeholders.map') }}</button>
    </li>
  </ul>
  <div class="tab-content pt-2" id="myTabContent">
    <div class="tab-pane fade show active" id="pending" role="tabpanel" aria-labelledby="pending-tab">
      <create-service></create-service>
      <services-table :services="pendingServices"></services-table>
    </div>
    <div class="tab-pane fade" id="progress" role="tabpanel" aria-labelledby="progress-tab">...</div>
    <div class="tab-pane fade" id="history" role="tabpanel" aria-labelledby="history-tab">...</div>
    <div class="tab-pane fade" id="map" role="tabpanel" aria-labelledby="map-tab">...</div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component'
import CreateService from '@/components/services/CreateService.vue'
import ServicesTable from '@/components/services/ServicesTable.vue'
import {ServiceInterface} from '@/entities/ServiceInterface'
import ServiceRepository from '@/repositories/ServiceRepository'
import {DataSnapshot} from 'firebase/database'
import dayjs from 'dayjs'
import Service from '@/models/Service'

@Options({
  components: {
    CreateService,
    ServicesTable
  },
})

export default class Tabs extends Vue {
  pendingServices: Array<ServiceInterface> = []
  inProgressServices: Array<ServiceInterface> = []

  onServiceAdded(data: DataSnapshot): void{
    this.pendingServices.push(data.val() as ServiceInterface)
  }

  onServiceChanged(data: DataSnapshot): void {
    const service = new Service()
    Object.assign(service, data.val())
    console.log(service)
  }
  mounted(): void {
    ServiceRepository.serviceListener(this.onServiceAdded, this.onServiceChanged, dayjs().subtract(1, 'day').unix())
  }
}
</script>
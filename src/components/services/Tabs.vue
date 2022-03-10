<template>
  <ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="pending-tab" data-bs-toggle="tab" data-bs-target="#pending" type="button"
        role="tab" aria-controls="pending" aria-selected="true">{{ $t('services.statuses.pending') }}
        <span class="badge badge-circle bg-danger" v-show="pendingServices.length > 0">{{pendingServices.length}}</span>
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="progress-tab" data-bs-toggle="tab" data-bs-target="#progress" type="button"
        role="tab" aria-controls="progress" aria-selected="false">{{ $t('services.statuses.in_progress') }}
        <span class="badge badge-circle bg-success" v-show="inProgressServices.length > 0">{{inProgressServices.length}}</span>
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="history-tab" data-bs-toggle="tab" data-bs-target="#history" type="button" role="tab"
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
      <services-table :services="pendingServices" @cancelService="cancel"></services-table>
    </div>
    <div class="tab-pane fade" id="progress" role="tabpanel" aria-labelledby="progress-tab">
      <services-table :services="inProgressServices" @cancelService="cancel" @endService="end" @releaseService="release"></services-table>
    </div>
    <div class="tab-pane fade" id="history" role="tabpanel" aria-labelledby="history-tab">
      <services-table :isHistory="true" :services="historyServices"></services-table>
    </div>
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
import ToastService from "@/services/ToastService";

@Options({
  components: {
    CreateService,
    ServicesTable
  },
})

export default class Tabs extends Vue {
  pendingServices: Array<ServiceInterface> = []
  inProgressServices: Array<ServiceInterface> = []
  historyServices: Array<ServiceInterface> = []

  onServiceAdded(data: DataSnapshot): void {
    const service = new Service()
    Object.assign(service, data.val())
    service.id = data.key as string
    this.historyServices.unshift(service)
    this.setServiceOnChange(service)
  }

  onServiceChanged(data: DataSnapshot): void {
    const service = new Service()
    Object.assign(service, data.val())
    this.setServiceOnChange(service)
  }

  setServiceOnChange(service: Service): void {
    switch (service.status) {
      case Service.STATUS_PENDING:
        this.pendingServices = this.pendingServices.filter(serv => {
          return serv.id !== service.id
        })
        this.inProgressServices = this.inProgressServices.filter(serv => {
          return serv.id !== service.id
        })
        this.pendingServices.unshift(service)
        break
      case Service.STATUS_IN_PROGRESS:
        this.inProgressServices.unshift(service)
        this.pendingServices = this.pendingServices.filter(serv => {
          return serv.id !== service.id
        })
        break
      default:
        this.inProgressServices = this.inProgressServices.filter(serv => {
          return serv.id !== service.id
        })
        this.pendingServices = this.pendingServices.filter(serv => {
          return serv.id !== service.id
        })
        this.historyServices[this.historyServices.findIndex(serv => serv.id === service.id)].status = service.status
        break
    }
  }

  mounted(): void {
    ServiceRepository.serviceListener(this.onServiceAdded, this.onServiceChanged, dayjs().subtract(1, 'day').unix())
  }

  cancel(serviceId: string): void {
    ServiceRepository.updateStatus(serviceId, Service.STATUS_CANCELED).then(() => {
      ToastService.toast(ToastService.SUCCESS, this.$t('common.messages.updated'))
    }).catch(e => {
      ToastService.toast(ToastService.ERROR, this.$t('common.messages.error'), e.message)
    })
  }

  release(serviceId: string): void {
    ServiceRepository.updateStatus(serviceId, Service.STATUS_PENDING).then(() => {
      ToastService.toast(ToastService.SUCCESS, this.$t('common.messages.updated'))
    }).catch(e => {
      ToastService.toast(ToastService.ERROR, this.$t('common.messages.error'), e.message)
    })
  }

  end(serviceId: string): void {
    ServiceRepository.updateStatus(serviceId, Service.STATUS_TERMINATED).then(() => {
      ToastService.toast(ToastService.SUCCESS, this.$t('common.messages.updated'))
    }).catch(e => {
      ToastService.toast(ToastService.ERROR, this.$t('common.messages.error'), e.message)
    })
  }
}
</script>
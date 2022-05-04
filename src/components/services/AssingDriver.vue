<template>
  <!-- Modal -->
  <div class="modal fade" id="driverModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="AssignModalLabel">Services</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <AutoComplete :elements="plates" @selected="onDriverSelected"/>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{
              $t('common.actions.close')
            }}
          </button>
          <button type="button" class="btn btn-primary" @click="assignDriver">{{ $t('common.actions.assign') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, onMounted, ref, Ref, watch} from 'vue'
import AutoComplete from '@/components/AutoComplete.vue'
import {AutoCompleteType} from '@/types/AutoCompleteType'
import Driver from '@/models/Driver'
import {Modal} from 'bootstrap'
import ToastService from '@/services/ToastService'
import {useI18n} from 'vue-i18n'
import Service from '@/models/Service'
import ServiceRepository from '@/repositories/ServiceRepository'

const props = defineProps<{
  drivers: Array<Driver>
}>()
const plates: Ref<Array<AutoCompleteType>> = ref([])
let service: Service = new Service()
let driverId: string
let driverModal: Modal | null
const {t} = useI18n()

watch(props.drivers, (drivers: Array<Driver>) => {
  drivers.forEach(driver => {
    if (driver.id) plates.value.push({id: driver.id, value: driver.vehicle.plate})
  })
})

onMounted(() => {
  driverModal = document.getElementById('driverModal')
  driverModal?.addEventListener('show.bs.modal', (event: any) => {
    const serviceId = event.relatedTarget.id
    if (serviceId) {
      ServiceRepository.getService(serviceId).then(dbService => {
        Object.assign(service, dbService)
      })
    }
  })
})

const assignDriver = (): void => {
  if (!driverId) {
    ToastService.toast(ToastService.ERROR, t('common.messages.error'), t('validations.driver'))
    return
  }
  service.driver_id = driverId
  service.status = Service.STATUS_IN_PROGRESS
  service.update(service).then(() => {
    ToastService.toast(ToastService.SUCCESS, t('common.messages.updated'))
    driverModal?.close()
  }).catch(e => {
    ToastService.toast(ToastService.ERROR, t('common.messages.error'), e.message)
  })
}

function onDriverSelected(element: AutoCompleteType): void {
  driverId = element.id
}
</script>
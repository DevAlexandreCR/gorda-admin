<template>
  <!-- Modal -->
  <div class="modal fade" id="driverModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="AssignModalLabel">{{ $t('common.actions.assign') }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <auto-complete :idField="'fieldAssign'" v-bind="plate" :elements="plates" @selected="onDriverSelected" :key="keyAutoComplete"
                         :placeholder="$t('drivers.placeholders.plate')" :fieldName="'randomName'"/>
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
import {onMounted, ref, Ref, watchEffect} from 'vue'
import AutoComplete from '@/components/AutoComplete.vue'
import {AutoCompleteType} from '@/types/AutoCompleteType'
import Driver from '@/models/Driver'
import ToastService from '@/services/ToastService'
import {useI18n} from 'vue-i18n'
import Service from '@/models/Service'
import ServiceRepository from '@/repositories/ServiceRepository'
import {Modal} from 'bootstrap'
import {useLoadingState} from '@/services/stores/LoadingState'

const props = defineProps<{ drivers: Array<Driver> }>()
const plates: Ref<Array<AutoCompleteType>> = ref([])
const plate: Ref<string> = ref('')
const keyAutoComplete: Ref<number> = ref(0)
const {setLoading} = useLoadingState()
let service: Service = new Service()
let driverId: string|null
let driverModal: Modal
const {t} = useI18n()

watchEffect(async () => {
  props.drivers.forEach(driver => {
    if (driver.id) plates.value.push({id: driver.id, value: driver.vehicle.plate})
  })
})

onMounted(() => {
  const element = document.getElementById('driverModal') as HTMLElement;
  if (element) driverModal = new Modal(element)
  element?.addEventListener('show.bs.modal', (event: any) => {
    plate.value = ''
    const serviceId = event.relatedTarget.id
    if (serviceId) {
      ServiceRepository.getService(serviceId).then(dbService => {
        Object.assign(service, dbService)
      })
    }
  })

  element?.addEventListener('hidden.bs.modal', () => {
    plate.value = ''
  })
})

const assignDriver = (): void => {
  if (!driverId) {
    ToastService.toast(ToastService.ERROR, t('common.messages.error'), t('validations.driver'))
    return
  }
  service.driver_id = driverId
  service.status = Service.STATUS_IN_PROGRESS
  setLoading(true)
  service.update(service).then(() => {
    setLoading(false)
    ToastService.toast(ToastService.SUCCESS, t('common.messages.updated'))
    driverModal?.hide()
  }).catch(e => {
    setLoading(false)
    ToastService.toast(ToastService.ERROR, t('common.messages.error'), e.message)
  })
}

function onDriverSelected(element: AutoCompleteType): void {
  driverId = element.id
  assignDriver()
  keyAutoComplete.value++
}
</script>

<template>
  <div class="modal fade" tabindex="-1" id="showServiceModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ service.start_loc.name }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div style="height: 500px">
            <Map :route="service.metadata?.route" :places="location"></Map>
          </div>
          <div class="row mt-4">
            <div class="col-6">
              <div class="d-flex flex-column">
                <h6 class="mb-3 text-sm">{{ $t('common.placeholders.service_info') }}</h6>
                <span class="mb-2 text-sm">{{$t('services.fields.start_address')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ service.start_loc.name }}</span></span>
                <span class="mb-2 text-sm">{{$t('services.fields.hour')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ date }}</span></span>
                <span class="mb-2 text-sm">{{$t('common.fields.status')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ $t(`services.statuses.${ service.status }`) }}</span></span>
                <span class="mb-2 text-sm">{{$t('common.fields.name')}} <span class="text-dark font-weight-bold ms-sm-2">{{ service.name }}</span></span>
                <span class="mb-2 text-sm">{{$t('common.fields.phone')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ service.phone }}</span></span>
                <span class="mb-2 text-sm">{{$t('services.fields.comment')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ service.comment }}</span></span>
                <span class="mb-2 text-sm">{{$t('common.fields.created_by')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ createdBy }}</span></span>
                <span class="mb-2 text-sm">{{$t('common.fields.canceled_by')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ canceledBy }}</span></span>
                <span class="mb-2 text-sm">{{$t('common.fields.terminated_by')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ terminatedBy }}</span></span>
              </div>
            </div>
            <div class="col-6">
              <div class="d-flex flex-column" v-if="service.driver">
                <h6 class="mb-3 text-sm">{{ $t('common.placeholders.route_info') }}</h6>
                <span class="mb-2 text-sm">{{$t('services.fields.driver_name')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ service.driver.name }}</span></span>
                <span class="mb-2 text-sm">{{$t('drivers.fields.plate')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ service.driver.vehicle.plate }}</span></span>
                <span class="mb-2 text-sm">{{$t('services.fields.time')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ time }}</span></span>
                <span class="mb-2 text-sm">{{$t('services.fields.distance')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ distance }}</span></span>
                <span class="mb-2 text-sm">{{$t('services.fields.fee')}} <span class="text-dark font-weight-bold ms-sm-2">{{ fee }}</span></span>
                <span class="mb-2 text-sm">{{$t('services.fields.fee_multiplier')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ multiplier }}</span></span>
                <span class="mb-2 text-sm" v-if="service.assigned_by !== null">{{$t('common.fields.assigned_by')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ assignedBy }}</span></span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{$t('common.actions.close')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlaceInterface } from '@/types/PlaceInterface'
import { computed, onMounted, reactive, ref } from 'vue'
import Map from '@/components/maps/Map.vue'
import { ServiceList } from '@/models/ServiceList'
import DateHelper from '@/helpers/DateHelper'
import AuthService from '@/services/AuthService'
import {useSettingsStore} from "@/services/stores/SettingsStore";

interface Props {
  service: ServiceList
}

const props = defineProps<Props>()
const location = reactive<Array<PlaceInterface>>([])
const { branchSelected } = useSettingsStore()

const createdBy = ref<string>('Sistema')
const canceledBy = ref<string>('Sistema')
const terminatedBy = ref<string>('Sistema')
const assignedBy = ref<string>('Sistema')

onMounted(async () => {
  location.push({
    key: props.service.id,
    name: props.service.start_loc.name,
    lat: props.service.start_loc.lat,
    lng: props.service.start_loc.lng
  })
  
  await loadUserData()
})

const loadUserData = async () => {
  if (props.service.created_by) {
    const user = await props.service.getCreatedBy()
    createdBy.value = user?.name || 'Sistema'
  }
  
  if (props.service.canceled_by) {
    const user = await props.service.getCanceledBy()
    canceledBy.value = user?.name || 'Sistema'
  }
  
  if (props.service.terminated_by) {
    const user = await props.service.getTerminatedBy()
    terminatedBy.value = user?.name || 'Sistema'
  }
  
  if (props.service.assigned_by) {
    const user = await props.service.getAssignedBy()
    assignedBy.value = user?.name || 'Sistema'
  }
}

const time = computed(() => {
  if (props.service.metadata?.start_trip_at === undefined || props.service.metadata?.end_trip_at === undefined) return '0s'
  return DateHelper.getTime(props.service.metadata?.start_trip_at, props.service.metadata?.end_trip_at) + 'min'
})

const fee = computed(() => {
  if (props.service.metadata?.trip_fee === undefined) return '0' + branchSelected?.currency_code
  return props.service.metadata?.trip_fee + branchSelected?.currency_code
})

const multiplier = computed(() => {
  if (props.service.metadata?.trip_multiplier === undefined) return '1.0'
  return props.service.metadata?.trip_multiplier.toString()
})

const distance = computed(() => {
  if (props.service.metadata?.trip_distance === undefined) return '0.0'
  return (props.service.metadata?.trip_distance / 1000) + 'km'
})

const date = computed(() => {
  return DateHelper.unixToDate(props.service.created_at, 'MM-DD HH:mm:ss')
})
</script>

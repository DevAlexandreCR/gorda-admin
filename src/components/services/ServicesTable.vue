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
          <td class="text-secondary font-weight-bolder opacity-7 text-center position-relative">
            {{ index + 1 }}
            <span
              v-if="props.table === Tables.pendings && applicantsCount(service) > 0"
              class="position-absolute top-0 start-75 badge font-weight-bolder rounded-circle bg-danger shadow"
              style="z-index: 2;"
              :title="$t('services.messages.has_applicants')"
            >
              {{ applicantsCount(service) }}
            </span>
          </td>
          <td class="py-1 col-1">{{ props.table === Tables.history ? format(service.created_at) : DateHelper.aGo(service.a_go) }}</td>
          <td class="py-1">{{ $t('services.statuses.' + service.status) }}</td>
          <td class="py-1">
            <div class="d-flex align-items-center">
              <span class="text-truncate" style="max-width: 180px" :title="service.start_loc?.name">{{ service.start_loc?.name }}</span>
              <button
                v-if="props.table === Tables.pendings"
                class="btn btn-link btn-sm text-secondary ms-2 p-0"
                type="button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                :title="$t('services.edit_start_address')"
                @click="openStartLocationModal(service, $event)"
              >
                <em class="fas fa-pen"></em>
              </button>
            </div>
          </td>
          <td class="py-1" v-if="showDestination">{{ service.end_loc?.name ?? 'N/A' }}</td>
          <td class="py-1">{{ service.phone }}</td>
          <td class="py-1">{{ service.name }}</td>
          <td class="py-1">
            <div class="d-flex align-items-center text-truncate" style="max-width: 160px">
              <span class="text-truncate" :title="service.comment ?? 'N/A'">{{ service.comment ?? 'N/A' }}</span>
              <button
                v-if="props.table === Tables.pendings"
                class="btn btn-link btn-sm text-secondary ms-2 p-0"
                type="button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                :title="$t('services.edit_comment')"
                @click="openCommentModal(service, $event)"
              >
                <em class="fas fa-pen"></em>
              </button>
            </div>
          </td>
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
            <button class="btn btn-sm btn-danger btn-rounded py-1 px-2 mx-1 my-0" @click="cancel(service, $event)" v-if="props.table !== Tables.history"
                    data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('common.actions.cancel')">
              <em class="fas fa-ban"></em></button>
            <button class="btn btn-sm btn-info btn-rounded py-1 px-2 mx-1 my-0" v-if="props.table === Tables.pendings && !service.driver_id" @click="restart(service, $event)"
                    data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('common.actions.restart')" :disabled="hasApplicants(service)">
              <em class="fas fa-rotate-left"></em></button>
            <button class="btn btn-sm btn-secondary btn-rounded py-1 px-2 mx-1 my-0" v-if="service.isPending() && props.table !== Tables.history"
              data-bs-placement="top" :title="$t('common.actions.assign')"  data-bs-toggle="modal" :id="service.id" data-bs-target="#driverModal">
              <em class="fas fa-car"></em></button>
            <button class="btn btn-sm btn-dark btn-rounded py-1 px-2 mx-1 my-0" v-if="service.isInProgress() && props.table !== Tables.history" @click="release(service, $event)"
                    data-bs-toggle="tooltip" data-bs-placement="top" :title="$t('common.actions.release')">
              <em class="fas fa-car-crash"></em></button>
            <button class="btn btn-sm btn-dark btn-rounded py-1 px-2 mx-1 my-0" v-if="service.isInProgress() && props.table !== Tables.history" @click="end(service, $event)"
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

  <div
    class="modal fade"
    id="editStartLocationModal"
    tabindex="-1"
    aria-hidden="true"
    ref="startLocationModalRef"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('services.edit_start_address') }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p class="text-xs text-secondary mb-1">{{ $t('services.current_start_address') }}</p>
          <p class="text-sm fw-bold mb-3">{{ currentStartAddress }}</p>
          <AutoComplete
            :key="startLocationFieldKey"
            :idField="'edit-start-' + (editingService?.id ?? '')"
            :fieldName="'start_address_edit'"
            :elements="placesAutocomplete"
            :search-handler="searchPlacesAutocomplete"
            :placeholder="$t('common.placeholders.address')"
            :classes="'form-control'"
            @selected="onStartLocationSelected"
            @on-change="onStartLocationChange"
          />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            {{ $t('common.actions.close') }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="!newStartLocation || isUpdatingStart"
            @click="saveStartLocation"
          >
            <span
              v-if="isUpdatingStart"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            {{ $t('common.actions.edit') }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="editCommentModal"
    tabindex="-1"
    aria-hidden="true"
    ref="commentModalRef"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('services.edit_comment') }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p class="text-xs text-secondary mb-1">{{ $t('services.current_comment') }}</p>
          <p class="text-sm fw-bold mb-3">{{ currentComment }}</p>
          <textarea
            class="form-control"
            rows="3"
            v-model="newComment"
            :placeholder="$t('common.placeholders.comment')"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            {{ $t('common.actions.close') }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="isUpdatingComment"
            @click="saveComment"
          >
            <span
              v-if="isUpdatingComment"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            {{ $t('common.actions.edit') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DateHelper from '@/helpers/DateHelper'
import Paginator from '@/components/Paginator'
import Service from '@/models/Service'
import AutoComplete from '@/components/AutoComplete.vue'
import {onBeforeUnmount, onMounted, ref, Ref, watch, computed} from 'vue'
import {Modal, Tooltip} from 'bootstrap'
import {ServiceList} from '@/models/ServiceList'
import {Tables} from '@/constants/Tables'
import DBPaginator from '@/components/DBPaginator.vue'
import {Pagination} from '@/types/Pagination'
import {ServiceCursor} from '@/types/ServiceCursor'
import {AutoCompleteType} from '@/types/AutoCompleteType'
import {LocationType} from '@/types/LocationType'
import ServiceRepository from '@/repositories/ServiceRepository'
import ToastService from '@/services/ToastService'
import {usePlacesStore} from '@/services/stores/PlacesStore'
import {useSettingsStore} from '@/services/stores/SettingsStore'
import {storeToRefs} from 'pinia'
import {useI18n} from 'vue-i18n'


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
const placesStore = usePlacesStore()
const {places} = storeToRefs(placesStore)
const {branchSelected} = storeToRefs(useSettingsStore())
const placesAutocomplete: Ref<Array<AutoCompleteType>> = ref([])
const editingService: Ref<ServiceList | null> = ref(null)
const newStartLocation: Ref<LocationType | null> = ref(null)
const startLocationModalRef = ref<HTMLElement | null>(null)
let startLocationModal: Modal | null = null
const startLocationFieldKey = ref(0)
const isUpdatingStart = ref(false)
const editingCommentService: Ref<ServiceList | null> = ref(null)
const commentModalRef = ref<HTMLElement | null>(null)
let commentModal: Modal | null = null
const newComment = ref<string>('')
const isUpdatingComment = ref(false)
const { t } = useI18n()
const currentStartAddress = computed(() => editingService.value?.start_loc?.name ?? 'N/A')
const currentComment = computed(() => editingCommentService.value?.comment ?? 'N/A')

watch(props.services, (newServices) => {
  paginatedServices.value = Array.from(newServices)
})

watch(places, (newPlaces) => {
  updateAutocompletePlaces(newPlaces)
})


onMounted(() => {
  paginatedServices.value = Array.from(props.services)
  if(props.table !== Tables.history) interval = window.setInterval(getTime, 1000)
  updateAutocompletePlaces(places.value)
  if (startLocationModalRef.value) {
    startLocationModal = new Modal(startLocationModalRef.value)
    startLocationModalRef.value.addEventListener('hidden.bs.modal', resetStartLocationForm)
  }
  if (commentModalRef.value) {
    commentModal = new Modal(commentModalRef.value)
    commentModalRef.value.addEventListener('hidden.bs.modal', resetCommentForm)
  }
})

onBeforeUnmount(() => {
  window.clearInterval(interval)
  startLocationModalRef.value?.removeEventListener('hidden.bs.modal', resetStartLocationForm)
  commentModalRef.value?.removeEventListener('hidden.bs.modal', resetCommentForm)
})

function format(unix: number): string {
  return DateHelper.unixToDate(unix, 'MM-DD HH:mm:ss')
}

function cancel(service: Service, event?: Event): void {
  hideTooltip(event)
  emit(Service.EVENT_CANCEL, service.id)
}

function release(service: ServiceList, event?: Event): void {
  hideTooltip(event)
  service.driver = null
  emit(Service.EVENT_RELEASE, service)
}

function end(service: Service, event?: Event): void {
  hideTooltip(event)
  emit(Service.EVENT_TERMINATE, service.id)
}

function show(service: Service): void {
  emit(Service.EVENT_SHOW, service)
}

function restart(service: ServiceList, event?: Event): void {
  hideTooltip(event)
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

function openStartLocationModal(service: ServiceList, event?: Event): void {
  if (props.table !== Tables.pendings) return
  hideTooltip(event)
  editingService.value = service
  newStartLocation.value = null
  startLocationFieldKey.value++
  placesStore.searchPlaces('').catch(() => undefined)
  startLocationModal?.show()
}

function openCommentModal(service: ServiceList, event?: Event): void {
  if (props.table !== Tables.pendings) return
  hideTooltip(event)
  editingCommentService.value = service
  newComment.value = service.comment ?? ''
  commentModal?.show()
}

function updateAutocompletePlaces(from: Array<{ id?: string, key?: string, name: string }>): void {
  placesAutocomplete.value = from
    .map(place => ({
      id: place.key ?? place.id ?? '',
      value: place.name
    }))
    .filter(option => option.id !== '')
}

async function searchPlacesAutocomplete(term: string): Promise<Array<AutoCompleteType>> {
  const placesResult = await placesStore.searchPlaces(term, 50)
  updateAutocompletePlaces(placesResult)
  return placesAutocomplete.value.slice(0, 10)
}

function onStartLocationChange(): void {
  newStartLocation.value = null
}

async function onStartLocationSelected(element: AutoCompleteType): Promise<void> {
  const place = await placesStore.findByName(element.value)
  if (!place || !branchSelected.value) return
  newStartLocation.value = {
    name: place.name,
    lat: place.lat,
    lng: place.lng,
    country: branchSelected.value.id,
    city: branchSelected.value.city.id
  }
}

function resetStartLocationForm(): void {
  newStartLocation.value = null
  editingService.value = null
  startLocationFieldKey.value++
}

function resetCommentForm(): void {
  newComment.value = ''
  editingCommentService.value = null
}

async function saveStartLocation(): Promise<void> {
  if (!editingService.value) return
  if (!newStartLocation.value) {
    await ToastService.toast(ToastService.ERROR, t('common.messages.error'), t('services.messages.no_start_loc'))
    return
  }
  if (!branchSelected.value) {
    await ToastService.toast(ToastService.ERROR, t('common.messages.error'), t('services.messages.branch_required'))
    return
  }
  isUpdatingStart.value = true
  ServiceRepository.updateStartLocation(editingService.value.id, newStartLocation.value)
    .then(async () => {
      if (editingService.value && newStartLocation.value) {
        editingService.value.start_loc = newStartLocation.value
      }
      startLocationModal?.hide()
      await ToastService.toast(ToastService.SUCCESS, t('services.messages.start_address_updated'))
    })
    .catch(async (e) => {
      await ToastService.toast(ToastService.ERROR, t('common.messages.error'), e.message)
    })
    .finally(() => {
      isUpdatingStart.value = false
    })
}

async function saveComment(): Promise<void> {
  if (!editingCommentService.value) return
  isUpdatingComment.value = true
  const updatedComment = newComment.value.trim() || null
  ServiceRepository.updateComment(editingCommentService.value.id, updatedComment)
    .then(async () => {
      editingCommentService.value!.comment = updatedComment
      commentModal?.hide()
      await ToastService.toast(ToastService.SUCCESS, t('services.messages.comment_updated'))
    })
    .catch(async (e) => {
      await ToastService.toast(ToastService.ERROR, t('common.messages.error'), e.message)
    })
    .finally(() => {
      isUpdatingComment.value = false
    })
}

function getTime(): void {
  paginatedServices.value.forEach(service => {
    service.a_go  = DateHelper.unix() - service.created_at
  })
}

function hideTooltip(event?: Event): void {
  const target = event?.currentTarget as HTMLElement | null
  if (!target) return
  const instance = Tooltip.getInstance(target) ?? Tooltip.getOrCreateInstance(target)
  instance.hide()
}
</script>

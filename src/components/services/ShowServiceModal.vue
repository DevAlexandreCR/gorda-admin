<template>
  <div class="modal fade" tabindex="-1" id="showServiceModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <div class="d-flex align-items-center flex-grow-1 gap-2">
            <span :class="`badge bg-gradient-${statusBadgeClass}`">{{ $t(`services.statuses.${service.status}`) }}</span>
            <span class="text-sm fw-semibold">
              {{ service.start_loc.name }} → {{ service.end_loc?.name ?? $t('common.placeholders.no_destination') }}
            </span>
            <span class="ms-auto text-sm text-muted">{{ DateHelper.unixToDate(service.created_at, 'YYYY-MM-DD HH:mm') }}</span>
          </div>
          <button type="button" class="btn-close ms-2" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div style="height: 300px">
            <Map :route="service.metadata?.route" :places="location"></Map>
          </div>

          <!-- Timeline -->
          <div class="mt-4">
            <h6 class="timeline-section__title text-sm mb-3">
              <em class="fa-solid fa-timeline me-2"></em>
              {{ $t('common.placeholders.timeline') }}
            </h6>
            <div class="service-timeline">
              <!-- Track: dots connected by lines, duration centered on each line -->
              <div class="service-timeline__track">
                <template v-for="(step, idx) in timelineSteps" :key="step.key">
                  <div
                    :class="[
                      'tl-dot',
                      step.active ? 'tl-dot--active' : 'tl-dot--inactive',
                      step.canceledOverride ? 'tl-dot--danger' : '',
                    ]"
                  ></div>
                  <div
                    v-if="idx < timelineSteps.length - 1"
                    :class="[
                      'tl-segment',
                      timelineSteps[idx + 1].canceledOverride ? 'tl-segment--danger' : '',
                    ]"
                  >
                    <span v-if="timelineDurations[idx].seconds !== null" class="tl-duration">
                      {{ DateHelper.aGo(timelineDurations[idx].seconds!) }}
                    </span>
                  </div>
                </template>
              </div>
              <!-- Labels: one slot per step aligned below its dot -->
              <div class="service-timeline__labels">
                <template v-for="(step, idx) in timelineSteps" :key="step.key + '-lbl'">
                  <div class="tl-label">
                    <span class="text-xs fw-semibold">
                      {{ step.canceledOverride ? $t('services.statuses.canceled') : step.label }}
                    </span>
                    <span v-if="step.active && !step.canceledOverride" class="text-xs text-muted">
                      {{ DateHelper.unixToDate(step.at!, 'HH:mm:ss') }}
                    </span>
                  </div>
                  <div v-if="idx < timelineSteps.length - 1" class="tl-label-gap"></div>
                </template>
              </div>
            </div>
          </div>

          <!-- Info cards -->
          <div class="row mt-4">
            <div class="col-6">
              <div class="service-info-card">
                <h6 class="service-info-card__title">
                  <em class="fa-solid fa-circle-info me-2"></em>
                  {{ $t('common.placeholders.service_info') }}
                </h6>
                <span class="mb-2 text-sm">
                  <em :class="`fa-solid ${originIcon} me-1`"></em>
                  {{ $t('services.fields.origin') }}
                  <span class="text-dark ms-sm-2 font-weight-bold">
                    {{ origin.label }}<template v-if="origin.sublabel"> · {{ origin.sublabel }}</template>
                  </span>
                </span>
                <span class="mb-2 text-sm">{{$t('services.fields.start_address')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ service.start_loc.name }}</span></span>
                <span class="mb-2 text-sm">{{$t('services.fields.end_address')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ service.end_loc?.name ?? 'N/A' }}</span></span>
                <span class="mb-2 text-sm">{{$t('services.fields.hour')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ date }}</span></span>
                <span class="mb-2 text-sm">{{$t('common.fields.status')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ $t(`services.statuses.${ service.status }`) }}</span></span>
                <span class="mb-2 text-sm">{{$t('common.fields.name')}} <span class="text-dark font-weight-bold ms-sm-2">{{ service.name }}</span></span>
                <span class="mb-2 text-sm">{{$t('common.fields.phone')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ service.phone }}</span></span>
                <span class="mb-2 text-sm">{{$t('services.fields.comment')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ service.comment ?? 'N/A' }}</span></span>
                <span class="mb-2 text-sm" v-if="service.created_by !== null">{{$t('common.fields.created_by')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ createdBy }}</span></span>
                <span class="mb-2 text-sm" v-if="service.terminated_by !== null">{{$t('common.fields.terminated_by')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ terminatedBy }}</span></span>
                <div v-if="service.status === 'canceled'" class="mt-3">
                  <h6 class="service-info-card__title">
                    <em class="fa-solid fa-ban me-2 text-danger"></em>
                    {{ $t('common.placeholders.canceled_by_section') }}
                  </h6>
                  <span class="mb-2 text-sm">{{$t('common.fields.canceled_by')}}<span class="text-dark ms-sm-2 font-weight-bold">{{ canceledBy }}</span></span>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="service-info-card" v-if="service.driver">
                <h6 class="service-info-card__title">
                  <em class="fa-solid fa-route me-2"></em>
                  {{ $t('common.placeholders.route_info') }}
                </h6>
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
import { useI18n } from 'vue-i18n'
import Map from '@/components/maps/Map.vue'
import { ServiceList } from '@/models/ServiceList'
import Service from '@/models/Service'
import DateHelper from '@/helpers/DateHelper'
import AuthService from '@/services/AuthService'
import { useSettingsStore } from '@/services/stores/SettingsStore'
import { useWpClientsStore } from '@/services/stores/WpClientStore'

interface Props {
  service: ServiceList
}

const props = defineProps<Props>()
const { t } = useI18n()
const location = reactive<Array<PlaceInterface>>([])
const { branchSelected } = useSettingsStore()
const wpClientsStore = useWpClientsStore()

const createdBy = ref<string>('Sistema')
const canceledBy = ref<string>('Sistema')
const terminatedBy = ref<string>('Sistema')
const assignedBy = ref<string>('Sistema')

onMounted(async () => {
  location.push({
    id: props.service.id,
    key: props.service.id,
    name: props.service.start_loc.name,
    lat: props.service.start_loc.lat,
    lng: props.service.start_loc.lng
  })
  if (props.service.end_loc) {
    location.push({
      id: `${props.service.id}-end`,
      key: `${props.service.id}-end`,
      name: props.service.end_loc.name,
      lat: props.service.end_loc.lat,
      lng: props.service.end_loc.lng
    })
  }

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

const origin = computed(() => {
  if (props.service.created_by) {
    return { kind: 'admin' as const, label: t('services.origin.admin'), sublabel: createdBy.value || null }
  }
  if (props.service.wp_client_id) {
    const alias = wpClientsStore.getWpClient(props.service.wp_client_id)?.alias ?? null
    return { kind: 'bot' as const, label: t('services.origin.bot'), sublabel: alias }
  }
  return { kind: 'unknown' as const, label: t('services.origin.unknown'), sublabel: null }
})

const originIcon = computed(() => {
  if (origin.value.kind === 'bot') return 'fa-tower-broadcast'
  if (origin.value.kind === 'admin') return 'fa-toolbox'
  return 'fa-question'
})

const statusBadgeClass = computed(() => {
  switch (props.service.status) {
    case Service.STATUS_TERMINATED: return 'success'
    case Service.STATUS_CANCELED: return 'danger'
    case Service.STATUS_IN_PROGRESS: return 'info'
    default: return 'secondary'
  }
})

const timelineSteps = computed(() => {
  const m = props.service.metadata
  const arrivedAt   = m && m.arrived_at    > 0 ? m.arrived_at    : null
  const startTripAt = m && m.start_trip_at > 0 ? m.start_trip_at : null
  const endTripAt   = m && m.end_trip_at   > 0 ? m.end_trip_at   : null
  return [
    { key: 'created',   label: t('services.fields.hour'),           at: props.service.created_at, active: props.service.created_at > 0, canceledOverride: false },
    { key: 'arrived',   label: t('services.fields.arrived_at'),     at: arrivedAt,                active: arrivedAt !== null,           canceledOverride: false },
    { key: 'tripStart', label: t('services.fields.trip_started_at'), at: startTripAt,             active: startTripAt !== null,         canceledOverride: false },
    { key: 'tripEnd',   label: t('services.fields.trip_ended_at'),  at: endTripAt,                active: endTripAt !== null,           canceledOverride: props.service.status === Service.STATUS_CANCELED },
  ]
})

const timelineDurations = computed(() => {
  const steps = timelineSteps.value
  const pairs = [
    { key: 'wait_for_arrival', a: steps[0], b: steps[1] },
    { key: 'wait_for_pickup',  a: steps[1], b: steps[2] },
    { key: 'trip_duration',    a: steps[2], b: steps[3] },
  ]
  return pairs.map(({ key, a, b }) => {
    const seconds =
      a.at !== null && a.at > 0 && b.at !== null && b.at > 0
        ? (b.at as number) - (a.at as number)
        : null
    return { key, seconds }
  })
})

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

<style scoped>
.service-info-card {
  background: var(--card-bg, #ffffff);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.75rem;
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.service-info-card__title {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted-text, #6c757d);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
}

.service-timeline {
  display: flex;
  flex-direction: column;
}

/* Track row: dots + segments with durations on the lines */
.service-timeline__track {
  display: flex;
  align-items: center;
}

.tl-dot {
  flex: 0 0 14px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  z-index: 1;
}

.tl-dot--active {
  background: var(--bs-success, #2dce89);
  border: 2px solid var(--bs-success, #2dce89);
}

.tl-dot--inactive {
  background: transparent;
  border: 2px solid var(--muted-text, #adb5bd);
}

.tl-dot--danger {
  background: var(--bs-danger, #f5365c);
  border: 2px solid var(--bs-danger, #f5365c);
}

.tl-segment {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2px;
}

.tl-segment::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  background: var(--muted-text, #adb5bd);
  opacity: 0.4;
}

.tl-segment--danger::before {
  background: var(--bs-danger, #f5365c);
  opacity: 0.7;
}

.tl-duration {
  position: relative;
  z-index: 1;
  background: var(--card-bg, #fff);
  padding: 0 5px;
  font-size: 0.65rem;
  color: var(--muted-text, #8898aa);
  font-style: italic;
  white-space: nowrap;
}

/* Labels row: aligned below each dot */
.service-timeline__labels {
  display: flex;
  align-items: flex-start;
  margin-top: 0.4rem;
}

.tl-label {
  flex: 0 0 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: visible;
  /* allow text to visually overflow the 14px slot */
}

.tl-label > * {
  white-space: nowrap;
}

.tl-label-gap {
  flex: 1;
}

.timeline-section__title {
  color: var(--card-text, #344767);
}
</style>

<template>
  <div class="modal fade" tabindex="-1" id="showServiceModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <div class="d-flex align-items-center flex-grow-1 gap-2">
            <span :class="['gorda-status-badge', `gorda-status-badge--${statusBadgeClass}`]">{{ $t(`services.statuses.${service.status}`) }}</span>
            <span class="text-sm fw-semibold">
              {{ service.start_loc.name }} → {{ service.end_loc?.name ?? $t('common.placeholders.no_destination') }}
            </span>
            <span class="ms-auto text-sm text-muted">{{ DateHelper.unixToDate(service.created_at, 'YYYY-MM-DD HH:mm') }}</span>
          </div>
          <button type="button" class="gorda-icon-btn ms-2" data-bs-dismiss="modal" aria-label="Close">
            <em class="fa-solid fa-xmark"></em>
          </button>
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
                  <em class="fa-solid fa-circle-info me-2 service-info-card__icon--info"></em>
                  {{ $t('common.placeholders.service_info') }}
                </h6>
                <div class="gorda-info-row">
                  <span class="gorda-info-row__key">
                    <em :class="`fa-solid ${originIcon} me-1`"></em>
                    {{ $t('services.fields.origin') }}
                  </span>
                  <span class="gorda-info-row__value">
                    {{ origin.label }}<template v-if="origin.sublabel"> · {{ origin.sublabel }}</template>
                  </span>
                </div>
                <div class="gorda-info-row">
                  <span class="gorda-info-row__key">{{$t('services.fields.start_address')}}</span>
                  <span class="gorda-info-row__value">{{ service.start_loc.name }}</span>
                </div>
                <div class="gorda-info-row">
                  <span class="gorda-info-row__key">{{$t('services.fields.end_address')}}</span>
                  <span class="gorda-info-row__value">{{ service.end_loc?.name ?? 'N/A' }}</span>
                </div>
                <div class="gorda-info-row">
                  <span class="gorda-info-row__key">{{$t('services.fields.hour')}}</span>
                  <span class="gorda-info-row__value">{{ date }}</span>
                </div>
                <div class="gorda-info-row">
                  <span class="gorda-info-row__key">{{$t('common.fields.status')}}</span>
                  <span class="gorda-info-row__value">{{ $t(`services.statuses.${ service.status }`) }}</span>
                </div>
                <div class="gorda-info-row">
                  <span class="gorda-info-row__key">{{$t('common.fields.name')}}</span>
                  <span class="gorda-info-row__value">{{ service.name }}<ClientCompletedBadge :count="service.client_completed_services_count" /></span>
                </div>
                <div class="gorda-info-row">
                  <span class="gorda-info-row__key">{{$t('common.fields.phone')}}</span>
                  <span class="gorda-info-row__value">{{ service.phone }}</span>
                </div>
                <div class="gorda-info-row">
                  <span class="gorda-info-row__key">{{$t('services.fields.comment')}}</span>
                  <span class="gorda-info-row__value">{{ service.comment ?? 'N/A' }}</span>
                </div>
                <div class="gorda-info-row" v-if="service.created_by !== null">
                  <span class="gorda-info-row__key">{{$t('common.fields.created_by')}}</span>
                  <span class="gorda-info-row__value">{{ createdBy }}</span>
                </div>
                <div class="gorda-info-row" v-if="service.terminated_by !== null">
                  <span class="gorda-info-row__key">{{$t('common.fields.terminated_by')}}</span>
                  <span class="gorda-info-row__value">{{ terminatedBy }}</span>
                </div>
                <div v-if="service.status === 'canceled'" class="mt-3">
                  <h6 class="service-info-card__title">
                    <em class="fa-solid fa-ban me-2 text-danger"></em>
                    {{ $t('common.placeholders.canceled_by_section') }}
                  </h6>
                  <div class="gorda-info-row">
                    <span class="gorda-info-row__key">{{$t('common.fields.canceled_by')}}</span>
                    <span class="gorda-info-row__value">{{ canceledBy }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="service-info-card" v-if="service.driver">
                <h6 class="service-info-card__title">
                  <em class="fa-solid fa-route me-2 service-info-card__icon--route"></em>
                  {{ $t('common.placeholders.route_info') }}
                </h6>
                <div class="gorda-info-row">
                  <span class="gorda-info-row__key">{{$t('services.fields.driver_name')}}</span>
                  <span class="gorda-info-row__value">{{ service.driver.name }}</span>
                </div>
                <div class="gorda-info-row">
                  <span class="gorda-info-row__key">{{$t('drivers.fields.plate')}}</span>
                  <span class="gorda-info-row__value">{{ ServiceHelper.vehiclePlate(service) }}</span>
                </div>
                <div class="gorda-info-row">
                  <span class="gorda-info-row__key">{{$t('services.fields.time')}}</span>
                  <span class="gorda-info-row__value">{{ time }}</span>
                </div>
                <div class="gorda-info-row">
                  <span class="gorda-info-row__key">{{$t('services.fields.distance')}}</span>
                  <span class="gorda-info-row__value">{{ distance }}</span>
                </div>
                <div class="gorda-info-row">
                  <span class="gorda-info-row__key">{{$t('services.fields.fee')}}</span>
                  <span class="gorda-info-row__value">{{ fee }}</span>
                </div>
                <div class="gorda-info-row">
                  <span class="gorda-info-row__key">{{$t('services.fields.deducted')}}</span>
                  <span class="gorda-info-row__value">{{ deducted }}</span>
                </div>
                <div class="gorda-info-row">
                  <span class="gorda-info-row__key">{{$t('services.fields.fee_multiplier')}}</span>
                  <span class="gorda-info-row__value">{{ multiplier }}</span>
                </div>
                <div class="gorda-info-row" v-if="service.assigned_by !== null">
                  <span class="gorda-info-row__key">{{$t('common.fields.assigned_by')}}</span>
                  <span class="gorda-info-row__value">{{ assignedBy }}</span>
                </div>
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
import ClientCompletedBadge from '@/components/services/ClientCompletedBadge.vue'
import { ServiceList } from '@/models/ServiceList'
import Service from '@/models/Service'
import DateHelper from '@/helpers/DateHelper'
import ServiceHelper from '@/helpers/ServiceHelper'
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
  const explicit = props.service.origin
  const kind = explicit === 'admin' ? 'admin'
    : explicit === 'bot' ? 'bot'
    : props.service.created_by ? 'admin'
    : props.service.wp_client_id ? 'bot'
    : 'unknown'
  if (kind === 'admin') {
    return { kind: 'admin' as const, label: t('services.origin.admin'), sublabel: createdBy.value || null }
  }
  if (kind === 'bot') {
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
    case Service.STATUS_PENDING: return 'warning'
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

const deducted = computed(() => {
  const value = props.service.deducted_value ?? props.service.metadata?.discount ?? 0
  return value + branchSelected?.currency_code
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
.gorda-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.6rem;
  border-radius: 50rem;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1;
  white-space: nowrap;
}

.gorda-status-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex: none;
}

.gorda-status-badge--success {
  background: var(--badge-success-bg);
  color: var(--badge-success-fg);
}

.gorda-status-badge--danger {
  background: var(--badge-danger-bg);
  color: var(--badge-danger-fg);
}

.gorda-status-badge--info {
  background: var(--badge-info-bg);
  color: var(--badge-info-fg);
}

.gorda-status-badge--warning {
  background: var(--badge-warning-bg);
  color: var(--badge-warning-fg);
}

.gorda-status-badge--secondary {
  background: var(--badge-secondary-bg);
  color: var(--badge-secondary-fg);
}

.gorda-icon-btn {
  width: 32px;
  height: 32px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0.5rem;
  background: var(--surface-input);
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
}

.service-info-card {
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: 0.75rem;
  padding: 1rem 1.15rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.service-info-card__title {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
}

.service-info-card__icon--info {
  color: #17c1e8;
}

.service-info-card__icon--route {
  color: #cb0c9f;
}

.gorda-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 0.82rem;
}

.gorda-info-row:last-child {
  border-bottom: none;
}

.gorda-info-row__key {
  color: var(--text-secondary);
  white-space: nowrap;
}

.gorda-info-row__value {
  color: var(--text-heading);
  font-weight: 600;
  text-align: right;
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
  background: #82d616;
  border: 2px solid #82d616;
  box-shadow: 0 0 0 4px rgba(130, 214, 22, 0.18);
}

.tl-dot--inactive {
  background: transparent;
  border: 2px solid var(--border-color);
}

.tl-dot--danger {
  background: var(--danger, #f5365c);
  border: 2px solid var(--danger, #f5365c);
  box-shadow: none;
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
  background: var(--border-color);
  opacity: 0.4;
}

.tl-segment--danger::before {
  background: var(--danger, #f5365c);
  opacity: 0.7;
}

.tl-duration {
  position: relative;
  z-index: 1;
  background: var(--surface-card);
  padding: 0 5px;
  font-size: 0.65rem;
  color: var(--text-secondary);
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

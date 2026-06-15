<template>
  <div class="mx-3">
    <div class="card mb-4">
      <div class="row m-3 align-items-center">
        <!-- Heading: Drivers · <total> -->
        <div class="col-auto" v-if="currentUser && currentUser.isAdmin()">
          <h6 class="ms-2 mb-0">Drivers &middot; {{ total }}</h6>
        </div>

        <!-- Send message (broadcast, no driver selected) button + modal -->
        <div class="col-auto">
          <button class="btn btn-sm btn-warning" @click="showSendMessageModal()">
            {{ $t('common.actions.send_message') }}
          </button>
          <SendFcmModal
            :key="messageTo?.id ?? 'broadcast'"
            ref="sendFcmModal"
            :driver="messageTo"
            @close="closeSendMessageModal"
          />
        </div>

        <!-- Spacer -->
        <div class="col"></div>

        <!-- Create driver button -->
        <div class="col-auto">
          <router-link
            :to="{ name: 'drivers.create' }"
            tag="a"
            class="btn btn-sm btn-primary btn-rounded float-end"
            data-original-title="Create Driver"
          >
            <em class="fas fa-plus"></em>
          </router-link>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="mx-3 mb-2">
        <DriverFiltersBar
          :filters="filters"
          :search="search"
          @update:filters="onFiltersUpdate"
          @update:search="onSearchUpdate"
        />
      </div>

      <!-- Bulk actions bar (visible when rows are selected) -->
      <div v-if="selectedIds.size > 0" class="mx-3 mb-2 d-flex align-items-center gap-2 flex-wrap">
        <span class="text-sm text-secondary">
          {{ selectedIds.size }} {{ $t('drivers.bulk.selected') }}
        </span>
        <span class="text-secondary">·</span>
        <button class="btn btn-sm btn-outline-secondary" @click="bulkSendMessage">
          {{ $t('common.actions.send_message') }}
        </button>
        <button class="btn btn-sm btn-outline-success" @click="bulkEnable">
          {{ $t('common.fields.enabled') }}
        </button>
        <button class="btn btn-sm btn-outline-danger" @click="bulkDisable">
          {{ $t('common.fields.disabled') }}
        </button>

        <!-- Bulk send modal (bulk mode) -->
        <SendFcmModal
          v-if="bulkModalOpen"
          key="bulk-send"
          ref="bulkSendFcmModal"
          :driver-ids="Array.from(selectedIds)"
          @close="closeBulkSendModal"
        />
      </div>

      <div class="card-body px-0 pt-0 pb-2">
        <div class="table-responsive p-0">
          <!-- Loading overlay: show spinner row while fetching, but keep existing rows -->
          <div v-if="loading" class="text-center py-2 text-secondary text-xs">
            <em class="fas fa-circle-notch fa-spin me-1"></em>{{ $t('common.messages.waiting') }}
          </div>

          <table class="table align-items-center mb-0" :class="{ 'opacity-50': loading }">
            <caption hidden></caption>
            <thead>
              <tr>
                <!-- Master checkbox -->
                <th style="width: 40px;">
                  <div class="form-check mb-0 d-flex align-items-center justify-content-center">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :checked="rows.length > 0 && selectedIds.size === rows.length"
                      :indeterminate.prop="selectedIds.size > 0 && selectedIds.size < rows.length"
                      @change="onMasterCheckbox"
                    />
                  </div>
                </th>

                <!-- Sortable: name -->
                <th
                  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 cursor-pointer user-select-none"
                  @click="setSort('name')"
                >
                  {{ $t('common.fields.name') }}
                  <span v-if="sortField === 'name'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </th>

                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  {{ $t('common.fields.phone') }}
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  {{ $t('drivers.fields.vehicle') }}
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  {{ $t('drivers.fields.plate') }}
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  {{ $t('common.fields.status') }}
                </th>

                <!-- Sortable: created_at -->
                <th
                  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 cursor-pointer user-select-none"
                  @click="setSort('created_at')"
                >
                  {{ $t('common.fields.createdAt') }}
                  <span v-if="sortField === 'created_at'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </th>

                <!-- Sortable: last_connection -->
                <th
                  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 cursor-pointer user-select-none"
                  @click="setSort('last_connection')"
                >
                  {{ $t('common.fields.lastConnection') }}
                  <span v-if="sortField === 'last_connection'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </th>

                <!-- Sortable: balance -->
                <th
                  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 cursor-pointer user-select-none"
                  @click="setSort('balance')"
                >
                  {{ $t('drivers.fields.balance') }}
                  <span v-if="sortField === 'balance'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </th>

                <!-- Actions column header -->
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  {{ $t('common.actions.edit') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="driver in rows" :key="driver.id">
                <!-- Per-row checkbox -->
                <td>
                  <div class="form-check mb-0 d-flex align-items-center justify-content-center">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :checked="selectedIds.has(driver.id)"
                      @change="onRowCheckbox(driver.id)"
                    />
                  </div>
                </td>

                <!-- Name + email -->
                <td class="py-0">
                  <div class="d-flex px-2 py-1">
                    <div>
                      <img :src="driver.photoUrl || ''" class="avatar avatar-sm me-3" alt="Profile" />
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-sm">{{ driver.name }}</h6>
                      <p class="text-xs text-secondary mb-0">{{ driver.email }}</p>
                    </div>
                  </div>
                </td>

                <td>
                  <p class="text-xs font-weight-bold mb-0">{{ driver.phone }}</p>
                </td>

                <!-- Vehicle brand + model -->
                <td class="py-0">
                  <div class="d-flex px-2 py-1">
                    <div>
                      <img :src="driver.vehicle.photoUrl || ''" class="avatar avatar-sm me-3" alt="Profile" />
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-sm">{{ driver.vehicle.brand }}</h6>
                      <p class="text-xs text-secondary mb-0">{{ driver.vehicle.model }}</p>
                    </div>
                  </div>
                </td>

                <td>
                  <p class="text-xs font-weight-bold mb-0">{{ driver.vehicle.plate }}</p>
                </td>

                <td class="align-middle text-center text-sm">
                  <span
                    class="badge badge-sm"
                    :class="driver.enabled_at ? 'bg-gradient-success' : 'bg-gradient-danger'"
                  >
                    {{ $t(driver.enabled_at ? 'common.fields.enabled' : 'common.fields.disabled') }}
                  </span>
                </td>

                <td class="align-middle text-center">
                  <span class="text-secondary text-xs font-weight-bold">{{ format(driver.created_at) }}</span>
                </td>

                <td class="align-middle text-center">
                  <span class="text-secondary text-xs font-weight-bold">{{ format(driver.last_connection) }}</span>
                </td>

                <td class="align-middle text-center">
                  <span class="text-secondary text-xs font-weight-bold">{{ driver.balance }}</span>
                </td>

                <!-- Actions -->
                <td class="align-middle">
                  <div class="d-flex align-items-center gap-1 px-1">
                    <div class="form-check form-switch mb-0">
                      <input
                        class="form-check-input"
                        name="enable"
                        type="checkbox"
                        role="switch"
                        :checked="driver.enabled_at > 0"
                        :id="driver.id"
                        @change="onEnable"
                      />
                    </div>
                    <router-link
                      :to="{ name: 'drivers.edit', params: { id: driver.id } }"
                      tag="a"
                      class="btn btn-sm btn-outline-primary px-2"
                      :title="$t('common.actions.edit')"
                    >
                      <em class="fas fa-pencil"></em>
                    </router-link>
                    <button
                      class="btn btn-sm btn-outline-secondary px-2"
                      :title="$t('common.actions.send_message')"
                      @click="showSendMessageModal(driver)"
                    >
                      <em class="fas fa-paper-plane"></em>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Paginator -->
          <div class="container mt-2">
            <PagePaginator
              :total="total"
              :page="page"
              :per-page="perPage"
              @update:page="onPageUpdate"
              @update:per-page="onPerPageUpdate"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DateHelper from '@/helpers/DateHelper'
import DriverRepository from '@/repositories/DriverRepository'
import { useDriversStore } from '@/services/stores/DriversStore'
import AuthService from '@/services/AuthService'
import ToastService from '@/services/ToastService'
import { useLoadingState } from '@/services/stores/LoadingState'
import i18n from '@/plugins/i18n'
import dayjs from 'dayjs'
import { Modal } from 'bootstrap'
import { DriverInterface } from '@/types/DriverInterface'
import type { ActiveFilters } from '@/types/ActiveFilters'
import DriverFiltersBar from '@/components/drivers/DriverFiltersBar.vue'
import PagePaginator from '@/components/PagePaginator.vue'
import SendFcmModal from '@/views/drivers/SendFCMModal.vue'

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_SORT = 'name'
const DEFAULT_PAGE = 1
const DEFAULT_PER_PAGE = 30

// ── Router / route ────────────────────────────────────────────────────────────

const route = useRoute()
const router = useRouter()

// ── Store (map/connected drivers — untouched) ─────────────────────────────────

const { findById } = useDriversStore()
// Note: DriversStore.filter() is no longer used here; it has no other consumers.

// ── Auth ──────────────────────────────────────────────────────────────────────

const currentUser = AuthService.getCurrentUser()
const { setLoading } = useLoadingState()

// ── URL-derived state ─────────────────────────────────────────────────────────

function parseSort(raw: string | undefined): { field: string; dir: 'asc' | 'desc' } {
  if (!raw) return { field: 'name', dir: 'asc' }
  if (raw.startsWith('-')) return { field: raw.slice(1), dir: 'desc' }
  return { field: raw, dir: 'asc' }
}

function parseFilters(q: typeof route.query): ActiveFilters {
  const f: ActiveFilters = {}
  if (q.status === 'enabled' || q.status === 'disabled') f.status = q.status
  if (q.paymentMode === 'monthly' || q.paymentMode === 'percentage') f.paymentMode = q.paymentMode
  if (q.inactiveDays) {
    const n = Number(q.inactiveDays)
    if (n > 0) f.inactiveDays = n
  }
  return f
}

const initialSort = parseSort(route.query.sort as string | undefined)
const sortField = ref<string>(initialSort.field)
const sortDir = ref<'asc' | 'desc'>(initialSort.dir)
const search = ref<string>((route.query.search as string) || '')
const filters = ref<ActiveFilters>(parseFilters(route.query))
const page = ref<number>(route.query.page ? Math.max(1, Number(route.query.page)) : DEFAULT_PAGE)
const perPage = ref<number>(
  route.query.perPage ? Number(route.query.perPage) : DEFAULT_PER_PAGE
)

// ── Debounce helpers ──────────────────────────────────────────────────────────

// The committed search value that drives fetches. Updated either by debounce or
// immediate flush so that non-search interactions do not race a pending debounce.
const committedSearch = ref<string>(search.value)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function flushSearch(): void {
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  committedSearch.value = search.value
}

function scheduleSearchCommit(): void {
  if (debounceTimer !== null) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    committedSearch.value = search.value
    debounceTimer = null
    commitUrlState()
  }, 300)
}

// ── Sort helper ───────────────────────────────────────────────────────────────

const sortParam = computed<string>(() =>
  sortDir.value === 'desc' ? `-${sortField.value}` : sortField.value
)

function setSort(field: string): void {
  flushSearch()
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDir.value = 'asc'
  }
  page.value = 1
  clearSelection()
  commitUrlState()
}

// ── URL state commit ──────────────────────────────────────────────────────────

function commitUrlState(): void {
  const q: Record<string, string | undefined> = {}

  if (committedSearch.value !== '') q.search = committedSearch.value
  if (filters.value.status !== undefined) q.status = filters.value.status
  if (filters.value.paymentMode !== undefined) q.paymentMode = filters.value.paymentMode
  if (filters.value.inactiveDays !== undefined) q.inactiveDays = String(filters.value.inactiveDays)
  if (sortParam.value !== DEFAULT_SORT) q.sort = sortParam.value
  if (page.value !== DEFAULT_PAGE) q.page = String(page.value)
  if (perPage.value !== DEFAULT_PER_PAGE) q.perPage = String(perPage.value)

  router.replace({ query: q })
}

// ── Event handlers from DriverFiltersBar ──────────────────────────────────────

function onSearchUpdate(value: string): void {
  search.value = value
  page.value = 1
  clearSelection()
  scheduleSearchCommit()
}

function onFiltersUpdate(value: ActiveFilters): void {
  flushSearch()
  filters.value = value
  page.value = 1
  clearSelection()
  commitUrlState()
}

// ── Paginator event handlers ──────────────────────────────────────────────────

function onPageUpdate(value: number): void {
  flushSearch()
  page.value = value
  clearSelection()
  commitUrlState()
}

function onPerPageUpdate(value: number): void {
  flushSearch()
  perPage.value = value
  page.value = 1  // page size change resets to page 1
  clearSelection()
  commitUrlState()
}

// ── Data state ────────────────────────────────────────────────────────────────

const rows = ref<DriverInterface[]>([])
const total = ref<number>(0)
const loading = ref<boolean>(false)

// Incrementing counter used to force a re-fetch after bulk actions
// without changing any filter/sort/page state.
const fetchTick = ref<number>(0)

function triggerRefetch(): void {
  fetchTick.value += 1
}

// ── Fetch logic ───────────────────────────────────────────────────────────────

watchEffect(async () => {
  // Capture reactive dependencies
  void fetchTick.value  // tracked to allow forced refetch
  const _search = committedSearch.value
  const _status = filters.value.status
  const _paymentMode = filters.value.paymentMode
  const _inactiveDays = filters.value.inactiveDays
  const _sort = sortParam.value
  const _page = page.value
  const _perPage = perPage.value

  loading.value = true
  try {
    const result = await DriverRepository.list({
      search: _search || undefined,
      status: _status,
      paymentMode: _paymentMode,
      inactiveDays: _inactiveDays,
      sort: _sort,
      page: _page,
      perPage: _perPage,
    })
    rows.value = result.drivers
    total.value = result.total

    // Clamp page if overshoot
    if (result.total > 0 && (_page - 1) * _perPage >= result.total) {
      page.value = 1
      commitUrlState()
    }
  } catch (e: any) {
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e?.message)
  } finally {
    loading.value = false
  }
})

// ── Selection state ───────────────────────────────────────────────────────────

const selectedIds = ref<Set<string>>(new Set())

function clearSelection(): void {
  selectedIds.value = new Set()
}

function onMasterCheckbox(event: Event): void {
  const checked = (event.target as HTMLInputElement).checked
  if (checked) {
    selectedIds.value = new Set(rows.value.map(d => d.id))
  } else {
    selectedIds.value = new Set()
  }
}

function onRowCheckbox(id: string): void {
  const next = new Set(selectedIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  selectedIds.value = next
}

// ── Per-row enable/disable (existing single-driver flow) ──────────────────────

function onEnable(event: Event): void {
  setLoading(true)
  const target = event.target as HTMLInputElement
  const driver = findById(target.id) ?? ({ id: target.id, enabled_at: 0 } as any)
  const enabledAt = target.checked ? dayjs().unix() : 0
  DriverRepository.enable(driver.id, enabledAt)
    .then(() => {
      setLoading(false)
      const message =
        enabledAt === 0
          ? i18n.global.t('users.messages.disabled')
          : i18n.global.t('users.messages.enabled')
      ToastService.toast(ToastService.SUCCESS, message)
    })
    .catch((e: any) => {
      setLoading(false)
      ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
    })
}

// ── Single-driver send message modal ─────────────────────────────────────────

const sendFcmModal = ref<Modal | null>(null)
const messageTo = ref<DriverInterface | null>(null)

async function showSendMessageModal(driver: DriverInterface | null = null): Promise<void> {
  messageTo.value = driver
  await nextTick()
  sendFcmModal.value = new Modal(document.getElementById('send-fcm-modal') as HTMLElement)
  sendFcmModal.value.show()
}

function closeSendMessageModal(): void {
  if (sendFcmModal.value) {
    sendFcmModal.value.hide()
  }
  messageTo.value = null
}

// ── Bulk actions ──────────────────────────────────────────────────────────────

const bulkSendFcmModal = ref<Modal | null>(null)
const bulkModalOpen = ref(false)

async function bulkSendMessage(): Promise<void> {
  bulkModalOpen.value = true
  await nextTick()
  const el = document.getElementById('send-fcm-modal')
  if (el) {
    bulkSendFcmModal.value = new Modal(el)
    bulkSendFcmModal.value.show()
  }
}

function closeBulkSendModal(): void {
  if (bulkSendFcmModal.value) {
    bulkSendFcmModal.value.hide()
  }
  bulkModalOpen.value = false
  clearSelection()
  triggerRefetch()
}

async function bulkEnable(): Promise<void> {
  const ids = Array.from(selectedIds.value)
  setLoading(true)
  try {
    const result = await DriverRepository.bulkEnable(ids)
    const message = i18n.global.t('drivers.bulk.enable_result', {
      processed: result.processed,
      failed: result.failed.length,
    })
    ToastService.toast(result.failed.length === 0 ? ToastService.SUCCESS : ToastService.ERROR, message)
  } catch (e: any) {
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e?.message)
  } finally {
    setLoading(false)
    clearSelection()
    triggerRefetch()
  }
}

async function bulkDisable(): Promise<void> {
  const ids = Array.from(selectedIds.value)
  const confirmed = window.confirm(
    i18n.global.t('drivers.bulk.disable_confirm', { count: ids.length })
  )
  if (!confirmed) return

  setLoading(true)
  try {
    const result = await DriverRepository.bulkDisable(ids)
    const message = i18n.global.t('drivers.bulk.disable_result', {
      processed: result.processed,
      failed: result.failed.length,
    })
    ToastService.toast(result.failed.length === 0 ? ToastService.SUCCESS : ToastService.ERROR, message)
  } catch (e: any) {
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e?.message)
  } finally {
    setLoading(false)
    clearSelection()
    triggerRefetch()
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function format(unix: number): string {
  return DateHelper.unixToDate(unix, 'YYYY-MM-DD')
}
</script>

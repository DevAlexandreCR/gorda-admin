<template>
  <div class="container-fluid d-flex align-items-center flex-wrap gap-2 row py-2">

    <!-- Summary -->
    <div class="col-12 col-md-auto text-secondary text-sm mb-1 mb-md-0">
      <span v-if="total === 0" class="text-muted fst-italic">
        {{ t('common.paginator.empty') }}
      </span>
      <span v-else>
        {{ t('common.paginator.summary', { from: rangeFrom, to: rangeTo, total }) }}
      </span>
    </div>

    <!-- Spacer -->
    <div class="col d-none d-md-block"></div>

    <!-- Items per page -->
    <div class="col-auto d-inline-flex align-items-center gap-2">
      <label class="text-secondary text-sm text-nowrap mb-0">{{ t('common.paginator.per_page') }}</label>
      <select
        class="form-select form-select-sm"
        :value="perPage"
        :disabled="total === 0"
        @change="onPerPageChange"
      >
        <option v-for="opt in resolvedPerPageOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <!-- Numbered pagination -->
    <nav aria-label="Page navigation" class="col-auto">
      <ul class="pagination pagination-sm mb-0">

        <!-- Previous -->
        <li class="page-item" :class="{ disabled: page <= 1 || total === 0 }">
          <button
            class="page-link"
            :disabled="page <= 1 || total === 0"
            @click="emitPage(page - 1)"
            type="button"
            aria-label="Previous"
          >&lsaquo;</button>
        </li>

        <!-- Numbered + ellipsis -->
        <template v-for="(item, idx) in pageItems" :key="idx">
          <li v-if="item === '...'" class="page-item disabled">
            <span class="page-link">…</span>
          </li>
          <li v-else class="page-item" :class="{ active: item === page, disabled: total === 0 }">
            <button
              class="page-link cursor-pointer"
              type="button"
              :disabled="total === 0"
              @click="emitPage(item as number)"
            >{{ item }}</button>
          </li>
        </template>

        <!-- Next -->
        <li class="page-item" :class="{ disabled: page >= totalPages || total === 0 }">
          <button
            class="page-link"
            :disabled="page >= totalPages || total === 0"
            @click="emitPage(page + 1)"
            type="button"
            aria-label="Next"
          >&rsaquo;</button>
        </li>
      </ul>
    </nav>

    <!-- Go to page -->
    <div class="col-auto d-inline-flex align-items-center gap-2">
      <label class="text-secondary text-sm text-nowrap mb-0">{{ t('common.paginator.go_to_page') }}</label>
      <div class="d-flex flex-column">
        <input
          class="form-control form-control-sm"
          style="width: 64px"
          type="number"
          min="1"
          :max="totalPages"
          :disabled="total === 0"
          v-model.number="jumpInput"
          @keydown.enter="commitJump"
          @blur="commitJump"
          :class="{ 'is-invalid': jumpError }"
        />
        <div v-if="jumpError" class="invalid-feedback d-block" style="font-size: 0.7rem; white-space: nowrap;">
          1–{{ totalPages }}
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  total: number
  page: number
  perPage: number
  perPageOptions?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  perPageOptions: () => [20, 30, 50]
})

const emit = defineEmits<{
  'update:page': [value: number]
  'update:perPage': [value: number]
}>()

// ── Computed ──────────────────────────────────────────────────────────────────

const resolvedPerPageOptions = computed(() => props.perPageOptions)

const totalPages = computed(() => {
  if (props.total === 0 || props.perPage <= 0) return 1
  return Math.ceil(props.total / props.perPage)
})

const rangeFrom = computed(() => (props.page - 1) * props.perPage + 1)
const rangeTo = computed(() => Math.min(props.page * props.perPage, props.total))

/** Build the list of page numbers / ellipsis markers to render. */
const pageItems = computed((): (number | '...')[] => {
  const n = totalPages.value
  const p = props.page

  if (n <= 7) {
    return Array.from({ length: n }, (_, i) => i + 1)
  }

  // Page near the start — show leading window
  if (p <= 3) {
    return [1, 2, 3, '...', n]
  }

  // Page near the end — show trailing window
  if (p >= n - 2) {
    return [1, '...', n - 2, n - 1, n]
  }

  // General middle case
  return [1, '...', p - 1, p, p + 1, '...', n]
})

// ── Jump input ────────────────────────────────────────────────────────────────

const jumpInput = ref<number>(props.page)
const jumpError = ref(false)

watch(() => props.page, (val) => {
  jumpInput.value = val
  jumpError.value = false
})

function commitJump(): void {
  const val = jumpInput.value
  if (!Number.isInteger(val) || val < 1 || val > totalPages.value) {
    jumpError.value = true
    jumpInput.value = props.page // revert
    return
  }
  jumpError.value = false
  if (val !== props.page) {
    emit('update:page', val)
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function emitPage(p: number): void {
  if (p < 1 || p > totalPages.value || p === props.page) return
  emit('update:page', p)
}

function onPerPageChange(event: Event): void {
  const value = Number((event.target as HTMLSelectElement).value)
  emit('update:perPage', value)
}
</script>

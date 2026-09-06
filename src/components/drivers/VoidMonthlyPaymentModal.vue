<template>
  <div class="modal fade" id="void-monthly-payment-modal" ref="modalEl" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content border-0 rounded-3">
        <div class="modal-header border-bottom">
          <div class="d-flex align-items-center gap-2">
            <span class="modal-icon-chip modal-icon-chip-danger">
              <em class="fas fa-ban"></em>
            </span>
            <h6 class="modal-title mb-0">{{ $t('drivers.monthly_payments.void_modal_title') }}</h6>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="voidingPayment" class="rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center payhist-void-summary">
            <span class="payhist-period-pill">{{ voidingPayment.period }}</span>
            <span class="fw-bold">{{ (voidingPayment.amount ?? 0).toLocaleString('es-CO') + ' COP' }}</span>
          </div>
          <div class="form-group">
            <label>{{ $t('drivers.monthly_payments.field_void_reason') }}</label>
            <textarea class="form-control mt-1" rows="3" v-model="voidReason"
                      :placeholder="$t('drivers.monthly_payments.placeholder_void_reason')"></textarea>
          </div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            {{ $t('common.actions.cancel') }}
          </button>
          <button @click="confirmVoidPayment" type="button" class="btn bg-gradient-danger" :disabled="!voidReason.trim() || submittingVoid">
            <span v-if="submittingVoid" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            <em v-else class="fas fa-ban me-1"></em>{{ $t('drivers.monthly_payments.action_void_confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue'
import { Modal } from 'bootstrap'
import DriverRepository from '@/repositories/DriverRepository'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import { MonthlyPaymentInterface } from '@/types/MonthlyPaymentInterface'

const props = defineProps<{
  driverId?: string
}>()

const emit = defineEmits<{
  voided: [payment: MonthlyPaymentInterface]
  error: [err: unknown]
}>()

const modalEl = ref<HTMLElement | null>(null)
let modalInstance: Modal | null = null

const voidingPayment: Ref<MonthlyPaymentInterface | null> = ref(null)
const voidReason = ref('')
const submittingVoid = ref(false)
const activeDriverId = ref<string | undefined>(undefined)

function open(payment: MonthlyPaymentInterface, driverId?: string): void {
  voidingPayment.value = payment
  voidReason.value = ''
  activeDriverId.value = driverId ?? props.driverId
  const el = modalEl.value
  if (!el) return
  modalInstance = Modal.getOrCreateInstance(el)
  modalInstance.show()
}

defineExpose({ open })

onMounted(() => {
  const el = modalEl.value
  if (el) {
    el.addEventListener('hidden.bs.modal', () => {
      voidingPayment.value = null
      voidReason.value = ''
    })
  }
})

async function confirmVoidPayment(): Promise<void> {
  const payment = voidingPayment.value
  const driverId = activeDriverId.value
  if (!payment || !driverId || !voidReason.value.trim()) return
  submittingVoid.value = true
  try {
    await DriverRepository.voidMonthlyPayment(driverId, payment.id, voidReason.value.trim())
    modalInstance?.hide()
    await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
    emit('voided', payment)
  } catch (e: any) {
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
    emit('error', e)
  } finally {
    submittingVoid.value = false
  }
}
</script>

<style scoped>
.modal-icon-chip {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  background: linear-gradient(310deg, #7928ca, #ff0080);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.78rem;
  flex: none;
}

.modal-icon-chip-danger {
  background: linear-gradient(310deg, #ea0606, #ff667c);
}

.payhist-void-summary {
  background: var(--badge-secondary-bg);
}

.payhist-period-pill {
  background: var(--badge-primary-bg);
  color: var(--badge-primary-fg);
  padding: 0.15rem 0.55rem;
  border-radius: 50rem;
  font-size: 0.72rem;
  font-weight: 700;
}
</style>

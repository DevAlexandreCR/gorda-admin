<template>
  <div class="container-fluid py-4 px-4 billing-page">
    <div class="row mb-3 align-items-end billing-page-header">
      <div class="col">
        <p class="text-sm text-muted mb-0 text-uppercase font-weight-bold tracking-wider">Administración</p>
        <h5 class="mb-0 font-weight-bolder">Facturación</h5>
      </div>
      <div class="col-auto">
        <label class="card shadow-sm border-0 billing-month-control">
          <div class="billing-icon billing-icon--month billing-panel-icon-secondary billing-month-icon-button">
            <em class="fas fa-calendar-days text-white"></em>
            <input
              type="month"
              class="billing-month-input"
              v-model="selectedMonth"
            />
          </div>
          <span class="text-sm font-weight-bold billing-month-value">{{ selectedMonthLabel }}</span>
        </label>
      </div>
    </div>

    <div class="row g-3 mb-4 billing-stats-grid">
      <div class="col-6 col-lg-3">
        <div class="card shadow billing-stat-card">
          <div class="card-header p-3 pt-2 billing-stat-card__header">
            <div class="billing-icon billing-icon--stat billing-stat-card__icon billing-stat-icon-dark">
              <em class="fas fa-layer-group text-white"></em>
            </div>
            <div class="text-end pt-1 billing-stat-card__content">
              <p class="text-sm mb-0 text-capitalize">Total servicios</p>
              <h4 class="mb-0 font-weight-bolder">{{ stats.total }}</h4>
            </div>
          </div>
          <hr class="dark horizontal my-0" />
          <div class="card-footer p-3">
            <p class="mb-0 text-sm">
              <span class="text-success font-weight-bolder me-1">{{ selectedMonthLabel }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="card shadow billing-stat-card">
          <div class="card-header p-3 pt-2 billing-stat-card__header">
            <div class="billing-icon billing-icon--stat billing-stat-card__icon billing-stat-icon-success">
              <em class="fas fa-circle-check text-white"></em>
            </div>
            <div class="text-end pt-1 billing-stat-card__content">
              <p class="text-sm mb-0 text-capitalize">Completados</p>
              <h4 class="mb-0 font-weight-bolder">{{ stats.completed }}</h4>
            </div>
          </div>
          <hr class="dark horizontal my-0" />
          <div class="card-footer p-3">
            <p class="mb-0 text-sm">
              <span class="text-success font-weight-bolder me-1">{{ completedPercent }}%</span>
              <span class="text-muted">tasa de éxito</span>
            </p>
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="card shadow billing-stat-card">
          <div class="card-header p-3 pt-2 billing-stat-card__header">
            <div class="billing-icon billing-icon--stat billing-stat-card__icon billing-stat-icon-danger">
              <em class="fas fa-ban text-white"></em>
            </div>
            <div class="text-end pt-1 billing-stat-card__content">
              <p class="text-sm mb-0 text-capitalize">Cancelados</p>
              <h4 class="mb-0 font-weight-bolder">{{ stats.canceled }}</h4>
            </div>
          </div>
          <hr class="dark horizontal my-0" />
          <div class="card-footer p-3">
            <p class="mb-0 text-sm">
              <span :class="stats.canceled > 0 ? 'text-danger' : 'text-success'" class="font-weight-bolder me-1">{{ stats.cancelPercent }}%</span>
              <span class="text-muted">cancelación</span>
            </p>
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="card shadow billing-stat-card">
          <div class="card-header p-3 pt-2 billing-stat-card__header">
            <div class="billing-icon billing-icon--stat billing-stat-card__icon billing-stat-icon-primary">
              <em class="fas fa-file-invoice-dollar text-white"></em>
            </div>
            <div class="text-end pt-1 billing-stat-card__content">
              <p class="text-sm mb-0 text-capitalize">Total cobro</p>
              <h5 class="mb-0 font-weight-bolder">{{ formatCopCompact(totalCop) }}</h5>
            </div>
          </div>
          <hr class="dark horizontal my-0" />
          <div class="card-footer p-3">
            <p class="mb-0 text-sm">
              <span class="text-primary font-weight-bolder me-1">COP</span>
              <span class="text-muted">pesos colombianos</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-xl-5">
        <div class="card shadow border-0 mb-3 billing-panel">
          <div class="card-header border-0 pb-0 billing-panel__header">
            <div class="d-flex align-items-center">
              <div class="billing-icon billing-icon--panel billing-panel-icon-primary me-2">
                <em class="fas fa-mobile-screen text-white"></em>
              </div>
              <div>
                <h6 class="mb-0">Cobros por línea</h6>
                <p class="text-xs text-muted mb-0">Monto mensual por cada cliente WhatsApp</p>
              </div>
            </div>
          </div>
          <div class="card-body pt-3">
            <div v-if="lineCharges.length === 0" class="text-center py-3 text-muted text-sm billing-empty-state">
              <em class="fas fa-mobile-screen fa-lg mb-2 d-block opacity-50"></em>
              Sin líneas configuradas
            </div>
            <div v-for="charge in lineCharges" :key="charge.wpClientId" class="billing-charge-row mb-2">
              <div class="d-flex align-items-center justify-content-between py-2 px-3 border-radius-lg billing-charge-item">
                <div class="d-flex align-items-center gap-2">
                  <div class="billing-icon billing-icon--avatar billing-avatar">
                    <em class="fas fa-phone text-white"></em>
                  </div>
                  <span class="text-sm font-weight-bold">{{ charge.alias }}</span>
                </div>
                <div class="d-flex align-items-center gap-1 billing-amount">
                  <input
                    type="number"
                    class="form-control form-control-sm text-end font-weight-bold billing-amount-input"
                    v-model.number="charge.amountCop"
                    min="0"
                    placeholder="0"
                  />
                  <span class="text-xs text-muted">COP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card shadow border-0 mb-3 billing-panel">
          <div class="card-header border-0 pb-0 billing-panel__header">
            <div class="d-flex align-items-center">
              <div class="billing-icon billing-icon--panel billing-panel-icon-info me-2">
                <em class="fas fa-laptop-code text-white"></em>
              </div>
              <div>
                <h6 class="mb-0">Software rental</h6>
                <p class="text-xs text-muted mb-0">Licencia mensual de uso de la plataforma</p>
              </div>
            </div>
          </div>
          <div class="card-body pt-3">
            <div class="d-flex align-items-center gap-2 billing-inline-amount">
              <input
                type="number"
                class="form-control form-control-sm font-weight-bold"
                v-model.number="softwareRental"
                min="0"
                placeholder="0"
              />
              <span class="text-xs text-muted text-nowrap">COP / mes</span>
            </div>
          </div>
        </div>

        <div class="card shadow border-0 mb-3 billing-panel">
          <div class="card-header border-0 pb-0 billing-panel__header">
            <div class="d-flex align-items-center billing-panel__title">
              <div class="billing-icon billing-icon--panel billing-panel-icon-warning me-2">
                <em class="fas fa-circle-plus text-white"></em>
              </div>
              <div>
                <h6 class="mb-0">Otros cobros</h6>
                <p class="text-xs text-muted mb-0">Cargos adicionales para este mes</p>
              </div>
              <button class="btn btn-sm btn-outline-primary mb-0 py-1 px-2 ms-auto billing-add-button" @click="addExtra">
                <em class="fas fa-plus me-1"></em>Agregar
              </button>
            </div>
          </div>
          <div class="card-body pt-3">
            <div v-if="extras.length === 0" class="text-center py-2 text-sm text-muted billing-empty-state">
              Sin cobros adicionales este mes
            </div>
            <div v-for="(extra, idx) in extras" :key="idx" class="d-flex align-items-center gap-2 mb-2 billing-extra-row">
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Descripción del cobro"
                v-model="extra.description"
              />
              <input
                type="number"
                class="form-control form-control-sm text-end font-weight-bold billing-extra-amount-input"
                placeholder="0"
                v-model.number="extra.amountCop"
                min="0"
              />
              <span class="text-xs text-muted">COP</span>
              <button class="btn btn-sm btn-link text-danger mb-0 px-1 py-0 billing-delete-button" @click="removeExtra(idx)" title="Eliminar">
                <em class="fas fa-trash-can text-sm"></em>
              </button>
            </div>
          </div>
        </div>

        <div class="card shadow border-0 billing-panel">
          <div class="card-body p-3">
            <div class="border-radius-lg p-3 mb-3 d-flex align-items-center justify-content-between billing-total-banner">
              <div>
                <p class="text-xs text-white opacity-8 text-uppercase mb-1 tracking-wider">Total a cobrar este mes</p>
                <h3 class="text-white mb-0 font-weight-bolder">{{ formatCop(totalCop) }}</h3>
              </div>
              <div class="billing-icon billing-icon--total billing-total-banner__icon">
                <em class="fas fa-receipt text-dark"></em>
              </div>
            </div>

            <label class="form-label text-xs font-weight-bold text-uppercase text-muted mb-1">Destinatario</label>
            <div class="position-relative mb-3 billing-recipient-field">
              <em class="fas fa-envelope position-absolute text-muted billing-field-icon"></em>
              <input
                type="email"
                class="form-control form-control-sm billing-email-input"
                v-model="recipientEmail"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <transition name="fade">
              <div
                v-if="notification"
                :class="[
                  'alert py-2 text-sm mb-3 billing-alert',
                  notification.type === 'success'
                    ? 'alert-success billing-alert-success'
                    : 'alert-danger billing-alert-danger',
                ]"
                role="alert"
              >
                <em :class="`fas ${notification.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'} me-1`"></em>
                {{ notification.message }}
              </div>
            </transition>

            <div class="d-grid gap-2 billing-action-group">
              <button class="btn btn-primary mb-0 billing-action-button billing-action-button--primary" @click="sendInvoice" :disabled="isSending">
                <em class="fas fa-paper-plane me-2"></em>
                {{ isSending ? 'Enviando...' : 'Enviar cuenta de cobro' }}
              </button>
              <button class="btn btn-outline-secondary btn-sm mb-0 billing-action-button billing-action-button--secondary" @click="saveConfig" :disabled="isSaving">
                <em class="fas fa-floppy-disk me-2"></em>
                {{ isSaving ? 'Guardando...' : 'Guardar configuración' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-7">
        <div class="card shadow border-0 billing-panel billing-preview-panel">
          <div class="card-header border-0 pb-0 d-flex align-items-center justify-content-between billing-panel__header">
            <div class="d-flex align-items-center gap-2">
              <div class="billing-icon billing-icon--panel billing-panel-icon-secondary">
                <em class="fas fa-envelope-open-text text-white"></em>
              </div>
              <div>
                <h6 class="mb-0">Vista previa del correo</h6>
                <p class="text-xs text-muted mb-0">Así recibirá el correo el destinatario</p>
              </div>
            </div>
            <span class="badge text-xs px-2 py-1 billing-preview-badge">PREVIEW</span>
          </div>
          <div class="card-body p-2">
            <div class="border-radius-lg overflow-hidden billing-preview-shell">
              <div class="p-3 billing-preview-content" v-html="emailPreviewHtml"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import dayjs from 'dayjs'
import MetricRepository from '@/repositories/MetricRepository'
import BillingRepository, { BillingLineCharge, BillingExtra } from '@/repositories/BillingRepository'

const selectedMonth = ref(dayjs().format('YYYY-MM'))
const lineCharges = ref<BillingLineCharge[]>([])
const softwareRental = ref(0)
const extras = ref<BillingExtra[]>([])
const recipientEmail = ref('')
const isSending = ref(false)
const isSaving = ref(false)
const notification = ref<{ type: 'success' | 'danger'; message: string } | null>(null)
const stats = ref({ total: 0, completed: 0, canceled: 0, cancelPercent: '0.0' })

const selectedMonthLabel = computed(() =>
  dayjs(`${selectedMonth.value}-01`).format('MMM YYYY')
)

const completedPercent = computed(() => {
  if (stats.value.total === 0) return '0.0'
  return ((stats.value.completed / stats.value.total) * 100).toFixed(1)
})

async function loadStats() {
  const startDate = dayjs(`${selectedMonth.value}-01`).format('YYYY-MM-DD')
  const endDate = dayjs(`${selectedMonth.value}-01`).endOf('month').format('YYYY-MM-DD')
  try {
    const metrics = await MetricRepository.getGlobal(startDate, endDate)
    const total = metrics.reduce((sum, m) => sum + m.count, 0)
    const completed = metrics.filter((m) => m.status === 'terminated').reduce((sum, m) => sum + m.count, 0)
    const canceled = metrics.filter((m) => m.status === 'canceled').reduce((sum, m) => sum + m.count, 0)
    const cancelPercent = total > 0 ? ((canceled / total) * 100).toFixed(1) : '0.0'
    stats.value = { total, completed, canceled, cancelPercent }
  } catch {
    stats.value = { total: 0, completed: 0, canceled: 0, cancelPercent: '0.0' }
  }
}

async function loadConfig() {
  try {
    const config = await BillingRepository.getConfig()
    lineCharges.value = config.lineCharges
    softwareRental.value = config.softwareRental
  } catch {
    lineCharges.value = []
    softwareRental.value = 0
  }
}

watch(selectedMonth, loadStats)

onMounted(async () => {
  await Promise.all([loadStats(), loadConfig()])
})

function addExtra() {
  extras.value.push({ description: '', amountCop: 0 })
}

function removeExtra(idx: number) {
  extras.value.splice(idx, 1)
}

const totalCop = computed(() => {
  const lineTotal = lineCharges.value.reduce((sum, c) => sum + (c.amountCop || 0), 0)
  const extrasTotal = extras.value.reduce((sum, e) => sum + (e.amountCop || 0), 0)
  return lineTotal + (softwareRental.value || 0) + extrasTotal
})

function formatCop(amount: number): string {
  return `$${amount.toLocaleString('es-CO')} COP`
}

function formatCopCompact(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}k`
  return `$${amount.toLocaleString('es-CO')}`
}

const emailPreviewHtml = computed(() => {
  const monthName = dayjs(`${selectedMonth.value}-01`).format('MMMM YYYY').toUpperCase()
  const { total, completed, canceled, cancelPercent } = stats.value
  const completePercent = total > 0 ? ((completed / total) * 100).toFixed(1) : '0.0'

  const lineRows = lineCharges.value.map((c) => `
    <tr>
      <td style="padding:10px 16px;font-size:13px;color:#344767;border-bottom:1px solid #f0f2f5">${c.alias}</td>
      <td style="padding:10px 16px;text-align:right;font-size:13px;font-weight:600;color:#344767;border-bottom:1px solid #f0f2f5">${formatCop(c.amountCop)}</td>
    </tr>`).join('')

  const extrasRows = extras.value.map((e) => `
    <tr>
      <td style="padding:10px 16px;font-size:13px;color:#344767;border-bottom:1px solid #f0f2f5">${e.description || '—'}</td>
      <td style="padding:10px 16px;text-align:right;font-size:13px;font-weight:600;color:#344767;border-bottom:1px solid #f0f2f5">${formatCop(e.amountCop)}</td>
    </tr>`).join('')

  return `
<div style="font-family:'Open Sans',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10)">

  <div style="background:linear-gradient(135deg,#7928CA 0%,#cb0c9f 100%);padding:32px 28px;text-align:center">
    <p style="color:rgba(255,255,255,0.75);font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px">Cuenta de cobro mensual</p>
    <h2 style="color:#ffffff;font-size:24px;font-weight:700;margin:0">Gorda Driver</h2>
    <p style="color:rgba(255,255,255,0.9);font-size:15px;margin:8px 0 0;font-weight:500">${monthName}</p>
  </div>

  <div style="padding:24px 28px 8px">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#8392AB;margin:0 0 12px">Resumen de actividad</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #e9ecef">
      <tr style="background:#f8f9fa">
        <td style="padding:10px 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#8392AB">Indicador</td>
        <td style="padding:10px 16px;text-align:right;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#8392AB">Valor</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-size:13px;color:#344767;border-bottom:1px solid #f0f2f5">Total servicios</td>
        <td style="padding:10px 16px;text-align:right;font-size:13px;font-weight:600;color:#344767;border-bottom:1px solid #f0f2f5">${total}</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-size:13px;color:#344767;border-bottom:1px solid #f0f2f5">Completados</td>
        <td style="padding:10px 16px;text-align:right;font-size:13px;font-weight:600;border-bottom:1px solid #f0f2f5"><span style="color:#82d616">${completed}</span> <span style="color:#adb5bd;font-size:11px">(${completePercent}%)</span></td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-size:13px;color:#344767">Cancelados</td>
        <td style="padding:10px 16px;text-align:right;font-size:13px;font-weight:600"><span style="color:#ea0606">${canceled}</span> <span style="color:#adb5bd;font-size:11px">(${cancelPercent}%)</span></td>
      </tr>
    </table>
  </div>

  <div style="padding:20px 28px 8px">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#8392AB;margin:0 0 12px">Detalle de cobros</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #e9ecef">
      <tr style="background:#f8f9fa">
        <td style="padding:10px 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#8392AB">Concepto</td>
        <td style="padding:10px 16px;text-align:right;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#8392AB">Monto</td>
      </tr>
      ${lineRows}
      <tr>
        <td style="padding:10px 16px;font-size:13px;color:#344767;border-bottom:1px solid #f0f2f5">Software rental</td>
        <td style="padding:10px 16px;text-align:right;font-size:13px;font-weight:600;color:#344767;border-bottom:1px solid #f0f2f5">${formatCop(softwareRental.value)}</td>
      </tr>
      ${extrasRows}
      <tr style="background:linear-gradient(135deg,#141727,#3A416F)">
        <td style="padding:16px;font-size:14px;font-weight:700;color:#ffffff">TOTAL</td>
        <td style="padding:16px;text-align:right;font-size:18px;font-weight:700;color:#ffffff">${formatCop(totalCop.value)}</td>
      </tr>
    </table>
  </div>

  <div style="padding:20px 28px 24px;text-align:center">
    <p style="color:#adb5bd;font-size:11px;margin:0;line-height:1.6">Este correo fue generado automáticamente por el sistema Gorda Driver.<br>No responder a este mensaje.</p>
  </div>
</div>`
})

function showNotification(type: 'success' | 'danger', message: string) {
  notification.value = { type, message }
  setTimeout(() => { notification.value = null }, 4000)
}

async function saveConfig() {
  isSaving.value = true
  try {
    await BillingRepository.saveConfig({
      lineCharges: lineCharges.value.map((c) => ({ wpClientId: c.wpClientId, amountCop: c.amountCop })),
      softwareRental: softwareRental.value,
    })
    showNotification('success', 'Configuración guardada correctamente.')
  } catch {
    showNotification('danger', 'Error al guardar la configuración.')
  } finally {
    isSaving.value = false
  }
}

async function sendInvoice() {
  if (!recipientEmail.value.trim()) {
    showNotification('danger', 'Debes ingresar el email del destinatario.')
    return
  }
  isSending.value = true
  try {
    await BillingRepository.sendInvoice({
      month: selectedMonth.value,
      recipientEmail: recipientEmail.value.trim(),
      extras: extras.value,
    })
    showNotification('success', 'Cuenta de cobro enviada correctamente.')
  } catch {
    showNotification('danger', 'Error al enviar la cuenta de cobro.')
  } finally {
    isSending.value = false
  }
}
</script>

<style scoped>
.billing-page {
  --billing-text: var(--card-text, #344767);
  --billing-heading: #344767;
  --billing-muted: var(--muted-text, #8392ab);
  --billing-surface-soft: rgba(0, 0, 0, 0.04);
  --billing-surface-soft-hover: rgba(0, 0, 0, 0.07);
  --billing-border: rgba(0, 0, 0, 0.08);
  --billing-border-strong: rgba(0, 0, 0, 0.14);
  --billing-input-bg: rgba(255, 255, 255, 0.96);
  --billing-shadow: 0 20px 27px 0 rgba(0, 0, 0, 0.05);
  --billing-focus: rgba(203, 12, 159, 0.18);
  --billing-preview-shell-bg: linear-gradient(180deg, #f6f7fb 0%, #eef1f7 100%);
  --billing-preview-shell-border: rgba(52, 71, 103, 0.08);
  --billing-preview-shell-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65), 0 18px 34px rgba(52, 71, 103, 0.08);
  --billing-chip-bg: rgba(131, 146, 171, 0.12);
  --billing-avatar-bg: linear-gradient(310deg, #627594, #a8b8d8);
  --billing-banner-bg: linear-gradient(310deg, #141727, #3a416f);
  --billing-banner-border: transparent;
  --billing-banner-shadow: 0 18px 28px rgba(20, 23, 39, 0.18);
  --billing-add-button-bg: transparent;
  --billing-add-button-border: rgba(121, 40, 202, 0.2);
  --billing-add-button-text: #7928ca;
  --billing-delete-button-bg: transparent;
  --billing-delete-button-border: transparent;
  --billing-delete-button-text: #ea0606;
  --billing-alert-success-bg: rgba(23, 173, 55, 0.12);
  --billing-alert-success-border: rgba(23, 173, 55, 0.18);
  --billing-alert-danger-bg: rgba(234, 6, 6, 0.1);
  --billing-alert-danger-border: rgba(234, 6, 6, 0.16);
  color: var(--billing-text);
}

.billing-page h3,
.billing-page h4,
.billing-page h5,
.billing-page h6 {
  color: var(--billing-heading);
}

.billing-page .text-muted {
  color: var(--billing-muted) !important;
}

.billing-page .card {
  box-shadow: var(--billing-shadow);
}

.billing-month-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--billing-border);
  border-radius: 1rem;
  background: var(--billing-input-bg);
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  cursor: default;
  margin-bottom: 0;
}

.billing-month-control:focus-within {
  border-color: rgba(203, 12, 159, 0.4);
  box-shadow: 0 0 0 0.2rem var(--billing-focus);
}

.billing-month-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  border: 0;
}

.billing-month-input::-webkit-calendar-picker-indicator {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.billing-month-icon-button {
  position: relative;
  cursor: pointer;
}

.billing-month-value {
  color: var(--billing-heading);
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.billing-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  min-width: 32px;
  line-height: 1;
  overflow: hidden;
  color: #ffffff;
  position: relative;
}

.billing-icon em {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  line-height: 1;
  font-size: inherit;
  opacity: 0.98;
  transform: translateY(0);
}

.billing-icon--month,
.billing-icon--panel,
.billing-icon--avatar {
  width: 32px;
  height: 32px;
  border-radius: 0.75rem;
  font-size: 0.85rem;
}

.billing-icon--avatar em {
  font-size: 11px;
}

.billing-icon--total {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 0.85rem;
  font-size: 1rem;
}

.billing-icon--stat {
  width: 64px;
  height: 64px;
  min-width: 64px;
  border-radius: 1rem;
  font-size: 1.35rem;
}

.billing-stat-card {
  border: 1px solid rgba(255, 255, 255, 0);
}

.billing-stat-card__header {
  position: relative;
  min-height: 86px;
}

.billing-stat-card__icon {
  position: absolute;
  top: -1rem;
  left: 1rem;
}

.billing-stat-card__content {
  padding-left: 5rem;
  min-height: 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.billing-stat-card hr,
.billing-panel .card-header,
.billing-panel .card-body,
.billing-panel .card-footer {
  border-color: var(--billing-border) !important;
}

.billing-panel__header {
  border-bottom: 1px solid transparent;
}

.billing-panel__title {
  width: 100%;
  gap: 0.25rem;
}

.billing-empty-state {
  color: var(--billing-muted);
}

.billing-panel__header .d-flex.align-items-center {
  min-height: 32px;
}

.billing-charge-item {
  background: var(--billing-surface-soft);
  border: 1px solid transparent;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.billing-charge-item:hover {
  background: var(--billing-surface-soft-hover);
  border-color: var(--billing-border);
}

.billing-avatar {
  background: var(--billing-avatar-bg);
  box-shadow: 0 10px 18px rgba(98, 117, 148, 0.2);
}

.billing-amount {
  flex: 0 0 auto;
}

.billing-amount-input {
  width: 110px;
}

.billing-extra-amount-input {
  width: 100px;
}

.billing-inline-amount {
  align-items: center;
}

.billing-amount span,
.billing-inline-amount span,
.billing-extra-row span {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 0.55rem;
  border-radius: 999px;
  background: var(--billing-chip-bg);
  border: 1px solid transparent;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.billing-extra-row {
  flex-wrap: wrap;
}

.billing-add-button {
  font-size: 11px;
  border-color: var(--billing-add-button-border);
  background: var(--billing-add-button-bg);
  color: var(--billing-add-button-text);
}

.billing-add-button:hover,
.billing-add-button:focus {
  color: var(--billing-add-button-text);
}

.billing-delete-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  min-height: 32px;
  border-radius: 0.65rem;
  background: var(--billing-delete-button-bg);
  border: 1px solid var(--billing-delete-button-border);
  color: var(--billing-delete-button-text);
}

.billing-delete-button:hover,
.billing-delete-button:focus {
  color: var(--billing-delete-button-text);
}

.billing-total-banner {
  background: var(--billing-banner-bg);
  border: 1px solid var(--billing-banner-border);
  box-shadow: var(--billing-banner-shadow);
}

.billing-total-banner__icon {
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.18);
}

.billing-recipient-field {
  position: relative;
}

.billing-field-icon {
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  pointer-events: none;
}

.billing-email-input {
  padding-left: 30px;
}

.billing-page .form-control {
  background: var(--billing-input-bg) !important;
  color: var(--billing-text) !important;
  border: 1px solid var(--billing-border) !important;
  border-radius: 0.75rem;
  box-shadow: none !important;
}

.billing-page .form-control::placeholder {
  color: var(--billing-muted);
  opacity: 0.85;
}

.billing-page .form-control:focus {
  border-color: rgba(203, 12, 159, 0.4) !important;
  box-shadow: 0 0 0 0.2rem var(--billing-focus) !important;
}

.billing-alert {
  border: 1px solid transparent;
}

.billing-alert-success {
  background: var(--billing-alert-success-bg);
  border-color: var(--billing-alert-success-border);
}

.billing-alert-danger {
  background: var(--billing-alert-danger-bg);
  border-color: var(--billing-alert-danger-border);
}

.billing-action-button {
  min-height: 42px;
}

.billing-action-button--primary {
  box-shadow: 0 10px 24px rgba(121, 40, 202, 0.22);
}

.billing-preview-panel {
  position: sticky;
  top: 20px;
}

.billing-preview-badge {
  background: rgba(131, 146, 171, 0.14);
  border: 1px solid rgba(131, 146, 171, 0.2);
  color: #67748e;
}

.billing-preview-shell {
  position: relative;
  min-height: 400px;
  background: var(--billing-preview-shell-bg);
  border: 1px solid var(--billing-preview-shell-border);
  box-shadow: var(--billing-preview-shell-shadow);
}

.billing-preview-shell::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top right, rgba(121, 40, 202, 0.08), transparent 32%),
    radial-gradient(circle at bottom left, rgba(203, 12, 159, 0.06), transparent 28%);
  pointer-events: none;
}

.billing-preview-content {
  position: relative;
  z-index: 1;
  min-height: 400px;
}

.billing-stat-icon-dark {
  background: linear-gradient(310deg, #141727, #3a416f);
  box-shadow: 0 12px 24px rgba(20, 23, 39, 0.24);
}

.billing-stat-icon-primary,
.billing-panel-icon-primary {
  background: linear-gradient(310deg, #7928ca, #ff0080);
  box-shadow: 0 12px 24px rgba(121, 40, 202, 0.24);
}

.billing-stat-icon-success {
  background: linear-gradient(310deg, #17ad37, #98ec2d);
  box-shadow: 0 12px 24px rgba(23, 173, 55, 0.24);
}

.billing-stat-icon-danger {
  background: linear-gradient(310deg, #ea0606, #ff667c);
  box-shadow: 0 12px 24px rgba(234, 6, 6, 0.24);
}

.billing-panel-icon-info {
  background: linear-gradient(310deg, #2152ff, #21d4fd);
  box-shadow: 0 12px 24px rgba(33, 82, 255, 0.24);
}

.billing-panel-icon-warning {
  background: linear-gradient(310deg, #f53939, #fbcf33);
  box-shadow: 0 12px 24px rgba(245, 57, 57, 0.24);
}

.billing-panel-icon-secondary {
  background: linear-gradient(310deg, #627594, #a8b8d8);
  box-shadow: 0 12px 24px rgba(98, 117, 148, 0.2);
}

body.dark-version .billing-page {
  --billing-text: rgba(255, 255, 255, 0.85);
  --billing-heading: #ffffff;
  --billing-muted: rgba(255, 255, 255, 0.6);
  --billing-surface-soft: rgba(255, 255, 255, 0.04);
  --billing-surface-soft-hover: rgba(255, 255, 255, 0.06);
  --billing-border: rgba(255, 255, 255, 0.08);
  --billing-border-strong: rgba(255, 255, 255, 0.16);
  --billing-input-bg: #1a1d31;
  --billing-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
  --billing-focus: rgba(203, 12, 159, 0.32);
  --billing-preview-shell-bg: linear-gradient(180deg, rgba(224, 216, 231, 0.86) 0%, rgba(202, 193, 214, 0.78) 100%);
  --billing-preview-shell-border: rgba(203, 12, 159, 0.14);
  --billing-preview-shell-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 22px 36px rgba(0, 0, 0, 0.22);
  --billing-chip-bg: rgba(255, 255, 255, 0.08);
  --billing-avatar-bg: linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
  --billing-banner-bg: linear-gradient(160deg, rgba(26, 29, 49, 0.98) 0%, rgba(17, 19, 34, 0.98) 100%);
  --billing-banner-border: rgba(255, 255, 255, 0.08);
  --billing-banner-shadow: 0 20px 32px rgba(0, 0, 0, 0.42);
  --billing-add-button-bg: rgba(121, 40, 202, 0.16);
  --billing-add-button-border: rgba(203, 12, 159, 0.3);
  --billing-add-button-text: rgba(255, 255, 255, 0.92);
  --billing-delete-button-bg: rgba(255, 255, 255, 0.05);
  --billing-delete-button-border: rgba(255, 255, 255, 0.08);
  --billing-delete-button-text: #ff8ea1;
  --billing-alert-success-bg: rgba(34, 197, 94, 0.12);
  --billing-alert-success-border: rgba(34, 197, 94, 0.2);
  --billing-alert-danger-bg: rgba(248, 113, 113, 0.12);
  --billing-alert-danger-border: rgba(248, 113, 113, 0.2);
}

body.dark-version .billing-page .billing-page-header .text-uppercase,
body.dark-version .billing-page .billing-month-control,
body.dark-version .billing-page .billing-preview-badge {
  color: var(--billing-text);
}

body.dark-version .billing-page .billing-amount span,
body.dark-version .billing-page .billing-inline-amount span,
body.dark-version .billing-page .billing-extra-row span {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.72) !important;
}

body.dark-version .billing-page .billing-avatar {
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.28);
}

body.dark-version .billing-page .billing-preview-badge {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
}

body.dark-version .billing-page .billing-stat-icon-dark,
body.dark-version .billing-page .billing-total-banner {
  background: linear-gradient(160deg, #1a1d31 0%, #15182a 100%);
}

body.dark-version .billing-page .billing-total-banner {
  position: relative;
  overflow: hidden;
}

body.dark-version .billing-page .billing-total-banner::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(203, 12, 159, 0.12), rgba(121, 40, 202, 0.08));
  pointer-events: none;
}

body.dark-version .billing-page .billing-total-banner__icon {
  background: linear-gradient(310deg, #7928ca, #ff0080);
  box-shadow: 0 14px 28px rgba(121, 40, 202, 0.28);
}

body.dark-version .billing-page .billing-total-banner__icon .text-dark {
  color: #ffffff !important;
}

body.dark-version .billing-page .billing-stat-icon-primary,
body.dark-version .billing-page .billing-panel-icon-primary {
  background: linear-gradient(310deg, #7928ca, #ff0080);
}

body.dark-version .billing-page .billing-stat-icon-success {
  background: linear-gradient(160deg, rgba(27, 38, 34, 0.98), rgba(18, 27, 25, 0.98));
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.26);
}

body.dark-version .billing-page .billing-stat-icon-danger {
  background: linear-gradient(160deg, rgba(45, 28, 34, 0.98), rgba(29, 20, 24, 0.98));
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.26);
}

body.dark-version .billing-page .billing-panel-icon-info {
  background: linear-gradient(160deg, rgba(24, 33, 48, 0.98), rgba(18, 24, 38, 0.98));
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.26);
}

body.dark-version .billing-page .billing-panel-icon-warning {
  background: linear-gradient(160deg, rgba(46, 34, 25, 0.98), rgba(31, 24, 18, 0.98));
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.26);
}

body.dark-version .billing-page .billing-panel-icon-secondary {
  background: linear-gradient(160deg, rgba(36, 41, 58, 0.98), rgba(23, 28, 42, 0.98));
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.24);
}

body.dark-version .billing-page .billing-stat-card__icon em,
body.dark-version .billing-page .billing-panel-icon-primary em,
body.dark-version .billing-page .billing-total-banner__icon em {
  color: rgba(255, 255, 255, 0.98) !important;
}

body.dark-version .billing-page .billing-stat-icon-success em {
  color: #b9f5cf;
}

body.dark-version .billing-page .billing-stat-icon-danger em {
  color: #ffc0cb;
}

body.dark-version .billing-page .billing-panel-icon-info em {
  color: #bedcff;
}

body.dark-version .billing-page .billing-panel-icon-warning em {
  color: #ffdca8;
}

body.dark-version .billing-page .billing-panel-icon-secondary em {
  color: #eef2ff;
}

body.dark-version .billing-page .billing-preview-shell {
  border-color: rgba(203, 12, 159, 0.14);
}

body.dark-version .billing-page .billing-add-button {
  box-shadow: none;
}

body.dark-version .billing-page .billing-delete-button {
  box-shadow: none;
}

body.dark-version .billing-page .billing-alert-success,
body.dark-version .billing-page .billing-alert-danger {
  color: var(--billing-text);
}

body.dark-version .billing-page .billing-preview-shell::before {
  background:
    radial-gradient(circle at top right, rgba(121, 40, 202, 0.12), transparent 34%),
    radial-gradient(circle at bottom left, rgba(203, 12, 159, 0.09), transparent 30%),
    linear-gradient(180deg, rgba(17, 19, 34, 0.04), rgba(17, 19, 34, 0.1));
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 991.98px) {
  .billing-preview-panel {
    position: static;
  }
}

@media (max-width: 767.98px) {
  .billing-stat-card__content {
    padding-left: 0;
    padding-top: 4.5rem;
  }

  .billing-charge-item {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 0.75rem;
  }

  .billing-amount,
  .billing-inline-amount {
    width: 100%;
  }

  .billing-amount-input,
  .billing-extra-amount-input {
    width: 100%;
  }

  .billing-panel__title {
    align-items: flex-start !important;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .billing-add-button {
    margin-left: 0 !important;
  }
}
</style>

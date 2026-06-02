<template>
  <div class="container-fluid py-4 px-4">

    <!-- Page header -->
    <div class="row mb-3 align-items-end">
      <div class="col">
        <p class="text-sm text-muted mb-0 text-uppercase font-weight-bold tracking-wider">Administración</p>
        <h5 class="mb-0 font-weight-bolder">Facturación</h5>
      </div>
      <div class="col-auto">
        <div class="card shadow-sm border-0 px-3 py-2 d-flex flex-row align-items-center gap-2">
          <em class="fas fa-calendar-days text-muted text-sm"></em>
          <input
            type="month"
            class="border-0 bg-transparent text-sm font-weight-bold"
            style="outline: none; color: inherit; cursor: pointer; min-width: 130px"
            v-model="selectedMonth"
          />
        </div>
      </div>
    </div>

    <!-- Stat cards (Soft UI floating icon pattern) -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-lg-3">
        <div class="card shadow">
          <div class="card-header p-3 pt-2">
            <div class="icon icon-lg icon-shape bg-gradient-dark shadow-dark text-center border-radius-xl mt-n4 position-absolute">
              <em class="fas fa-layer-group opacity-10 text-white"></em>
            </div>
            <div class="text-end pt-1">
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
        <div class="card shadow">
          <div class="card-header p-3 pt-2">
            <div class="icon icon-lg icon-shape bg-gradient-success shadow-success text-center border-radius-xl mt-n4 position-absolute">
              <em class="fas fa-circle-check opacity-10 text-white"></em>
            </div>
            <div class="text-end pt-1">
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
        <div class="card shadow">
          <div class="card-header p-3 pt-2">
            <div class="icon icon-lg icon-shape bg-gradient-danger shadow-danger text-center border-radius-xl mt-n4 position-absolute">
              <em class="fas fa-ban opacity-10 text-white"></em>
            </div>
            <div class="text-end pt-1">
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
        <div class="card shadow">
          <div class="card-header p-3 pt-2">
            <div class="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
              <em class="fas fa-file-invoice-dollar opacity-10 text-white"></em>
            </div>
            <div class="text-end pt-1">
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

    <!-- Main content: two columns -->
    <div class="row g-3">

      <!-- Left: Config form -->
      <div class="col-xl-5">

        <!-- Cobros por línea -->
        <div class="card shadow border-0 mb-3">
          <div class="card-header border-0 pb-0">
            <div class="d-flex align-items-center">
              <span class="badge badge-sm bg-gradient-primary me-2 p-2">
                <em class="fas fa-mobile-screen"></em>
              </span>
              <div>
                <h6 class="mb-0">Cobros por línea</h6>
                <p class="text-xs text-muted mb-0">Monto mensual por cada cliente WhatsApp</p>
              </div>
            </div>
          </div>
          <div class="card-body pt-3">
            <div v-if="lineCharges.length === 0" class="text-center py-3 text-muted text-sm">
              <em class="fas fa-mobile-screen fa-lg mb-2 d-block opacity-50"></em>
              Sin líneas configuradas
            </div>
            <div v-for="charge in lineCharges" :key="charge.wpClientId" class="charge-row mb-2">
              <div class="d-flex align-items-center justify-content-between py-2 px-3 border-radius-lg charge-item">
                <div class="d-flex align-items-center gap-2">
                  <div class="avatar avatar-sm bg-gradient-secondary border-radius-md d-flex align-items-center justify-content-center" style="width:32px;height:32px">
                    <em class="fas fa-phone text-white" style="font-size:11px"></em>
                  </div>
                  <span class="text-sm font-weight-bold">{{ charge.alias }}</span>
                </div>
                <div class="d-flex align-items-center gap-1">
                  <input
                    type="number"
                    class="form-control form-control-sm text-end font-weight-bold"
                    style="width: 110px"
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

        <!-- Software rental -->
        <div class="card shadow border-0 mb-3">
          <div class="card-header border-0 pb-0">
            <div class="d-flex align-items-center">
              <span class="badge badge-sm bg-gradient-info me-2 p-2">
                <em class="fas fa-laptop-code"></em>
              </span>
              <div>
                <h6 class="mb-0">Software rental</h6>
                <p class="text-xs text-muted mb-0">Licencia mensual de uso de la plataforma</p>
              </div>
            </div>
          </div>
          <div class="card-body pt-3">
            <div class="d-flex align-items-center gap-2">
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

        <!-- Otros cobros -->
        <div class="card shadow border-0 mb-3">
          <div class="card-header border-0 pb-0">
            <div class="d-flex align-items-center">
              <span class="badge badge-sm bg-gradient-warning me-2 p-2">
                <em class="fas fa-circle-plus"></em>
              </span>
              <div>
                <h6 class="mb-0">Otros cobros</h6>
                <p class="text-xs text-muted mb-0">Cargos adicionales para este mes</p>
              </div>
              <button class="btn btn-sm btn-outline-primary mb-0 py-1 px-2 ms-auto" style="font-size:11px" @click="addExtra">
                <em class="fas fa-plus me-1"></em>Agregar
              </button>
            </div>
          </div>
          <div class="card-body pt-3">
            <div v-if="extras.length === 0" class="text-center py-2 text-sm text-muted">
              Sin cobros adicionales este mes
            </div>
            <div v-for="(extra, idx) in extras" :key="idx" class="d-flex align-items-center gap-2 mb-2">
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Descripción del cobro"
                v-model="extra.description"
              />
              <input
                type="number"
                class="form-control form-control-sm text-end font-weight-bold"
                style="width: 100px"
                placeholder="0"
                v-model.number="extra.amountCop"
                min="0"
              />
              <span class="text-xs text-muted">COP</span>
              <button class="btn btn-sm btn-link text-danger mb-0 px-1 py-0" @click="removeExtra(idx)" title="Eliminar">
                <em class="fas fa-trash-can text-sm"></em>
              </button>
            </div>
          </div>
        </div>

        <!-- Total + Actions -->
        <div class="card shadow border-0">
          <div class="card-body p-3">
            <!-- Total banner -->
            <div class="border-radius-lg p-3 mb-3 d-flex align-items-center justify-content-between" style="background: linear-gradient(310deg,#141727,#3A416F)">
              <div>
                <p class="text-xs text-white opacity-8 text-uppercase mb-1 tracking-wider">Total a cobrar este mes</p>
                <h3 class="text-white mb-0 font-weight-bolder">{{ formatCop(totalCop) }}</h3>
              </div>
              <div class="icon icon-shape icon-md bg-white shadow text-center border-radius-md d-flex align-items-center justify-content-center" style="width:44px;height:44px;min-width:44px">
                <em class="fas fa-receipt text-dark"></em>
              </div>
            </div>

            <!-- Email input -->
            <label class="form-label text-xs font-weight-bold text-uppercase text-muted mb-1">Destinatario</label>
            <div class="position-relative mb-3">
              <em class="fas fa-envelope position-absolute text-muted" style="left:10px;top:50%;transform:translateY(-50%);font-size:12px;pointer-events:none"></em>
              <input
                type="email"
                class="form-control form-control-sm"
                style="padding-left: 30px"
                v-model="recipientEmail"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <!-- Alert notification -->
            <transition name="fade">
              <div
                v-if="notification"
                :class="`alert py-2 text-sm mb-3 ${notification.type === 'success' ? 'alert-success' : 'alert-danger'}`"
                role="alert"
              >
                <em :class="`fas ${notification.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'} me-1`"></em>
                {{ notification.message }}
              </div>
            </transition>

            <!-- Action buttons -->
            <div class="d-grid gap-2">
              <button class="btn btn-primary mb-0" @click="sendInvoice" :disabled="isSending">
                <em class="fas fa-paper-plane me-2"></em>
                {{ isSending ? 'Enviando...' : 'Enviar cuenta de cobro' }}
              </button>
              <button class="btn btn-outline-secondary btn-sm mb-0" @click="saveConfig" :disabled="isSaving">
                <em class="fas fa-floppy-disk me-2"></em>
                {{ isSaving ? 'Guardando...' : 'Guardar configuración' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Email preview -->
      <div class="col-xl-7">
        <div class="card shadow border-0" style="position: sticky; top: 20px">
          <div class="card-header border-0 pb-0 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-2">
              <span class="badge badge-sm bg-gradient-secondary p-2">
                <em class="fas fa-envelope-open-text"></em>
              </span>
              <div>
                <h6 class="mb-0">Vista previa del correo</h6>
                <p class="text-xs text-muted mb-0">Así recibirá el correo el destinatario</p>
              </div>
            </div>
            <span class="badge bg-gradient-secondary text-xs px-2 py-1">PREVIEW</span>
          </div>
          <div class="card-body p-2">
            <div class="border-radius-lg overflow-hidden" style="background:#f0f2f5;min-height:400px">
              <div class="p-3" v-html="emailPreviewHtml"></div>
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
.charge-item {
  background: rgba(0, 0, 0, 0.04);
  transition: background 0.15s ease;
}
.charge-item:hover {
  background: rgba(0, 0, 0, 0.07);
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
</style>

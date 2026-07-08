<template>
  <div class="modal fade" id="vehicle-create-modal" ref="modalEl" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <div class="d-flex align-items-center gap-2">
            <span class="vehicle-modal-icon-chip">
              <em class="fas fa-car"></em>
            </span>
            <h5 class="modal-title mb-0">{{ $t('vehicles.forms.create') }}</h5>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <VehicleForm :initial-plate="currentPlate" @submit="onFormSubmit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Modal } from 'bootstrap'
import VehicleForm from './VehicleForm.vue'
import VehicleRepository from '@/repositories/VehicleRepository'
import StorageService from '@/services/StorageService'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'

interface CreateVehiclePayload {
  plate: string
  brand: string
  model: string
  color: { name: string; hex: string }
  soat_exp?: string
  tec_exp?: string
}

const emit = defineEmits<{
  created: [vehicleId: string]
}>()

const modalEl = ref<HTMLElement | null>(null)
let modalInstance: Modal | null = null

const currentPlate = ref<string>('')

function open(plate?: string): void {
  currentPlate.value = plate ?? ''
  const el = modalEl.value
  if (!el) return
  modalInstance = Modal.getOrCreateInstance(el)
  modalInstance.show()
}

defineExpose({ open })

async function onFormSubmit(payload: CreateVehiclePayload, file: File | null): Promise<void> {
  try {
    const vehicle = await VehicleRepository.create(payload)
    if (file) {
      try {
        const storageRef = StorageService.getStorageReference(StorageService.vehiclePath, vehicle.id, file.name)
        const url = await StorageService.uploadFile(storageRef, file)
        await VehicleRepository.update(vehicle.id, { photoUrl: url })
      } catch (uploadErr: unknown) {
        const err = uploadErr as { message?: string }
        await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), err.message)
      }
    }
    emit('created', vehicle.id)
    modalInstance?.hide()
  } catch (e: unknown) {
    const axiosErr = e as { response?: { status?: number; data?: { data?: { vehicle_id?: string } } } }
    if (axiosErr?.response?.status === 409) {
      const vehicleId = axiosErr.response?.data?.data?.vehicle_id
      if (vehicleId) {
        emit('created', vehicleId)
        modalInstance?.hide()
        return
      }
    }
    const err = e as { message?: string }
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), err.message)
  }
}
</script>

<style scoped>
.vehicle-modal-icon-chip {
  width: 32px;
  height: 32px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.55rem;
  background: var(--gradient-primary);
  color: #fff;
  font-size: 0.8rem;
  box-shadow: 0 4px 7px -1px rgba(0, 0, 0, 0.11);
}

.modal-title {
  font-weight: 700;
  color: var(--text-heading);
}
</style>

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Vehicle } from '@/types/Vehicle'
import VehicleRepository from '@/repositories/VehicleRepository'

export const useVehiclesStore = defineStore('vehicles', () => {
  const vehicles = ref<Vehicle[]>([])
  const total = ref(0)
  const loading = ref(false)

  const vehicleById = computed(() => {
    return (id: string) => vehicles.value.find(v => v.id === id) ?? null
  })

  async function fetchVehicles(query: Record<string, unknown> = {}) {
    loading.value = true
    try {
      const result = await VehicleRepository.list(query)
      vehicles.value = result.vehicles
      total.value = result.total
    } finally {
      loading.value = false
    }
  }

  function addVehicle(vehicle: Vehicle) {
    vehicles.value.push(vehicle)
    total.value++
  }

  function updateVehicle(vehicle: Vehicle) {
    const idx = vehicles.value.findIndex(v => v.id === vehicle.id)
    if (idx !== -1) vehicles.value[idx] = vehicle
  }

  return { vehicles, total, loading, vehicleById, fetchVehicles, addVehicle, updateVehicle }
})

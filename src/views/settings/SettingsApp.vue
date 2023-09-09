<template>
  <div class="container mt-5">
    <ul class="nav nav-tabs" id="myTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="tarifas-tab" data-bs-toggle="tab" data-bs-target="#tarifas" type="button"
          role="tab" aria-controls="tarifas" aria-selected="true">Tarifas</button>
      </li>
    </ul>
    <div class="tab-content mt-3" id="myTabContent">
      <div class="tab-pane fade show active" role="tabpanel" id="tarifas" aria-labelledby="tarifas-tab">
        <div class="card">
          <div class="card-body">
            <form>
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <label>Precio por Kilómetro</label>
                    <input type="number" class="form-control form-control-sm"
                      :disabled="campoEditado !== 'price_kilometer'" v-model="rideFees.price_kilometer" />
                  </div>
                </div>
                <div class="col-sm-3 align-self-center">
                  <button class="btn btn-sm btn-primary" @click="editarCampo('price_kilometer')"
                    :disabled="campoEditado === 'price_kilometer'">
                    <i class="fas fa-pencil"></i>
                  </button>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label>Precio por Minuto</label>
                    <input type="number" class="form-control form-control-sm" :disabled="campoEditado !== 'price_minute'"
                      v-model="rideFees.price_minute" />
                  </div>
                </div>
                <div class="col-sm-3 align-self-center">
                  <button class="btn btn-sm btn-primary" @click="editarCampo('price_minute')"
                    :disabled="campoEditado === 'price_minute'">
                    <i class="fas fa-pencil"></i>
                  </button>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label>Tarifa Base</label>
                    <input type="number" class="form-control form-control-sm" :disabled="campoEditado !== 'fees_base'"
                      v-model="rideFees.fees_base" />
                  </div>
                </div>
                <div class="col-sm-3 align-self-center">
                  <button class="btn btn-sm btn-primary" @click="editarCampo('fees_base')"
                    :disabled="campoEditado === 'fees_base'">
                    <i class="fas fa-pencil"></i>
                  </button>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label>Tarifas Adicionales</label>
                    <input type="number" class="form-control form-control-sm"
                      :disabled="campoEditado !== 'fees_additional'" v-model="rideFees.fees_additional" />
                  </div>
                </div>
                <div class="col-sm-3 align-self-center">
                  <button class="btn btn-sm btn-primary" @click="editarCampo('fees_additional')"
                    :disabled="campoEditado === 'fees_additional'">
                    <i class="fas fa-pencil"></i>
                  </button>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label>Tarifa Mínima</label>
                    <input type="number" class="form-control form-control-sm" :disabled="campoEditado !== 'fees_minimum'"
                      v-model="rideFees.fees_minimum" />
                  </div>
                </div>
                <div class="col-sm-3 align-self-center">
                  <button class="btn btn-sm btn-primary" @click="editarCampo('fees_minimum')"
                    :disabled="campoEditado === 'fees_minimum'">
                    <i class="fas fa-pencil"></i>
                  </button>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label>Nocturno</label>
                    <input type="number" class="form-control form-control-sm" :disabled="campoEditado !== 'fees_night'"
                      v-model="rideFees.fees_night" />
                  </div>
                </div>
                <div class="col-sm-3 align-self-center">
                  <button class="btn btn-sm btn-primary" @click="editarCampo('fees_night')"
                    :disabled="campoEditado === 'fees_night'">
                    <i class="fas fa-pencil"></i>
                  </button>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label>Domingos y Festivos</label>
                    <input type="number" class="form-control form-control-sm" :disabled="campoEditado !== 'fees_DxF'"
                      v-model="rideFees.fees_DxF" />
                  </div>
                </div>
                <div class="col-sm-3 align-self-center">
                  <button class="btn btn-sm btn-primary" @click="editarCampo('fees_DxF')"
                    :disabled="campoEditado === 'fees_DxF'">
                    <i class="fas fa-pencil"></i>
                  </button>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label>Domingos y Festivos Nocturnos</label>
                    <input type="number" class="form-control form-control-sm"
                      :disabled="campoEditado !== 'fees_night_DxF'" v-model="rideFees.fees_night_DxF" />
                  </div>
                </div>
                <div class="col-sm-3 align-self-center">
                  <button class="btn btn-sm btn-primary" @click="editarCampo('fees_night_DxF')"
                    :disabled="campoEditado === 'fees_night_DxF'">
                    <i class="fas fa-pencil"></i>
                  </button>
                </div>
              </div>
              <div class="mt-4">
                <button type="button" class="btn btn-primary"
                  @click="actualizarCampo(campoEditado, rideFees[campoEditado])">
                  Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SettingsRepository from '@/repositories/SettingsRepository'

const rideFees = ref({})
const campoEditado = ref('')

const editarCampo = (fieldName) => {
  campoEditado.value = campoEditado.value === fieldName ? '' : fieldName
}

const actualizarCampo = async (fieldName, value) => {
  try {
    await SettingsRepository.updateRideFeeField(fieldName, value)
    rideFees.value[fieldName] = value
  } catch (error) {
    console.error('Error al actualizar el campo', error)
  }
};

onMounted(async () => {
  const rideFeesData = await SettingsRepository.getRideFees()
  rideFees.value = rideFeesData
})
</script>
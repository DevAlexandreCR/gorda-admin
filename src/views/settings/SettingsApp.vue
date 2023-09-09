<template>
  <div class="container mt-5">
    <ul class="nav nav-tabs" id="myTabs" role="tablist">
      <!-- Pestañas -->
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="tarifas-tab" data-bs-toggle="tab" data-bs-target="#tarifas" type="button"
          role="tab" aria-controls="tarifas" aria-selected="true">Tarifas</button>
      </li>
      <!-- Agrega más pestañas según tus necesidades -->
    </ul>
    <div class="tab-content mt-3" id="myTabContent">
      <div class="tab-pane fade show active" role="tabpanel" id="tarifas" aria-labelledby="tarifas-tab">
        <div class="card">
          <div class="card-body">
            <form>
              <div class="row">
                <!-- Campo: Precio por Kilómetro -->
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

                <!-- Campo: Precio por Minuto -->
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
                <!-- Agrega más campos de la misma manera -->
                <!-- Campo: Tarifa Base -->
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

                <!-- Campo: Tarifas Adicionales -->
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

                <!-- Campo: Tarifa Mínima -->
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

                <!-- Campo: Nocturno -->
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

                <!-- Campo: Domingos y Festivos -->
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

                <!-- Campo: Domingos y Festivos Nocturnos -->
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
              <!-- Fin de los campos -->
              <div class="mt-4">
                <button type="button" class="btn btn-primary" @click="updateRideFees(campoEditado, rideFees[campoEditado])">
                  Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <!-- Agrega más paneles de pestañas según tus necesidades -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SettingsRepository from '@/repositories/SettingsRepository';
import i18n from '@/plugins/i18n'
import ToastService from '@/services/ToastService'
import {useLoadingState} from '@/services/stores/LoadingState'
import { hide } from '@/helpers/ModalHelper'

const rideFees = ref({});
const campoEditado = ref('');
const {setLoading} = useLoadingState()

const editarCampo = (fieldName) => {
  campoEditado.value = campoEditado.value === fieldName ? '' : fieldName;
};




const actualizarCampo = async (fieldName, value) => {
  try {
    await SettingsRepository.updateRideFeeField(fieldName, value);
    // Actualizar el valor localmente en rideFees después de la actualización en la base de datos.
    rideFees.value[fieldName] = value;
  } catch (error) {
    console.error('Error al actualizar el campo:', error);
  }
};

// Obtener los valores de tarifas de viaje al cargar el componente
onMounted(async () => {
  const rideFeesData = await SettingsRepository.getRideFees();
  rideFees.value = rideFeesData;
});

</script>

<template>
  <div class="container mt-5">
    <ul class="nav nav-tabs" id="myTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="tarifas-tab" data-bs-toggle="tab" data-bs-target="#tarifas" type="button"
          role="tab" aria-controls="tarifas" aria-selected="true">{{ $t('common.settings.Ride_Fees') }}</button>
      </li>
    </ul>
    <div class="tab-content mt-3" id="myTabContent">
      <div class="tab-pane fade show active" role="tabpanel" id="tarifas" aria-labelledby="tarifas-tab">
        <div class="card">
          <div class="card-body pt-2">
            <form>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form label">{{ $t('common.settings.price_kilometer') }}</label>
                    <div class="input-group">
                      <input type="number" class="form-control form-control-sm"
                        :disabled="campoEditado !== 'price_kilometer'" v-model="rideFees.price_kilometer" />
                      <button class="badge bg-secondary border-0" @click="editarCampo('price_kilometer')"
                        :disabled="campoEditado === 'price_kilometer'">
                        <i class="fas fa-pencil"></i>
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form label">{{ $t('common.settings.price_minute') }}</label>
                    <div class="input-group">
                      <input type="number" class="form-control form-control-sm"
                        :disabled="campoEditado !== 'price_minute'" v-model="rideFees.price_minute" />
                      <button class="badge bg-secondary border-0" @click="editarCampo('price_minute')"
                        :disabled="campoEditado === 'price_minute'">
                        <i class="fas fa-pencil"></i>
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form label">{{ $t('common.settings.fees_base') }}</label>
                    <div class="input-group">
                      <input type="number" class="form-control form-control-sm"
                        :disabled="campoEditado !== 'fees_base'" v-model="rideFees.fees_base" />
                      <button class="badge bg-secondary border-0" @click="editarCampo('fees_base')"
                        :disabled="campoEditado === 'fees_base'">
                        <i class="fas fa-pencil"></i>
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form label">{{ $t('common.settings.fees_additional') }}</label>
                    <div class="input-group">
                      <input type="number" class="form-control form-control-sm"
                        :disabled="campoEditado !== 'fees_additional'" v-model="rideFees.fees_additional" />
                      <button class="badge bg-secondary border-0" @click="editarCampo('fees_additional')"
                        :disabled="campoEditado === 'fees_additional'">
                        <em class="fas fa-pencil"></em>
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form label">{{ $t('common.settings.fees_minimum') }}</label>
                    <div class="input-group">
                      <input type="number" class="form-control form-control-sm"
                        :disabled="campoEditado !== 'fees_minimum'" v-model="rideFees.fees_minimum" />
                      <button class="badge bg-secondary border-0" @click="editarCampo('fees_minimum')"
                        :disabled="campoEditado === 'fees_minimum'">
                        <i class="fas fa-pencil"></i>
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form label">{{ $t('common.settings.fees_night') }}</label>
                    <div class="input-group">
                      <input type="number" class="form-control form-control-sm"
                        :disabled="campoEditado !== 'fees_night'" v-model="rideFees.fees_night" />
                      <button class="badge bg-secondary border-0" @click="editarCampo('fees_night')"
                        :disabled="campoEditado === 'fees_night'">
                        <i class="fas fa-pencil"></i>
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form label">{{ $t('common.settings.fees_DxF') }}</label>
                    <div class="input-group">
                      <input type="number" class="form-control form-control-sm"
                        :disabled="campoEditado !== 'fees_DxF'" v-model="rideFees.fees_DxF" />
                      <button class="badge bg-secondary border-0" @click="editarCampo('fees_DxF')"
                        :disabled="campoEditado === 'fees_DxF'">
                        <i class="fas fa-pencil"></i>
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form label">{{ $t('common.settings.fees_night_DxF') }}</label>
                    <div class="input-group">
                      <input type="number" class="form-control form-control-sm"
                        :disabled="campoEditado !== 'fees_night_DxF'" v-model="rideFees.fees_night_DxF" />
                      <button class="badge bg-secondary border-0" @click="editarCampo('fees_night_DxF')"
                        :disabled="campoEditado === 'fees_night_DxF'">
                        <i class="fas fa-pencil"></i>
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <button type="button" class="btn btn-primary" @click="actualizarTodosLosCampos" :disabled="!buttonSubmitEdit">
                  {{ $t('common.actions.submit') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SettingsRepository from '@/repositories/SettingsRepository'
import {RideFeeInterface} from '@/types/RideFeeInterface'
import {Ref} from "vue";

const rideFees: Ref<RideFeeInterface> = ref({})
const campoEditado = ref('')
const buttonSubmitEdit = ref(false)

const editarCampo = (fieldName: string) => {
  campoEditado.value = campoEditado.value === fieldName ? '' : fieldName
  buttonSubmitEdit.value = true
}

const actualizarTodosLosCampos = async () => {
  //set loadinf
  await SettingsRepository.updateRideFee(rideFees.value)
      .then()
      .catch()
}

onMounted(async () => {
  rideFees.value = await SettingsRepository.getRideFees()
})
</script>
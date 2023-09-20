<template>
  <div class="container mt-5">
    <ul class="nav nav-tabs" id="myTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="ride-fees-tab" data-bs-toggle="tab" data-bs-target="#ride-fees" type="button"
          role="tab" aria-controls="ride-fees" aria-selected="true">{{ $t('common.settings.Ride_Fees') }}</button>
      </li>
    </ul>
    <div class="tab-content mt-3" id="myTabContent">
      <div class="tab-pane fade show active" role="tabpanel" id="ride-fees" aria-labelledby="ride-fees-tab">
        <div class="card">
          <div class="card-body pt-2">
            <Form>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-control-label">{{ $t('common.settings.price_kilometer') }}</label>
                    <div class="input-group">
                      <input type="number" class="form-control form-control-sm"
                        :disabled="fieldEdited !== 'price_kilometer' || allFieldsDisabled" v-model="rideFees.price_kilometer" />
                      <button class="badge bg-secondary border-0" type="button" @click="editField('price_kilometer')"
                        :disabled="fieldEdited === 'price_kilometer'">
                        <em class="fas fa-pencil"></em>
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-control-label">{{ $t('common.settings.price_minute') }}</label>
                    <div class="input-group">
                      <input type="number" class="form-control form-control-sm"
                        :disabled="fieldEdited !== 'price_minute' || allFieldsDisabled" v-model="rideFees.price_minute" />
                      <button class="badge bg-secondary border-0" type="button" @click="editField('price_minute')"
                        :disabled="fieldEdited === 'price_minute'">
                        <em class="fas fa-pencil"></em>
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-control-label">{{ $t('common.settings.fees_base') }}</label>
                    <div class="input-group">
                      <input type="number" class="form-control form-control-sm"
                        :disabled="fieldEdited !== 'fees_base' || allFieldsDisabled" v-model="rideFees.fees_base" />
                      <button class="badge bg-secondary border-0" type="button" @click="editField('fees_base')"
                        :disabled="fieldEdited === 'fees_base'">
                        <em class="fas fa-pencil"></em>
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-control-label">{{ $t('common.settings.fees_additional') }}</label>
                    <div class="input-group">
                      <input type="number" class="form-control form-control-sm"
                        :disabled="fieldEdited !== 'fees_additional' || allFieldsDisabled" v-model="rideFees.fees_additional" />
                      <button class="badge bg-secondary border-0" type="button" @click="editField('fees_additional')"
                        :disabled="fieldEdited === 'fees_additional'">
                        <em class="fas fa-pencil"></em>
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-control-label">{{ $t('common.settings.fees_minimum') }}</label>
                    <div class="input-group">
                      <input type="number" class="form-control form-control-sm"
                        :disabled="fieldEdited !== 'fees_minimum' || allFieldsDisabled" v-model="rideFees.fees_minimum" />
                      <button class="badge bg-secondary border-0" type="button" @click="editField('fees_minimum')"
                        :disabled="fieldEdited === 'fees_minimum'">
                        <em class="fas fa-pencil"></em>
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-control-label">{{ $t('common.settings.fees_night') }}</label>
                    <div class="input-group">
                      <input type="number" class="form-control form-control-sm"
                        :disabled="fieldEdited !== 'fees_night' || allFieldsDisabled" v-model="rideFees.fees_night" />
                      <button class="badge bg-secondary border-0" type="button" @click="editField('fees_night')"
                        :disabled="fieldEdited === 'fees_night'">
                        <em class="fas fa-pencil"></em>
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-control-label">{{ $t('common.settings.fees_DxF') }}</label>
                    <div class="input-group">
                      <input type="number" class="form-control form-control-sm"
                        :disabled="fieldEdited !== 'fees_DxF' || allFieldsDisabled" v-model="rideFees.fees_DxF" />
                      <button class="badge bg-secondary border-0" type="button" @click="editField('fees_DxF')"
                        :disabled="fieldEdited === 'fees_DxF'">
                        <em class="fas fa-pencil"></em>
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-control-label">{{ $t('common.settings.fees_night_DxF') }}</label>
                    <div class="input-group">
                      <input type="number" class="form-control form-control-sm"
                        :disabled="fieldEdited !== 'fees_night_DxF' || allFieldsDisabled" v-model="rideFees.fees_night_DxF" />
                      <button class="badge bg-secondary border-0" type="button" @click="editField('fees_night_DxF')"
                        :disabled="fieldEdited === 'fees_night_DxF'" >
                        <em class="fas fa-pencil"></em>
                        {{ $t('common.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <button type="button" class="btn btn-primary" @click="updateAllFields"  :disabled="!submitButtonEnabled">
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
import { onMounted, ref, Ref } from 'vue'
import SettingsRepository from '@/repositories/SettingsRepository'
import { RideFeeInterface } from '@/types/RideFeeInterface'
import { useLoadingState } from '@/services/stores/LoadingState'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import { Form } from 'vee-validate'


const { setLoading } = useLoadingState()

const rideFees: Ref<RideFeeInterface> = ref({})
const fieldEdited: Ref<string> = ref('')
const submitButtonEnabled: Ref<boolean> = ref(false)
const allFieldsDisabled: Ref<boolean> = ref(true);

const editField = (fieldName: string) => {
  fieldEdited.value = fieldEdited.value === fieldName ? '' : fieldName
  submitButtonEnabled.value = true
  allFieldsDisabled.value = false
}

function updateAllFields(): void {
  setLoading(true)
  SettingsRepository.updateRideFee(rideFees.value).then(async () => {
    setLoading(false)
    fieldEdited.value = ''
    allFieldsDisabled.value = true
    await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  }).catch(async e => {
    setLoading(false)
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

onMounted(async () => {
  rideFees.value = await SettingsRepository.getRideFees()
})
</script>
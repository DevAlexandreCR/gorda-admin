<template>
  <div class="mx-2 mt-1">
    <ul class="nav nav-tabs" id="myTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="ride-fees-tab" data-bs-toggle="tab" data-bs-target="#settings" type="button"
                role="tab" aria-controls="ride-fees" aria-selected="true" @click="currentTab = 'settings'">
          <div class="d-flex align-items-center">
            <div class="icon icon-shape icon-sm border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center"
                 :class="{ 'shadow': currentTab === 'settings' }">
              <em class="fas fa-gear"></em>
            </div>
            <span>{{ $t('common.settings.general_settings') }}</span>
          </div>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="ride-fees-tab" data-bs-toggle="tab" data-bs-target="#ride-fees" type="button"
          role="tab" aria-controls="ride-fees" aria-selected="true" @click="currentTab = 'rideFees'">
          <div class="d-flex align-items-center">
            <div class="icon icon-shape icon-sm border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center"
              :class="{ 'shadow': currentTab === 'rideFees' }">
              <em class="fas fa-dollar-sign"></em>
            </div>
            <span>{{ $t('common.settings.Ride_Fees') }}</span>
          </div>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="messages-tab" data-bs-toggle="tab" data-bs-target="#messages" type="button"
          role="tab" aria-controls="messages" aria-selected="false" @click="currentTab = 'messages'">
          <div class="d-flex align-items-center">
            <div class="icon icon-shape icon-sm border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center"
              :class="{ 'shadow': currentTab === 'messages' }">
              <em class="fas fa-envelope"></em>
            </div>
            <span>{{ $t('common.settings.Messages') }}</span>
          </div>
        </button>
      </li>
    </ul>
    <div class="tab-content mt-3" id="myTabContent">
      <div class="tap-pane fade show active" role="tabpanel" id="settings" aria-labelledby="settings-tab">
        <div class="row">
          <h3 class="ms-4">{{ $t('common.settings.branches') }}:</h3>
          <div class="col-6" v-for="(branch, index) in branches" :key="index">
            <div class="container mt-4">
              <div class="card">
                <div class="card-header">
                  <h2>{{ branch.country }}</h2>
                </div>
                <div class="card-body">
                  <p><strong class="me-2">{{ $t('common.settings.calling_code') }}:</strong> {{ branch.calling_code }}</p>
                  <p><strong class="me-2">{{ $t('common.settings.currency_code') }}:</strong> {{ branch.currency_code }}</p>
                  <h5 class="mt-3">{{ $t('common.settings.cities') }}</h5>
                  <ul class="list-group">
                    <li v-for="city in branch.cities" :key="city.city" class="list-group-item d-flex">
                      <div class="form-check">
                        <label class="custom-control-label ms-2 text-sm" :for="city.city">{{city.city}}</label>
                        <input type="checkbox" class="form-check-input" @click="setBranchSelected(branch, city)"
                           :checked="branchSelected?.city.city === city.city" :id="city.city">
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-pane fade" role="tabpanel" id="ride-fees" aria-labelledby="ride-fees-tab">
        <div class="row">
          <div class="col-md-10 col-lg-8 col-sm-12 col-xl-6 col-xxl-4 mx-auto text-center">
            <div class="card mx-sm-2">
              <div class="card-body pt-2">
                <Form>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label">{{ $t('common.settings.price_kilometer') }}</label>
                        <div class="input-group">
                          <input type="number" class="form-control form-control-sm"
                                 :disabled="fieldEdited !== 'price_kilometer' || allFieldsDisabled" v-model="rideFees.price_kilometer" />
                          <button class="badge bg-info border-0" type="button" @click="editField('price_kilometer')"
                                  :disabled="fieldEdited === 'price_kilometer'">
                            <em class="fas fa-pencil"></em>
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
                          <button class="badge bg-info border-0" type="button" @click="editField('price_minute')"
                                  :disabled="fieldEdited === 'price_minute'">
                            <em class="fas fa-pencil"></em>
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
                          <button class="badge bg-info border-0" type="button" @click="editField('fees_base')"
                                  :disabled="fieldEdited === 'fees_base'">
                            <em class="fas fa-pencil"></em>
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
                          <button class="badge bg-info border-0" type="button" @click="editField('fees_additional')"
                                  :disabled="fieldEdited === 'fees_additional'">
                            <em class="fas fa-pencil"></em>
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
                          <button class="badge bg-info border-0" type="button" @click="editField('fees_minimum')"
                                  :disabled="fieldEdited === 'fees_minimum'">
                            <em class="fas fa-pencil"></em>
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
                          <button class="badge bg-info border-0" type="button" @click="editField('fees_night')"
                                  :disabled="fieldEdited === 'fees_night'">
                            <em class="fas fa-pencil"></em>
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
                          <button class="badge bg-info border-0" type="button" @click="editField('fees_DxF')"
                                  :disabled="fieldEdited === 'fees_DxF'">
                            <em class="fas fa-pencil"></em>
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
                          <button class="badge bg-info border-0" type="button" @click="editField('fees_night_DxF')"
                                  :disabled="fieldEdited === 'fees_night_DxF'" >
                            <em class="fas fa-pencil"></em>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-4">
                    <button type="button" class="btn btn-primary float-end" @click="updateAllFields"  :disabled="!submitButtonEnabled">
                      {{ $t('common.actions.submit') }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          </div>
        </div>
        <div class="tab-content">
          <div class="tab-pane" id="messages" role="tabpanel" aria-labelledby="messages-tab">
          <SettingsMsg v-if="currentTab === 'messages'" />
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
import SettingsMsg from '@/views/settings/messages/Index.vue'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import { Form } from 'vee-validate'
import {storeToRefs} from "pinia";
import {useSettingsStore} from "@/services/stores/SettingsStore";


const { setLoading } = useLoadingState()

const rideFees: Ref<RideFeeInterface> = ref({})
const { branches, branchSelected } = storeToRefs(useSettingsStore())
const { setBranchSelected } = useSettingsStore()
const fieldEdited: Ref<string> = ref('')
const submitButtonEnabled: Ref<boolean> = ref(false)
const allFieldsDisabled: Ref<boolean> = ref(true);
const currentTab: Ref<string> = ref('rideFees')

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
    submitButtonEnabled.value = false
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
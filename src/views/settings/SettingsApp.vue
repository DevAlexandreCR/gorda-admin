<template>
  <div class="mx-2 mt-1">
    <ul class="nav nav-tabs" id="myTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="settings-tab" data-bs-toggle="tab" data-bs-target="#general_settings" type="button"
                role="tab" aria-controls="settings" aria-selected="true" @click="currentTab = 'general_settings'">
          <div class="d-flex align-items-center">
            <div class="icon icon-shape icon-sm border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center"
                 :class="{ 'shadow': currentTab === 'general_settings' }">
              <em class="fas fa-gear"></em>
            </div>
            <span>{{ $t('common.settings.general_settings') }}</span>
          </div>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="ride-fees-tab" data-bs-toggle="tab" data-bs-target="#ride-fees" type="button"
          role="tab" aria-controls="ride-fees" aria-selected="false" @click="currentTab = 'rideFees'">
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
      <div class="tab-pane fade" role="tabpanel" id="ride-fees" aria-labelledby="ride-fees-tab">
        <div class="row">
          <div class="col-sm-6 mx-auto text-center">
            <div class="card mx-sm-2">
              <div class="card-body pt-2">
                <Form v-if="rideFees">
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
                                 disabled v-model="rideFees.fees_minimum" />
                          <button class="badge bg-info border-0" type="button" @click="editField('fees_minimum')"
                                  disabled>
                            <em class="fas fa-cancel"></em>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label">{{ $t('settings.fees.fields.multiplier') }}</label>
                        <div class="input-group">
                          <input type="number" class="form-control form-control-sm"
                                 disabled v-model="rideFees.fee_multiplier" />
                          <button class="badge bg-info border-0" type="button" @click="editField('fee_multiplier')"
                                  disabled>
                            <em class="fas fa-cancel"></em>
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
          <div class="col-sm-6 mx-auto text-center">
            <div class="card mx-sm-2">
              <div class="card-header">
                <h6>{{ $t('common.settings.dynamic_min_fee') }}</h6>
              </div>
              <div class="card-body pt-2">
                <Form v-if="rideFees">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label">{{ $t('common.settings.fees_minimum_day') }}</label>
                        <div class="input-group">
                          <input type="number" class="form-control form-control-sm"
                                 :disabled="fieldEdited !== 'price_kilometer' || allFieldsDisabled" v-model="rideFees.fees_min_day" />
                          <button class="badge bg-info border-0" type="button" @click="editField('price_kilometer')"
                                  :disabled="fieldEdited === 'price_kilometer'">
                            <em class="fas fa-pencil"></em>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label">{{ $t('common.settings.fees_minimum_nigth') }}</label>
                        <div class="input-group">
                          <input type="number" class="form-control form-control-sm"
                                 :disabled="fieldEdited !== 'price_minute' || allFieldsDisabled" v-model="rideFees.fees_min_nigth" />
                          <button class="badge bg-info border-0" type="button" @click="editField('price_minute')"
                                  :disabled="fieldEdited === 'price_minute'">
                            <em class="fas fa-pencil"></em>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label">{{ $t('common.settings.fees_minimum_festive') }}</label>
                        <div class="input-group">
                          <input type="number" class="form-control form-control-sm"
                                 :disabled="fieldEdited !== 'fees_base' || allFieldsDisabled" v-model="rideFees.fees_min_festive_day" />
                          <button class="badge bg-info border-0" type="button" @click="editField('fees_base')"
                                  :disabled="fieldEdited === 'fees_base'">
                            <em class="fas fa-pencil"></em>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label">{{ $t('common.settings.fees_minimum_festive_nigth') }}</label>
                        <div class="input-group">
                          <input type="number" class="form-control form-control-sm"
                                 :disabled="fieldEdited !== 'fees_additional' || allFieldsDisabled" v-model="rideFees.fees_min_festive_nigth" />
                          <button class="badge bg-info border-0" type="button" @click="editField('fees_additional')"
                                  :disabled="fieldEdited === 'fees_additional'">
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
                </Form>
              </div>
            </div>
            <div class="card mx-sm-2 mt-2">
              <div class="card-header">
                <h6>{{ $t('common.settings.dynamic_multiplier_fee') }}</h6>
              </div>
              <div class="card-body pt-2">
                <div class="row">
                  <div class="col-12 bg-light my-1 p-2 elevation-2 rounded" v-if="rideFees" v-for="(multiplier, index) in rideFees.dynamic_multipliers" :key="index">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <h6 class="mb-0">{{ multiplier.name }} <div class="badge bg-secondary mx-2">{{ multiplier.multiplier }}</div></h6>
                      <button type="button" class="btn btn-danger btn-sm" @click="removeMultiplier(index)">
                        <em class="fas fa-trash"></em>
                      </button>
                    </div>
                    <label class="form-control-label">{{ $t('common.settings.hour_range') }}</label>
                    <div class="form-group d-flex align-items-center">
                        <input type="time" class="form-control form-control-sm" v-model="multiplier.timeRanges.start" />
                        <span class="mx-5">-</span>
                        <input type="time" class="form-control form-control-sm" v-model="multiplier.timeRanges.end" />
                    </div>
                  </div>
                </div>
                <div class="mt-4">
                  <button type="button" class="btn btn-success float-end" data-bs-toggle="modal" data-bs-target="#multiplierModal">
                    {{ $t('common.actions.add') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      <CreateMultiplierModal/>
      </div>
    <div class="tab-pane fade" id="messages" role="tabpanel" aria-labelledby="messages-tab">
        <SettingsMsg v-if="currentTab === 'messages'" />
      </div>
      <div class="tap-pane fade show active" role="tabpanel" id="general_settings" aria-labelledby="settings-tab">
        <h3 class="ms-4">{{ $t('common.settings.branches') }}:</h3>
        <div class="row">
          <div class="col-6" v-for="(branch , index) in branches" :key="index">
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
                    <li v-for="(city) in branch.cities" :key="city.id" class="list-group-item d-flex">
                      <div class="col form-check">
                        <label class="custom-control-label ms-2 text-sm" :for="city.id">{{city.name}}</label>
                        <input type="checkbox" class="form-check-input" @click="setBranchSelected(branch, city)"
                               :checked="branchSelected?.city.id === city.id" :id="city.id">
                      </div>
                      <div class="row">
                        <div class="form-group col-8">
                          <label>{{ $t('common.placeholders.current_percentage') + ' ' + city.percentage + '%' }}</label>
                        </div>
                        <button v-if="AuthService.isAdmin()"  type="button" class="col-4 btn btn-sm btn-light" data-bs-target="#percentage-modal" data-bs-toggle="modal"
                        @click="selectBranch(branch, city)">
                          <em class="fas fa-pencil"></em>
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal Percentage -->
      <div class="modal fade" id="percentage-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">{{ $t('common.actions.set_percentage') }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>{{ $t('common.placeholders.current_percentage') }}</label>
                <span class="form-control-plaintext">{{ citySelected.percentage + '%' }}</span>
              </div>
              <div class="form-group">
                <label>{{ $t('common.actions.set_percentage') }}</label>
                <input type="number" class="form-control" v-model="citySelected.percentage" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">
                {{ $t('common.actions.close') }}
              </button>
              <button @click="setPercentageModal(citySelected, branch.id)" type="button" data-bs-dismiss="modal" class="btn bg-gradient-primary">{{ $t('common.actions.submit') }}</button>
            </div>
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
import SettingsMsg from '@/views/settings/messages/Index.vue'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import { Form } from 'vee-validate'
import {storeToRefs} from "pinia";
import {useSettingsStore} from "@/services/stores/SettingsStore";
import AuthService from '@/services/AuthService'
import { City } from '@/types/City'
import { Branch } from '@/types/Branch'
import CreateMultiplierModal from './CreateMultiplierModal.vue'

const { setLoading } = useLoadingState()

const { branches, branchSelected, rideFees } = storeToRefs(useSettingsStore())
const { setBranchSelected, setPercentage } = useSettingsStore()
const fieldEdited: Ref<string> = ref('')
const submitButtonEnabled: Ref<boolean> = ref(false)
const allFieldsDisabled: Ref<boolean> = ref(true);
const currentTab: Ref<string> = ref('general_settings')
let citySelected: Ref<City> = ref({} as City)
let branch: Ref<Branch> = ref({} as Branch)

const editField = (fieldName: string) => {
  fieldEdited.value = fieldEdited.value === fieldName ? '' : fieldName
  submitButtonEnabled.value = true
  allFieldsDisabled.value = false
}

function selectBranch(b: Branch, city: City): void {
  citySelected.value = city
  branch.value = b
  console.log(citySelected.value);
  
}

function setPercentageModal(city: City, branchId: string): void {
  setLoading(true)
  setPercentage(branchId, city).catch(async e => {
    setLoading(false)
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  }).then(async () => {
    setLoading(false)
    await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  })
}

function updateAllFields(): void {
  setLoading(true)
  SettingsRepository.updateRideFee(rideFees.value!!).then(async () => {
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

function removeMultiplier(index: number): void {
  if (rideFees.value && rideFees.value.dynamic_multipliers) {
    setLoading(true)
    SettingsRepository.removeMultiplier(rideFees.value.dynamic_multipliers, index).then(async () => {
      setLoading(false)
      await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
    }).catch(async e => {
      setLoading(false)
      await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
    })
  }
}

</script>
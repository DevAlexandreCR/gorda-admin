<template>
  <div class="mx-2 mt-1">
    <div class="settings-tabbar-wrap">
      <ul class="nav nav-tabs settings-tabbar" id="myTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link settings-tab-link active" id="settings-tab" data-bs-toggle="tab" data-bs-target="#general_settings" type="button"
                  role="tab" aria-controls="settings" aria-selected="true" @click="currentTab = 'general_settings'">
            <em class="fas fa-sliders"></em>
            <span>{{ $t('common.settings.general_settings') }}</span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link settings-tab-link" id="ride-fees-tab" data-bs-toggle="tab" data-bs-target="#ride-fees" type="button"
            role="tab" aria-controls="ride-fees" aria-selected="false" @click="handleRideFeesTabClick">
            <em class="fas fa-dollar-sign"></em>
            <span>{{ $t('common.settings.Ride_Fees') }}</span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link settings-tab-link" id="messages-tab" data-bs-toggle="tab" data-bs-target="#messages" type="button"
            role="tab" aria-controls="messages" aria-selected="false" @click="currentTab = 'messages'">
            <em class="fas fa-envelope"></em>
            <span>{{ $t('common.settings.Messages') }}</span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link settings-tab-link" id="monthly-payment-settings-tab" data-bs-toggle="tab" data-bs-target="#monthly-payment-settings" type="button"
            role="tab" aria-controls="monthly-payment-settings" aria-selected="false" @click="handleMonthlyPaymentSettingsTabClick">
            <em class="fas fa-calendar-check"></em>
            <span>{{ $t('settings.monthly_payments.tab_label') }}</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="tab-content mt-3" id="myTabContent">
      <div class="tab-pane fade" role="tabpanel" id="ride-fees" aria-labelledby="ride-fees-tab">
        <div class="text-center py-4" v-if="rideFeesLoading">
          <span class="spinner-border" role="status" aria-hidden="true"></span>
        </div>
        <div v-else>
          <div class="row g-3">
            <div class="col-12 col-lg-6">
              <div class="settings-card">
                <div class="settings-card__header">
                  <span class="settings-icon-chip settings-icon-chip--success">
                    <em class="fas fa-tags"></em>
                  </span>
                  <h6 class="settings-card__title">{{ $t('common.settings.fees_base_title') }}</h6>
                </div>
                <div class="settings-card__body">
                  <Form v-if="rideFees">
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="settings-field-label">{{ $t('common.settings.price_kilometer') }}</label>
                        <div class="settings-fee-field">
                          <input type="number" class="settings-fee-input"
                                 :disabled="fieldEdited !== 'price_kilometer' || allFieldsDisabled" v-model="rideFees.price_kilometer" />
                          <button type="button" class="settings-icon-btn" @click="editField('price_kilometer')"
                                  :disabled="fieldEdited === 'price_kilometer'">
                            <em class="fas fa-pencil"></em>
                          </button>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="settings-field-label">{{ $t('common.settings.price_minute') }}</label>
                        <div class="settings-fee-field">
                          <input type="number" class="settings-fee-input"
                                 :disabled="fieldEdited !== 'price_minute' || allFieldsDisabled" v-model="rideFees.price_minute" />
                          <button type="button" class="settings-icon-btn" @click="editField('price_minute')"
                                  :disabled="fieldEdited === 'price_minute'">
                            <em class="fas fa-pencil"></em>
                          </button>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="settings-field-label">{{ $t('common.settings.fees_base') }}</label>
                        <div class="settings-fee-field">
                          <input type="number" class="settings-fee-input"
                                 :disabled="fieldEdited !== 'fees_base' || allFieldsDisabled" v-model="rideFees.fees_base" />
                          <button type="button" class="settings-icon-btn" @click="editField('fees_base')"
                                  :disabled="fieldEdited === 'fees_base'">
                            <em class="fas fa-pencil"></em>
                          </button>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="settings-field-label">{{ $t('common.settings.fees_additional') }}</label>
                        <div class="settings-fee-field">
                          <input type="number" class="settings-fee-input"
                                 :disabled="fieldEdited !== 'fees_additional' || allFieldsDisabled" v-model="rideFees.fees_additional" />
                          <button type="button" class="settings-icon-btn" @click="editField('fees_additional')"
                                  :disabled="fieldEdited === 'fees_additional'">
                            <em class="fas fa-pencil"></em>
                          </button>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="settings-field-label">{{ $t('common.settings.fees_minimum') }}</label>
                        <div class="settings-fee-field">
                          <input type="number" class="settings-fee-input"
                                 disabled v-model="rideFees.fees_minimum" />
                          <button type="button" class="settings-icon-btn" @click="editField('fees_minimum')"
                                  disabled>
                            <em class="fas fa-ban"></em>
                          </button>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="settings-field-label">{{ $t('settings.fees.fields.multiplier') }}</label>
                        <div class="settings-fee-field">
                          <input type="number" class="settings-fee-input"
                                 disabled v-model="rideFees.fee_multiplier" />
                          <button type="button" class="settings-icon-btn" @click="editField('fee_multiplier')"
                                  disabled>
                            <em class="fas fa-ban"></em>
                          </button>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="settings-field-label">{{ $t('common.settings.fees_night') }}</label>
                        <div class="settings-fee-field">
                          <input type="number" class="settings-fee-input"
                                 :disabled="fieldEdited !== 'fees_night' || allFieldsDisabled" v-model="rideFees.fees_night" />
                          <button type="button" class="settings-icon-btn" @click="editField('fees_night')"
                                  :disabled="fieldEdited === 'fees_night'">
                            <em class="fas fa-pencil"></em>
                          </button>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="settings-field-label">{{ $t('common.settings.fees_DxF') }}</label>
                        <div class="settings-fee-field">
                          <input type="number" class="settings-fee-input"
                                 :disabled="fieldEdited !== 'fees_DxF' || allFieldsDisabled" v-model="rideFees.fees_DxF" />
                          <button type="button" class="settings-icon-btn" @click="editField('fees_DxF')"
                                  :disabled="fieldEdited === 'fees_DxF'">
                            <em class="fas fa-pencil"></em>
                          </button>
                        </div>
                      </div>
                      <div class="col-12">
                        <label class="settings-field-label">{{ $t('common.settings.fees_night_DxF') }}</label>
                        <div class="settings-fee-field">
                          <input type="number" class="settings-fee-input"
                                 :disabled="fieldEdited !== 'fees_night_DxF' || allFieldsDisabled" v-model="rideFees.fees_night_DxF" />
                          <button type="button" class="settings-icon-btn" @click="editField('fees_night_DxF')"
                                  :disabled="fieldEdited === 'fees_night_DxF'">
                            <em class="fas fa-pencil"></em>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="mt-4 d-flex justify-content-end">
                      <button type="button" class="settings-primary-btn" @click="updateAllFields" :disabled="!submitButtonEnabled || updatingRideFees">
                        <span v-if="updatingRideFees" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        {{ $t('common.actions.submit') }}
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-6">
              <div class="settings-card">
                <div class="settings-card__header">
                  <span class="settings-icon-chip settings-icon-chip--info">
                    <em class="fas fa-gauge-high"></em>
                  </span>
                  <h6 class="settings-card__title">{{ $t('common.settings.dynamic_min_fee') }}</h6>
                </div>
                <div class="settings-card__body">
                  <Form v-if="rideFees">
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="settings-field-label">{{ $t('common.settings.fees_minimum_day') }}</label>
                        <div class="settings-fee-field">
                          <input type="number" class="settings-fee-input"
                                 :disabled="fieldEdited !== 'price_kilometer' || allFieldsDisabled" v-model="rideFees.fees_min_day" />
                          <button type="button" class="settings-icon-btn" @click="editField('price_kilometer')"
                                  :disabled="fieldEdited === 'price_kilometer'">
                            <em class="fas fa-pencil"></em>
                          </button>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="settings-field-label">{{ $t('common.settings.fees_minimum_nigth') }}</label>
                        <div class="settings-fee-field">
                          <input type="number" class="settings-fee-input"
                                 :disabled="fieldEdited !== 'price_minute' || allFieldsDisabled" v-model="rideFees.fees_min_nigth" />
                          <button type="button" class="settings-icon-btn" @click="editField('price_minute')"
                                  :disabled="fieldEdited === 'price_minute'">
                            <em class="fas fa-pencil"></em>
                          </button>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="settings-field-label">{{ $t('common.settings.fees_minimum_festive') }}</label>
                        <div class="settings-fee-field">
                          <input type="number" class="settings-fee-input"
                                 :disabled="fieldEdited !== 'fees_base' || allFieldsDisabled" v-model="rideFees.fees_min_festive_day" />
                          <button type="button" class="settings-icon-btn" @click="editField('fees_base')"
                                  :disabled="fieldEdited === 'fees_base'">
                            <em class="fas fa-pencil"></em>
                          </button>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="settings-field-label">{{ $t('common.settings.fees_minimum_festive_nigth') }}</label>
                        <div class="settings-fee-field">
                          <input type="number" class="settings-fee-input"
                                 :disabled="fieldEdited !== 'fees_additional' || allFieldsDisabled" v-model="rideFees.fees_min_festive_nigth" />
                          <button type="button" class="settings-icon-btn" @click="editField('fees_additional')"
                                  :disabled="fieldEdited === 'fees_additional'">
                            <em class="fas fa-pencil"></em>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="mt-4 d-flex justify-content-end">
                      <button type="button" class="settings-primary-btn" @click="updateAllFields" :disabled="!submitButtonEnabled || updatingRideFees">
                        <span v-if="updatingRideFees" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        {{ $t('common.actions.submit') }}
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-6">
              <div class="settings-card">
                <div class="settings-card__header">
                  <span class="settings-icon-chip settings-icon-chip--primary">
                    <em class="fas fa-stopwatch"></em>
                  </span>
                  <h6 class="settings-card__title">{{ $t('common.settings.self_service_cancel_window_title') }}</h6>
                </div>
                <div class="settings-card__body">
                  <Form v-if="rideFees">
                    <div class="row g-3">
                      <div class="col-12">
                        <label class="settings-field-label">{{ $t('common.settings.self_service_cancel_window') }}</label>
                        <div class="settings-fee-field">
                          <input type="number" class="settings-fee-input" min="1" step="1"
                                 :disabled="fieldEdited !== 'self_service_cancel_window' || allFieldsDisabled" v-model="rideFees.self_service_cancel_window" />
                          <button type="button" class="settings-icon-btn" @click="editField('self_service_cancel_window')"
                                  :disabled="fieldEdited === 'self_service_cancel_window'">
                            <em class="fas fa-pencil"></em>
                          </button>
                        </div>
                        <small class="settings-monthly-hint">{{ $t('common.settings.self_service_cancel_window_hint') }}</small>
                      </div>
                    </div>
                    <div class="mt-4 d-flex justify-content-end">
                      <button type="button" class="settings-primary-btn" @click="updateAllFields" :disabled="!submitButtonEnabled || updatingRideFees">
                        <span v-if="updatingRideFees" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        {{ $t('common.actions.submit') }}
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
          <div class="settings-card mt-3">
            <div class="settings-card__header">
              <span class="settings-icon-chip settings-icon-chip--warning">
                <em class="fas fa-clock"></em>
              </span>
              <h6 class="settings-card__title">{{ $t('common.settings.dynamic_multiplier_fee') }}</h6>
              <button type="button" class="settings-primary-btn settings-header-action" data-bs-toggle="modal" data-bs-target="#multiplierModal">
                <em class="fas fa-plus"></em>
                {{ $t('common.settings.add_time_slot') }}
              </button>
            </div>
            <div class="settings-card__body">
              <div class="settings-multiplier-list" v-if="rideFees">
                <div class="settings-multiplier-row" v-for="(multiplier, index) in rideFees.dynamic_multipliers" :key="index">
                  <div class="settings-multiplier-info">
                    <div class="settings-multiplier-top">
                      <span class="settings-multiplier-name">{{ multiplier.name }}</span>
                      <span class="settings-multiplier-value">{{ multiplier.multiplier }}</span>
                    </div>
                    <div class="settings-multiplier-time">
                      <span class="settings-field-label">{{ $t('common.settings.hour_range') }}</span>
                      <input type="time" class="settings-time-input" v-model="multiplier.timeRanges.start" />
                      <span class="settings-multiplier-sep">&ndash;</span>
                      <input type="time" class="settings-time-input" v-model="multiplier.timeRanges.end" />
                    </div>
                  </div>
                  <button type="button" class="settings-icon-btn settings-icon-btn--danger" @click="removeMultiplier(index)" :disabled="!!removingMultiplier[index]">
                    <span v-if="removingMultiplier[index]" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <em v-else class="fas fa-trash"></em>
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
      <div class="tab-pane fade" id="monthly-payment-settings" role="tabpanel" aria-labelledby="monthly-payment-settings-tab">
        <div class="text-center py-4" v-if="monthlyPaymentSettingsLoading">
          <span class="spinner-border" role="status" aria-hidden="true"></span>
        </div>
        <div class="row" v-else-if="monthlyPaymentSettings">
          <div class="col-12 col-lg-6">
            <div class="settings-card">
              <div class="settings-card__header">
                <span class="settings-icon-chip settings-icon-chip--primary">
                  <em class="fas fa-calendar-check"></em>
                </span>
                <h6 class="settings-card__title">{{ $t('settings.monthly_payments.panel_title') }}</h6>
              </div>
              <div class="settings-card__body">
                <p class="settings-monthly-subtitle">{{ $t('settings.monthly_payments.panel_subtitle') }}</p>
                <div class="settings-monthly-field">
                  <label class="settings-field-label">{{ $t('settings.monthly_payments.field_suggested_amount') }}</label>
                  <div class="settings-fee-field">
                    <input ref="suggestedAmountInputEl" type="number" class="settings-fee-input"
                           v-model.number="monthlyPaymentSettings.suggested_amount" min="0" />
                    <button type="button" class="settings-icon-btn" @click="suggestedAmountInputEl?.focus()">
                      <em class="fas fa-pencil"></em>
                    </button>
                  </div>
                </div>
                <div class="settings-monthly-field">
                  <label class="settings-field-label">{{ $t('settings.monthly_payments.field_cutoff_day') }}</label>
                  <div class="settings-fee-field">
                    <input ref="cutoffDayInputEl" type="number" class="settings-fee-input"
                           v-model.number="monthlyPaymentSettings.cutoff_day" min="1" max="28" />
                    <button type="button" class="settings-icon-btn" @click="cutoffDayInputEl?.focus()">
                      <em class="fas fa-pencil"></em>
                    </button>
                  </div>
                  <small class="settings-monthly-hint">{{ $t('settings.monthly_payments.hint_cutoff_day') }}</small>
                </div>
                <div class="settings-monthly-field">
                  <label class="settings-field-label">{{ $t('settings.monthly_payments.field_reminder_offsets') }}</label>
                  <div class="settings-fee-field">
                    <input ref="reminderOffsetsInputEl" type="text" class="settings-fee-input"
                           :value="monthlyPaymentSettings.reminder_offsets.join(', ')" @change="onReminderOffsetsChange" />
                    <button type="button" class="settings-icon-btn" @click="reminderOffsetsInputEl?.focus()">
                      <em class="fas fa-pencil"></em>
                    </button>
                  </div>
                  <small class="settings-monthly-hint settings-monthly-hint--warning" v-if="reminderOffsetWarning">{{ reminderOffsetWarning }}</small>
                  <small class="settings-monthly-hint" v-else>{{ $t('settings.monthly_payments.hint_reminder_offsets') }}</small>
                </div>
                <div class="settings-monthly-toggle-panel">
                  <div class="form-check form-switch settings-switch mb-0">
                    <input class="form-check-input" type="checkbox" id="auto-disable-switch" v-model="monthlyPaymentSettings.auto_disable" />
                  </div>
                  <div class="settings-monthly-toggle-text">
                    <label class="settings-monthly-toggle-label" for="auto-disable-switch">{{ $t('settings.monthly_payments.field_auto_disable') }}</label>
                    <small class="settings-monthly-hint">{{ $t('settings.monthly_payments.hint_auto_disable') }}</small>
                  </div>
                </div>
                <div class="mt-4 d-flex justify-content-end">
                  <button type="button" class="settings-primary-btn" @click="saveMonthlyPaymentSettings" :disabled="savingMonthlyPaymentSettings">
                    <span v-if="savingMonthlyPaymentSettings" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    {{ $t('common.actions.submit') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-pane fade show active settings-page" role="tabpanel" id="general_settings" aria-labelledby="settings-tab">
        <div class="settings-card">
          <div class="settings-card__header">
            <span class="settings-icon-chip settings-icon-chip--info">
              <em class="fas fa-city"></em>
            </span>
            <h6 class="settings-card__title">{{ $t('common.settings.branches') }}</h6>
          </div>
          <div class="settings-card__body">
            <div class="row">
              <div class="col-12 col-lg-6 mb-3" v-for="branch in branches" :key="branch.id">
                <div class="settings-branch-panel">
                  <div class="settings-branch-panel__header">
                    <span class="settings-branch-flag">
                      <template v-if="countryFlag(branch.country)">{{ countryFlag(branch.country) }}</template>
                      <em v-else class="fas fa-flag"></em>
                    </span>
                    <div class="settings-branch-info">
                      <div class="settings-branch-country">{{ branch.country }}</div>
                      <div class="settings-branch-meta">
                        <div class="settings-branch-meta-item">
                          <span class="settings-field-label">{{ $t('common.settings.calling_code') }}</span>
                          <span class="settings-branch-meta-value">{{ branch.calling_code }}</span>
                        </div>
                        <div class="settings-branch-meta-item">
                          <span class="settings-field-label">{{ $t('common.settings.currency_code') }}</span>
                          <span class="settings-branch-meta-value">{{ branch.currency_code }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="settings-field-label settings-cities-label">{{ $t('common.settings.cities') }}</div>
                  <div class="settings-cities-list">
                    <div class="settings-city-row" v-for="city in branch.cities" :key="city.id">
                      <div class="form-check form-switch settings-switch mb-0">
                        <input type="checkbox" class="form-check-input" role="switch" @click="setBranchSelected(branch, city)"
                               :checked="branchSelected?.city.id === city.id" :id="city.id">
                      </div>
                      <label class="settings-city-name" :for="city.id">{{ city.name }}</label>
                      <div class="settings-city-pct">
                        <span class="settings-city-pct-label">{{ $t('common.placeholders.current_percentage') }}</span>
                        <span class="settings-city-pct-value">{{ city.percentage }}%</span>
                      </div>
                      <button v-if="AuthService.isAdmin()" type="button" class="settings-icon-btn"
                              data-bs-target="#percentage-modal" data-bs-toggle="modal"
                              @click="selectBranch(branch, city)">
                        <em class="fas fa-pencil"></em>
                      </button>
                    </div>
                  </div>
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
              <div class="settings-monthly-field">
                <label class="settings-field-label">{{ $t('common.placeholders.current_percentage') }}</label>
                <span class="settings-modal-pct-value">{{ citySelected.percentage + '%' }}</span>
              </div>
              <div class="settings-monthly-field">
                <label class="settings-field-label">{{ $t('common.actions.set_percentage') }}</label>
                <input type="number" class="settings-fee-input" v-model="citySelected.percentage" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">
                {{ $t('common.actions.close') }}
              </button>
              <button @click="setPercentageModal(citySelected, branch.id)" type="button" data-bs-dismiss="modal" class="settings-primary-btn" :disabled="submittingPercentage">
                <span v-if="submittingPercentage" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {{ $t('common.actions.submit') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import SettingsRepository from '@/repositories/SettingsRepository'
import MonthlyPaymentSettingsRepository from '@/repositories/MonthlyPaymentSettingsRepository'
import { MonthlyPaymentSettingsInterface } from '@/types/MonthlyPaymentSettingsInterface'
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

const settingsStore = useSettingsStore()
const { branches, branchSelected, rideFees, rideFeesLoading } = storeToRefs(settingsStore)
const { setBranchSelected, setPercentage } = settingsStore
const fieldEdited: Ref<string> = ref('')
const submitButtonEnabled: Ref<boolean> = ref(false)
const allFieldsDisabled: Ref<boolean> = ref(true);
const currentTab: Ref<string> = ref('general_settings')
let citySelected: Ref<City> = ref({} as City)
let branch: Ref<Branch> = ref({} as Branch)
const monthlyPaymentSettings: Ref<MonthlyPaymentSettingsInterface | null> = ref(null)
const reminderOffsetWarning = ref('')
const suggestedAmountInputEl = ref<HTMLInputElement | null>(null)
const cutoffDayInputEl = ref<HTMLInputElement | null>(null)
const reminderOffsetsInputEl = ref<HTMLInputElement | null>(null)
const updatingRideFees = ref(false)
const removingMultiplier = ref<Record<number, boolean>>({})
const submittingPercentage = ref(false)
const savingMonthlyPaymentSettings = ref(false)
const monthlyPaymentSettingsLoading = ref(false)

const COUNTRY_FLAGS: Record<string, string> = {
  colombia: '🇨🇴',
}

function countryFlag(country: string): string {
  return COUNTRY_FLAGS[country?.toLowerCase()] ?? ''
}

function resetRideFeesFormState(): void {
  fieldEdited.value = ''
  submitButtonEnabled.value = false
  allFieldsDisabled.value = true
}

async function handleRideFeesTabClick(): Promise<void> {
  currentTab.value = 'rideFees'

  try {
    await settingsStore.getRideFees()
    resetRideFeesFormState()
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : undefined
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), message)
  }
}

const editField = (fieldName: string) => {
  fieldEdited.value = fieldEdited.value === fieldName ? '' : fieldName
  submitButtonEnabled.value = true
  allFieldsDisabled.value = false
}

function selectBranch(b: Branch, city: City): void {
  citySelected.value = {
    ...city,
    location: { ...city.location },
    polygon: city.polygon.map((point) => ({ ...point })),
  }
  branch.value = b
}

function setPercentageModal(city: City, branchId: string): void {
  submittingPercentage.value = true
  setPercentage(branchId, city).catch(async e => {
    submittingPercentage.value = false
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  }).then(async () => {
    submittingPercentage.value = false
    await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  })
}

function updateAllFields(): void {
  if (!rideFees.value) return

  updatingRideFees.value = true
  SettingsRepository.updateRideFee(rideFees.value).then(async () => {
    updatingRideFees.value = false
    resetRideFeesFormState()
    await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  }).catch(async e => {
    updatingRideFees.value = false
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function removeMultiplier(index: number): void {
  if (rideFees.value && rideFees.value.dynamic_multipliers) {
    removingMultiplier.value[index] = true
    SettingsRepository.removeMultiplier(rideFees.value.dynamic_multipliers, index).then(async () => {
      delete removingMultiplier.value[index]
      await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
    }).catch(async e => {
      delete removingMultiplier.value[index]
      await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
    })
  }
}

function onReminderOffsetsChange(event: Event): void {
  const raw = (event.target as HTMLInputElement).value
  const parsed = raw.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0)
  if (monthlyPaymentSettings.value) {
    monthlyPaymentSettings.value.reminder_offsets = parsed
  }
  checkReminderOffsetWarning()
}

function checkReminderOffsetWarning(): void {
  if (!monthlyPaymentSettings.value) return
  const cutoff = monthlyPaymentSettings.value.cutoff_day
  const unreachable = monthlyPaymentSettings.value.reminder_offsets.filter(o => cutoff - o < 1)
  reminderOffsetWarning.value = unreachable.length > 0
    ? i18n.global.t('settings.monthly_payments.warn_unreachable_offsets', { offsets: unreachable.join(', ') })
    : ''
}

async function handleMonthlyPaymentSettingsTabClick(): Promise<void> {
  currentTab.value = 'monthlyPaymentSettings'
  monthlyPaymentSettingsLoading.value = true
  try {
    monthlyPaymentSettings.value = await MonthlyPaymentSettingsRepository.get()
    checkReminderOffsetWarning()
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : undefined
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), message)
  } finally {
    monthlyPaymentSettingsLoading.value = false
  }
}

async function saveMonthlyPaymentSettings(): Promise<void> {
  if (!monthlyPaymentSettings.value) return
  savingMonthlyPaymentSettings.value = true
  try {
    monthlyPaymentSettings.value = await MonthlyPaymentSettingsRepository.save(monthlyPaymentSettings.value)
    await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : undefined
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), message)
  } finally {
    savingMonthlyPaymentSettings.value = false
  }
}

</script>

<style scoped>
/* Tab bar — underline style, keeps Bootstrap's nav-tabs/tab.js mechanic */
.settings-tabbar-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.settings-tabbar {
  display: flex;
  flex-wrap: nowrap;
  white-space: nowrap;
  border: none;
  border-bottom: 2px solid var(--border-subtle);
  margin-bottom: 0;
}
.settings-tabbar .nav-item {
  flex: none;
}
.settings-tabbar .settings-tab-link {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.3rem;
  margin-bottom: -2px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;
}
.settings-tabbar .settings-tab-link em {
  font-size: 0.78rem;
}
.settings-tabbar .settings-tab-link:hover {
  color: var(--primary);
  background: transparent;
}
.settings-tabbar .settings-tab-link.active {
  color: var(--primary);
  font-weight: 700;
  background: transparent;
  border-bottom-color: var(--primary);
}

/* Shared settings-* foundation, reused across the Settings tabs */
.settings-card {
  background: var(--surface-card);
  border-radius: 1rem;
  box-shadow: var(--shadow-card);
  overflow: hidden;
}
.settings-card__header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 1.1rem 1.25rem 0;
}
.settings-card__title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--text-heading);
}
.settings-card__body {
  padding: 1.25rem;
}

.settings-icon-chip {
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 0.55rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.8rem;
  box-shadow: 0 4px 7px -1px rgba(0, 0, 0, 0.11);
}
.settings-icon-chip--info { background: linear-gradient(310deg, #2152ff, #21d4fd); }
.settings-icon-chip--success { background: linear-gradient(310deg, #17ad37, #98ec2d); }
.settings-icon-chip--warning { background: linear-gradient(310deg, #f53939, #fbcf33); }
.settings-icon-chip--whatsapp { background: linear-gradient(310deg, #128c7e, #25d366); }
.settings-icon-chip--primary { background: var(--gradient-primary); }

.settings-icon-btn {
  width: 34px;
  height: 34px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 0.45rem;
  background: #17c1e8;
  color: #fff;
  font-size: 0.8rem;
  cursor: pointer;
}
.settings-icon-btn--danger {
  background: #ea0606;
}
.settings-icon-btn--locked,
.settings-icon-btn:disabled {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  cursor: default;
}

.settings-field-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.settings-primary-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  background: var(--gradient-primary);
  border: none;
  border-radius: 0.5rem;
  color: #fff;
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

/* Green pill switch: !important beats the global magenta .form-switch override
   (__theme.scss has both a light and a body.dark-version rule on the same
   selector, so specificity alone can't guarantee a win in both modes). */
.settings-card .settings-switch .form-check-input:checked {
  background-color: #17ad37 !important;
  border-color: #17ad37 !important;
}

/* Ajustes Generales — Sucursales panel */
.settings-branch-panel {
  height: 100%;
  border: 1px solid var(--border-subtle);
  border-radius: 0.75rem;
  padding: 1.1rem 1.25rem;
}
.settings-branch-panel__header {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-subtle);
}
.settings-branch-flag {
  flex-shrink: 0;
  font-size: 2.6rem;
  line-height: 1;
  color: var(--text-muted);
}
.settings-branch-info {
  flex: 1;
  min-width: 0;
}
.settings-branch-country {
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--text-heading);
}
.settings-branch-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}
.settings-branch-meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.settings-branch-meta-value {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--text-heading);
}
.settings-cities-label {
  margin-bottom: 0.6rem;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
}
.settings-cities-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.settings-city-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--border-color);
  border-radius: 0.55rem;
  background: var(--surface-input);
}
.settings-city-name {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-heading);
  cursor: pointer;
}
.settings-city-pct {
  display: flex;
  align-items: center;
  gap: 8px;
}
.settings-city-pct-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}
.settings-city-pct-value {
  min-width: 32px;
  text-align: right;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--primary);
}

/* Tarifas — Base / Tarifa Mínima Dinámica / Multiplicador cards */
.settings-header-action {
  margin-left: auto;
}
.settings-fee-field {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.35rem;
}
.settings-fee-input {
  flex: 1 1 0%;
  min-width: 0;
  padding: 0.45rem 0.65rem;
  background: var(--surface-input);
  border: 1px solid var(--border-color);
  border-radius: 0.45rem;
  color: var(--text-heading);
  font-size: 0.875rem;
}
.settings-fee-input:focus {
  outline: none;
  border-color: #17c1e8;
}
.settings-fee-input:disabled {
  opacity: 0.65;
}

.settings-multiplier-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
.settings-multiplier-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.65rem;
  background: var(--surface-input);
}
.settings-multiplier-info {
  flex: 1;
  min-width: 0;
}
.settings-multiplier-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.55rem;
}
.settings-multiplier-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-heading);
}
.settings-multiplier-value {
  padding: 0.18rem 0.6rem;
  border-radius: 0.4rem;
  flex-shrink: 0;
  background: var(--gradient-primary);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
}
.settings-multiplier-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.settings-multiplier-time .settings-field-label {
  margin-bottom: 0;
}
.settings-multiplier-sep {
  color: var(--text-muted);
  font-weight: 700;
}
.settings-time-input {
  padding: 0.3rem 0.5rem;
  background: var(--surface-card);
  border: 1px solid var(--border-color);
  border-radius: 0.4rem;
  color: var(--text-heading);
  font-size: 0.8rem;
}
.settings-time-input:focus {
  outline: none;
  border-color: #17c1e8;
}

/* Mensualidades */
.settings-monthly-subtitle {
  margin: -0.35rem 0 1.1rem;
  color: var(--text-secondary);
  font-size: 0.85rem;
}
.settings-monthly-field {
  margin-bottom: 1.1rem;
}
.settings-monthly-hint {
  display: block;
  margin-top: 0.35rem;
  color: var(--text-muted);
  font-size: 0.75rem;
}
.settings-monthly-hint--warning {
  color: #fbcf33;
}
.settings-monthly-toggle-panel {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  margin-bottom: 1.1rem;
  border: 1px solid var(--border-subtle);
  border-radius: 0.65rem;
}
.settings-monthly-toggle-text {
  flex: 1;
  min-width: 0;
}
.settings-monthly-toggle-label {
  display: block;
  margin-bottom: 2px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-heading);
  cursor: pointer;
}
.settings-monthly-toggle-text .settings-monthly-hint {
  margin-top: 0;
}

/* Percentage modal */
.settings-modal-pct-value {
  display: block;
  margin-top: 0.35rem;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--primary);
}
</style>

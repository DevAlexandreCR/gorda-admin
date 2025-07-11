<template>
    <div class="modal fade" id="multiplierModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <Form @submit="saveMultiplier" :validation-schema="schema" class="needs-validation" novalidate>
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{{ $t('settings.fees.actions.add_multiplier') }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="name" class="form-label fw-bold">{{ $t('common.fields.name') }}</label>
                            <Field
                                name="name"
                                type="text"
                                class="form-control form-control-sm"
                                id="name"
                                v-model="multiplier.name"
                                :placeholder="$t('common.fields.name')"
                            />
                            <ErrorMessage name="name" v-slot="{ message }">
                                <span class="is-invalid">{{ message }}</span>
                            </ErrorMessage>
                        </div>
                        <div class="mb-3">
                            <label for="multiplier" class="form-label fw-bold">{{ $t('settings.fees.fields.multiplier') }}</label>
                            <Field
                                name="multiplier"
                                type="number"
                                class="form-control form-control-sm"
                                id="multiplier"
                                v-model="multiplier.multiplier"
                                :placeholder="$t('settings.fees.fields.multiplier')"
                            />
                            <ErrorMessage name="multiplier" v-slot="{ message }">
                                <span class="is-invalid">{{ message }}</span>
                            </ErrorMessage>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold">{{ $t('settings.fees.fields.time_range') }}</label>
                        <div class="row g-2 align-items-center">
                            <div class="col-6">
                                <label for="start" class="form-label">{{ $t('settings.fees.fields.start_time') }}</label>
                                    <Field
                                        name="timeRanges.start"
                                        type="time"
                                        class="form-control form-control-sm"
                                        id="start"
                                        v-model="multiplier.timeRanges.start"
                                        :placeholder="$t('settings.fees.fields.start_time')"
                                    />
                                    <ErrorMessage name="timeRanges.start" v-slot="{ message }">
                                        <span class="is-invalid">{{ message }}</span>
                                    </ErrorMessage>
                                </div>
                                <div class="col-6">
                                    <label for="end" class="form-label">{{ $t('settings.fees.fields.end_time') }}</label>
                                    <Field
                                        name="timeRanges.end"
                                        type="time"
                                        class="form-control form-control-sm"
                                        id="end"
                                        v-model="multiplier.timeRanges.end"
                                        :placeholder="$t('settings.fees.fields.end_time')"
                                    />
                                <ErrorMessage name="timeRanges.end" v-slot="{ message }">
                                    <span class="is-invalid">{{ message }}</span>
                                </ErrorMessage>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ $t('common.actions.cancel') }}</button>
                        <button type="submit" class="btn btn-primary">{{ $t('common.actions.submit') }}</button>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { DynamicMultiplier } from '@/types/DynamicMultiplier';
import { ErrorMessage, Form, Field } from 'vee-validate';
import { ref } from 'vue';
import * as yup from 'yup';
import {useSettingsStore} from "@/services/stores/SettingsStore";
import { storeToRefs } from 'pinia';
import SettingsRepository from '@/repositories/SettingsRepository';
import { Modal } from 'bootstrap';

const { rideFees } = storeToRefs(useSettingsStore());
const schema = yup.object().shape({
  name: yup.string().required().min(3),
  multiplier: yup.number().required().min(1).max(5),
  timeRanges: yup.object().shape({
    start: yup.string().required(),
    end: yup.string().required()
  })
})

const multiplier = ref<DynamicMultiplier>({
  timeRanges: {
    start: '00:00',
    end: '00:00'
  },
  multiplier: 1,
  name: '',
});

const saveMultiplier = (values: any) => {
    if (!rideFees.value) {
        return
    }
    if (!rideFees.value.dynamic_multipliers) {
        rideFees.value.dynamic_multipliers = [];
    }
    
    const multiplierData: DynamicMultiplier = {
        name: values.name,
        multiplier: values.multiplier,
        timeRanges: {
            start: values.timeRanges.start,
            end: values.timeRanges.end
        }
    };
    
    SettingsRepository.addMultiplier(rideFees.value.dynamic_multipliers, multiplierData)
        .then(() => {
            multiplier.value = {
                timeRanges: {
                    start: '00:00',
                    end: '00:00'
                },
                multiplier: 1,
                name: ''
            };
            const modal = document.getElementById('multiplierModal');
            if (modal) {
                const bootstrapModal = Modal.getInstance(modal);
                bootstrapModal?.hide();
            }
        });
};
</script>
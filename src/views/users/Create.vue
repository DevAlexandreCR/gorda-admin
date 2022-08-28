<template>
  <div class="container-fluid pb-4" >
    <Form @submit="createUser" :validation-schema="schema">
      <div class="card w-75 mx-auto">
        <div class="card-header text-center text-capitalize">
          <h6>{{ $t('users.forms.edit') }}</h6>
        </div>
        <div class="card-body pt-2">
          <div class="row">
            <div class="col-md-5">
              <div class="card-header p-0 mx-3 mt-3 z-index-1">
                <img :src="user.photoUrl" class="img-fluid border-radius-lg" alt="profile_photo">
              </div>
            </div>
            <div class="col-md-7">
              <div class="form-group">
                <label class="form-label">{{ $t('drivers.placeholders.photo') }}</label>
                <Field name="photoUrl" class="form-control form-control-sm" type="file" accept="image/*" v-model="image"/>
                <ErrorMessage name="photoUrl" class="is-invalid"/>
              </div>
              <div class="form-group">
                <label>{{ $t('users.fields.name') }}</label>
                <Field name="name" type="text" v-slot="{ field, errorMessage, meta }" v-model="user.name">
                  <input class="form-control" v-model="field.value" :placeholder="$t('common.placeholders.name')"
                         id="name" aria-label="Name" aria-describedby="name-addon" v-bind="field"/>
                  <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                </Field>
              </div>
              <div class="form-group">
                <label>{{ $t('users.fields.email') }}</label>
                <Field name="email" type="email" v-slot="{ field, errorMessage, meta }" v-model="user.email">
                  <input class="form-control" v-model="field.value" :placeholder="$t('common.placeholders.email')"
                         id="email" aria-label="Email" aria-describedby="email-addon" v-bind="field"/>
                  <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                </Field>
              </div>
              <div class="form-group">
                <label>{{ $t('users.fields.password') }}</label>
                <Field name="password" type="password" v-slot="{ field, errorMessage, meta }" v-model="password">
                <input class="form-control form-control-sm" type="password" v-model="field.value" :placeholder="$t('users.fields.password')" id="password" aria-label="Password" aria-describedby="password-addon" v-bind="field"/>
                <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                </Field>
              </div> 
              <div class="form-group">
                <label>{{ $t('users.fields.phone') }}</label>
                <Field name="phone" type="phone" v-slot="{ field, errorMessage, meta }" v-model="user.phone">
                  <input class="form-control" v-model="field.value" :placeholder="$t('common.placeholders.phone')"
                         id="phone" aria-label="Phone" aria-describedby="phone-addon" v-bind="field"/>
                  <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                </Field>
              </div>
              <div class="form-group">
                <label>{{ $t('users.fields.role') }}:</label>
                <div class="form-check mb-4 d-inline-block ms-4">
                  <input class="form-check-input" type="checkbox" @change="assignRole" name="role" id="operator"
                         :value="'operator'" :checked="user.roles.operator"/>
                  <label class="custom-control-label">{{ $t('users.fields.operator') }}</label>
                </div>
                <div class="form-check d-inline-block ms-3">
                  <input class="form-check-input" type="checkbox" name="role" @change="assignRole" id="admin"
                         :value="'admin'" :checked="user.roles.admin"/>
                  <label class="custom-control-label">{{ $t('users.fields.admin') }}</label>
                </div>
                <ErrorMessage name="role"/>
              </div>
              <div class="form-check form-switch"> 
                <input class="form-check-input" name="enable" type="checkbox" id="enableUser"
                       :checked="user.isEnabled()" @change="onEnable"/>
                <label class="form-check-label">{{
                    $t(user.enabled_at ? 'common.fields.enabled' : 'common.fields.disabled')
                  }}</label>
                <ErrorMessage name="enable"/>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <div class="card-footer text-end">
          <button class="btn btn-primary" type="submit">{{ $t('common.actions.create') }}</button>
        </div>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import UserRepository from '@/repositories/UserRepository'
import User from '@/models/User'
import {ErrorMessage, Field, Form, FormActions} from 'vee-validate'
import * as yup from 'yup'
import CustomValidator from '@/assets/validatiions/validators'
import StorageService from '@/services/StorageService'
import i18n from '@/plugins/i18n'
import {onMounted, ref, Ref} from 'vue'
import dayjs from 'dayjs'
import ToastService from '@/services/ToastService'
import {UserInterface} from '@/types/UserInterface'
import {useStorage} from '@/services/stores/Storage'
import {storeToRefs} from 'pinia'
import router from '@/router'
import {useLoadingState} from '@/services/stores/LoadingState'

const storage = useStorage()
const {photoUrl} = storeToRefs(storage)


const user: Ref<User> = ref(new User)
const image: Ref<File[]> = ref([])
const password: Ref<string> = ref('')
const {setLoading} = useLoadingState()

const schema = yup.object().shape({
  photoUrl: CustomValidator.isImage(i18n.global.t('validations.image'), i18n.global.t('validations.size')).required(),
  name: yup.string().required().min(3),
  email: yup.string().required().email(),
  phone: yup.string().required().min(8),
  password: yup.string().required().min(6),
})

function createUser(_values: UserInterface, event: FormActions<any>): void {
  setLoading(true)
  UserRepository.create(user.value, password.value).then((id) => {
    user.value.id = id
    const reference = StorageService.getStorageReference(StorageService.profilePath, user.value.id ?? '', image.value[0]?.name)
    StorageService.uploadFile(reference, image.value[0]).then(url => {
      user.value.photoUrl = url
      event.resetForm()
      UserRepository.update(user.value).then(() => {
        setLoading(false)
        ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.created'))
        event.resetForm()
        user.value.photoUrl = photoUrl.value
        image.value = []
        router.push({name: 'users.index'})
      })
    })
  }).catch(e => {
    setLoading(false)
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function onEnable(e: Event): void {
  const target = e.target as HTMLInputElement
  user.value.enabled_at = target.checked ? dayjs().unix() : 0
}
function assignRole(e: Event): void {
  const target = e.target as HTMLInputElement
  if (user.value.roles) {
    if (target.value === 'operator') {
      user.value.roles.operator = target.checked
    } else {
      user.value.roles.admin = target.checked
    }
  }
}

onMounted(() => {
  storage.getDefaultPhotoUrl().then(() => {
    user.value.photoUrl = photoUrl.value
  })
})
</script>

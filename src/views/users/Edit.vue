<template>
  <div class="container-fluid pb-4" v-if="user.id">
    <Form @submit="updateUser" :validation-schema="schema">
      <div class="card w-75 mx-auto">
        <div class="card-header text-center text-capitalize">
          <h6>{{ $t('users.forms.edit') }}</h6>
        </div>
        <div class="card-body pt-2">
          <div class="row">
            <div class="col-md-5">
              <div class="card-header p-0 mx-3 mt-3 z-index-1">
                <img :src="this.user.photoUrl" class="img-fluid border-radius-lg" alt="profile_photo">
                <button class="btn btn-sm btn-icon btn-2 btn-primary btn-edit-img" type="button" data-bs-toggle="modal"
                        data-bs-target="#imgModal">
                  <span class="btn-inner--icon"><em class="fas fa-pen"></em></span>
                </button>
              </div>
            </div>
            <div class="col-md-7">
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
                <input class="form-check-input" name="enable" type="checkbox" id="flexSwitchCheckDefault"
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
          <button class="btn btn-info" type="submit">{{ $t('common.actions.submit') }}</button>
        </div>
      </div>
    </Form>
    <!-- Modal -->
    <div class="modal fade" id="imgModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ $t('users.forms.upload') }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <Form @submit="uploadImg" :validation-schema="schemaImg">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">{{ $t('users.forms.select_img') }}</label>
                <Field name="photo" class="form-control" type="file" accept="image/*" v-model="image" id="formFile"/>
                <ErrorMessage name="photo"/>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">
                {{ $t('common.actions.close') }}
              </button>
              <button type="submit" class="btn bg-gradient-primary">{{ $t('common.actions.submit') }}</button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserRepository from '@/repositories/UserRepository'
import User from '@/models/User'
import {ErrorMessage, Field, Form} from 'vee-validate'
import Swal from 'sweetalert2'
import * as yup from 'yup'
import {ObjectSchema} from 'yup'
import CustomValidator from '@/assets/validatiions/validators'
import * as bootstrap from 'bootstrap'
import StorageService from '@/services/StorageService'
import dayjs from 'dayjs'
import DriverRepository from '@/repositories/DriverRepository'
import i18n from '@/plugins/i18n'
import ToastService from '@/services/ToastService'
import {onBeforeMount, ref, Ref} from 'vue'
import {useRoute} from 'vue-router'

const user: Ref<User> = ref(new User)
const route = useRoute()
const schemaImg: ObjectSchema<any> = yup.object().shape({
  photo: CustomValidator.isImage(i18n.global.t('validations.image'), i18n.global.t('validations.size')).required()
})
const image: Ref<File[]> = ref([])

const schema = yup.object().shape({
  name: yup.string().required().min(3),
  email: yup.string().required().email(),
  phone: yup.string().required().min(8),
  role: yup.array()
})

function uploadImg(): void {
  console.log('sssss')
  const ref = StorageService.getStorageReference(StorageService.profilePath, user.value.id ?? '', image.value[0]?.name)
  StorageService.uploadFile(ref, image.value[0]).then(url => {
    user.value.photoUrl = url
    updateUser()
  })
}

function updateUser(): void {
  UserRepository.update(user.value).then(() => {
    Swal.fire({
      icon: 'success',
      title: i18n.global.t('common.messages.updated'),
      showConfirmButton: false,
      timer: 1500
    })
    const modal = document.getElementById('imgModal')
    const modalImg = bootstrap.Modal.getOrCreateInstance(modal ?? '')
    modalImg.hide()
  }).catch(e => {
    Swal.fire({
      icon: 'error',
      title: i18n.global.t('common.messages.error'),
      text: e.message
    })
  })
}

function onEnable(e: Event): void {
  const target = e.target as HTMLInputElement
  user.value.enabled_at = target.checked ? dayjs().unix() : 0
  DriverRepository.enable(user.value.id ?? '', user.value.enabled_at).then(() => {
    const message = user.value.enabled_at == 0 ?
        i18n.global.t('users.messages.disabled') : i18n.global.t('users.messages.enabled')
    ToastService.toast(ToastService.SUCCESS, message)
  }).catch(e => {
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
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

onBeforeMount(() => {
  UserRepository.getUser(route.params.id as string).then(userDB => {
    Object.assign(user.value, userDB)
    user.value.photoUrl = user.value.photoUrl ?? '../../assets/img/logo.png'
  })
})
</script>
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
                <img :src="user.photoUrl" class="img-fluid border-radius-lg" alt="profile_photo">
                <button class="btn btn-sm btn-icon btn-2 btn-primary btn-edit-img" type="button" data-bs-toggle="modal"
                        data-bs-target="#image-user">
                  <span class="btn-inner--icon"><em class="fas fa-pen"></em></span>
                </button>
              </div>
            </div>
            <div class="col-md-7">
              <div class="form-group">
                <label class="form-control-label">{{ $t('users.fields.name') }}</label>
                <Field name="name" type="text" v-slot="{ field, errorMessage, meta }" v-model="user.name">
                  <input class="form-control" v-model="field.value" :placeholder="$t('common.placeholders.name')"
                         id="name" aria-label="Name" aria-describedby="name-addon" v-bind="field"/>
                  <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                </Field>
              </div>
              <div class="form-group">
                <label class="form-control-label">{{ $t('users.fields.email') }}</label>
                <Field name="email" type="email" v-slot="{ field, errorMessage, meta }" v-model="user.email">
                  <input class="form-control" v-model="field.value" :placeholder="$t('common.placeholders.email')"
                         id="email" aria-label="Email" aria-describedby="email-addon" v-bind="field"/>
                  <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                </Field>
              </div>
              <div class="form-group editLink">
                <a class="button-link" href="#" id="openEditPasswordModalButton" data-bs-toggle="modal" data-bs-target="#editPassword">
                  {{ $t('common.placeholders.restore_password') }}
                </a>
            </div>
              <div class="form-group">
                <label class="form-control-label">{{ $t('users.fields.phone') }}</label>
                <Field name="phone" type="phone" v-slot="{ field, errorMessage, meta }" v-model="user.phone">
                  <input class="form-control" v-model="field.value" :placeholder="$t('common.placeholders.phone')"
                         id="phone" aria-label="Phone" aria-describedby="phone-addon" v-bind="field"/>
                  <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                </Field>
              </div>
              <div class="form-group">
                <label class="form-control-label">{{ $t('users.fields.role') }}:</label>
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
    <ImageLoader :id="'image-user'" :resourceId="user.id" :path="StorageService.profilePath" :event="userEvent"
       @imageUserLoaded="uploadImg"></ImageLoader>
    <!-- Modal -->
  <div class="modal fade" id="editPassword" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ $t('users.forms.edit_password') }}</h5>
          <button type="button" id="closeEditPasswordModalButton" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Form @submit="updatePassword" :validation-schema="schemaPassword">
          <div class="modal-body">
            <div class="mb-3">
              <Field name="password" type="password" v-slot="{ field }">
                <div class="input-group">
                  <span style="cursor: pointer" class="input-group-text" @click="showPassword = !showPassword">
                    <i class="fa" :class="showPassword ? 'fa-eye' : 'fa-eye-slash'"></i>
                  </span>
                  <input class="form-control form-control-sm" id="password" aria-label="Password" aria-describedby="password-addon" v-model="user.password"
                    :placeholder="$t('common.placeholders.password')" v-bind="field"
                    :type="showPassword ? 'text' : 'password'" />
                </div>
              </Field>
              <ErrorMessage name="password" />
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
import * as bootstrap from 'bootstrap'
import StorageService from '@/services/StorageService'
import dayjs from 'dayjs'
import i18n from '@/plugins/i18n'
import ToastService from '@/services/ToastService'
import {onBeforeMount, ref, Ref} from 'vue'
import {useRoute} from 'vue-router'
import {useLoadingState} from '@/services/stores/LoadingState'
import { hide } from '@/helpers/ModalHelper'
import ImageLoader from "@/components/ImageLoader.vue";

const user: Ref<User> = ref(new User)
const route = useRoute()
const userEvent = 'image-user-loaded'
const showPassword = ref(false);
const {setLoading} = useLoadingState()
const schema = yup.object().shape({
  name: yup.string().required().min(3),
  email: yup.string().required().email(),
  phone: yup.string().required().min(8),
  role: yup.array()
})

const schemaPassword = yup.object().shape({
  password: yup.string().required()
})

function uploadImg(url: string): void {
  user.value.photoUrl = url
  updateUser()
}

function updateUser(): void {
  setLoading(true)
  UserRepository.update(user.value).then(() => {
    setLoading(false)
    Swal.fire({
      icon: 'success',
      title: i18n.global.t('common.messages.updated'),
      showConfirmButton: false,
      timer: 1500
    })
    const modal = document.getElementById('image-user')
    const modalImg = bootstrap.Modal.getOrCreateInstance(modal ?? '')
    modalImg.hide()
  }).catch(e => {
    setLoading(false)
    Swal.fire({
      icon: 'error',
      title: i18n.global.t('common.messages.error'),
      text: e.message
    })
  })
}

function onEnable(event: Event): void {
  setLoading(true)
  const target = event.target as HTMLInputElement
  user.value.enabled_at = target.checked ? dayjs().unix() : 0
  UserRepository.enable(user.value.id ?? '', user.value.enabled_at).then(async () => {
    setLoading(false)
    const message = user.value.enabled_at == 0 ?
        i18n.global.t('users.messages.disabled') :
        i18n.global.t('users.messages.enabled')
    await ToastService.toast(ToastService.SUCCESS, message)
  }).catch(async e => {
    setLoading(false)
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function updatePassword(): void {
  setLoading(true)
  UserRepository.updatePassword(user.value.id ?? '', user.value.password).then(async () => {
    setLoading(false)
    hide('editPassword')
    await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  }).catch(async e => {
    setLoading(false)
   await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
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

onBeforeMount(async () => {
  const userDB = await UserRepository.getUser(route.params.id as string)
    Object.assign(user.value, userDB)
    user.value.photoUrl = user.value.photoUrl ?? '../../assets/img/logo.png'
})
</script>
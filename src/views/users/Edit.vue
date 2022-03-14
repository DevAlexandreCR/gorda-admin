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
                <button class="btn btn-sm btn-icon btn-2 btn-primary btn-edit-img" type="button" data-bs-toggle="modal" data-bs-target="#imgModal">
                  <span class="btn-inner--icon"><em class="fas fa-pen"></em></span>
                </button>
              </div>
            </div>
            <div class="col-md-7">
              <div class="form-group">
                <label>{{ $t('users.fields.name') }}</label>
                  <Field name="name" type="text" class="form-control" :placeholder=" $t('common.placeholders.name')" v-model="user.name" id="name" aria-label="Name" aria-describedby="name-addon" />
                    <ErrorMessage name="name"/>
              </div>
              <div class="form-group">
                <label>{{ $t('users.fields.email') }}</label>
                <Field name="email" type="email" class="form-control" id="email" :placeholder="$t('common.placeholders.email')" v-model="user.email" aria-label="Email" aria-describedby="email-addon" />
                  <ErrorMessage name="email"/>
              </div>
              <div class="form-group">
                <label>{{ $t('users.fields.phone') }}</label>
                  <Field name="phone" type="phone" class="form-control" :placeholder=" $t('common.placeholders.phone')" id="phone" v-model="user.phone" aria-label="Phone" aria-describedby="phone-addon"/>
                    <ErrorMessage name="phone"/>
              </div>
              <div class="form-group">
                <label>{{ $t('users.fields.role') }}:</label>
                <div class="form-check mb-4 d-inline-block ms-4">
                  <input class="form-check-input" type="checkbox" @change="assignRole" name="role" id="operator" :value="'operator'" :checked="user.roles.operator"/>
                  <label class="custom-control-label">{{ $t('users.fields.operator') }}</label>
                </div>
                <div class="form-check d-inline-block ms-3">
                  <input class="form-check-input" type="checkbox" name="role" @change="assignRole" id="admin" :value="'admin'" :checked="user.roles.admin"/>
                  <label class="custom-control-label">{{ $t('users.fields.admin') }}</label>
                </div>
                <ErrorMessage name="role"/>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" name="enable" type="checkbox" id="flexSwitchCheckDefault" :checked="user.isEnabled()" @change="onEnable"/>
                <label class="form-check-label">{{ $t(user.enabled_at ? 'common.fields.enabled' : 'common.fields.disabled') }}</label>
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
    <div class="modal fade" id="imgModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
              <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">{{ $t('common.actions.close') }}</button>
              <button type="submit" class="btn bg-gradient-primary">{{ $t('common.actions.submit') }}</button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component'
import UserRepository from '@/repositories/UserRepository'
import User from '@/models/User'
import {ErrorMessage, Field, Form} from 'vee-validate'
import Swal from 'sweetalert2'
import * as yup from 'yup'
import CustomValidator from '@/assets/validatiions/validators'
import * as bootstrap from 'bootstrap'
import StorageService from '@/services/StorageService'
import dayjs from 'dayjs'

@Options({
  components: {
    Form,
    Field,
    ErrorMessage
  },
})

export default class Edit extends Vue {
  user: User = new User()
  schemaImg: yup.ObjectSchema<any>
  image: File[] = []

  readonly schema = yup.object().shape({
    name: yup.string().required().min(3),
    email: yup.string().required().email(),
    phone: yup.string().required().min(8),
    role: yup.array()
  })

  mounted(): void {
    this.schemaImg = yup.object().shape({
      photo: yup.mixed().required().test(
        'size',
        this.$t('validations.size'),
        CustomValidator.size
      ).test(
        'image',
        this.$t('validations.image'),
        CustomValidator.image
      )
    })
  }

  uploadImg(): void {
    const ref = StorageService.getStorageReference(StorageService.profilePath, this.user.id?? '', this.image[0]?.name)
    StorageService.uploadFile(ref, this.image[0]).then(url => {
      this.user.photoUrl = url
      this.updateUser()
    })
  }

  updateUser(): void {
    UserRepository.update(this.user).then(() => {
      Swal.fire({
        icon: 'success',
        title: this.$t('common.messages.updated'),
        showConfirmButton: false,
        timer: 1500
      })
      const modal = document.getElementById('imgModal')
      const modalImg = bootstrap.Modal.getOrCreateInstance(modal?? '')
      modalImg.hide()
    }).catch(e => {
      Swal.fire({
        icon: 'error',
        title: this.$t('common.messages.error'),
        text: e.message,
      })
    })
  }

  onEnable(e: Event): void {
    const target = e.target as HTMLInputElement
    this.user.enabled_at = target.checked ? dayjs().unix() : null
  }

  assignRole(e: Event): void {
    const target = e.target as HTMLInputElement
    if (this.user.roles) {
      if (target.value === 'operator') {
        this.user.roles.operator = target.checked
      } else {
        this.user.roles.admin = target.checked
      }
    }
  }

  created(): void {
    UserRepository.getUser(this.$route.params.id as string).then(user => {
      Object.assign(this.user, user)
      this.user.photoUrl = this.user.photoUrl?? '../../assets/img/logo.png'
    })
  }
}
</script>
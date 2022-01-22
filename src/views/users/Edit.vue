<template>
  <div class="container-fluid pb-4" v-if="user">
    <Form @submit="updateUser" :validation-schema="schema">
      <div class="card w-75 mx-auto">
        <div class="card-header text-center text-capitalize">
          <h6>{{ $t('users.forms.edit') }}</h6>
        </div>
        <div class="card-body pt-2">
          <div class="row">
            <div class="col-md-5">
              <div class="card-header p-0 mx-3 mt-3 z-index-1">
                <img src="../../assets/img/logo.png" class="img-fluid border-radius-lg" alt="profile_photo">
              </div>
            </div>
            <div class="col-md-7">
              <div class="form-group">
                <label>{{ $t('users.fields.name') }}</label>
                <div class="input-group">
                  <Field name="name" type="text" class="form-control" :placeholder=" $t('common.placeholders.name')" v-model="user.name" id="name" aria-label="Name" aria-describedby="name-addon" />
                    <ErrorMessage name="name"/>
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('users.fields.email') }}</label>
                <Field name="email" type="email" class="form-control" id="email" :placeholder="$t('common.placeholders.email')" v-model="user.email" aria-label="Email" aria-describedby="email-addon" />
                  <ErrorMessage name="email"/>
              </div>
              <div class="form-group">
                <label>{{ $t('users.fields.phone') }}</label>
                <div class="input-group">
                  <Field name="phone" type="phone" class="form-control" :placeholder=" $t('common.placeholders.phone')" id="phone" v-model="user.phone" aria-label="Phone" aria-describedby="phone-addon"/>
                    <ErrorMessage name="phone"/>
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('users.fields.role') }}:</label>
                <div class="form-check mb-4 d-inline-block ms-4">
                  <Field class="form-check-input" type="checkbox" @change="assignRole" name="role" id="customRadio0" :value="user.roles?.operator"/>
                  <label class="custom-control-label">{{ $t('users.fields.operator') }}</label>
                </div>
                <div class="form-check d-inline-block ms-3">
                  <Field class="form-check-input" type="checkbox" name="role" @change="assignRole" id="customRadio1" :value="user.roles?.admin"/>
                  <label class="custom-control-label">{{ $t('users.fields.admin') }}</label>
                </div>
                <ErrorMessage name="role"/>
              </div>
              <div class="form-check form-switch">
                <Field class="form-check-input" name="enable" type="checkbox" id="flexSwitchCheckDefault" :checked="!!user.enabled_at" @change="onEnable"/>
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
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component'
import UserRepository from '@/repositories/UserRepository'
import User from '@/models/User'
import {ErrorMessage, Field, Form} from 'vee-validate'
import Swal from 'sweetalert2'
import * as yup from 'yup'

@Options({
  components: {
    Form,
    Field,
    ErrorMessage
  },
})

export default class Edit extends Vue {
  user: User = new User({})
  admin: boolean = false

  readonly schema = yup.object().shape({
    name: yup.string().required().min(3),
    email: yup.string().required().email(),
    phone: yup.string().required().min(8),
    role: yup.array(),
    enabled_at: yup.string().required()
  })

  updateUser(): void {
    UserRepository.update(this.user).then(() => {
      Swal.fire({
        icon: 'success',
        title: this.$t('common.messages.updated'),
        showConfirmButton: false,
        timer: 1500
      })
    }).catch(e => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        title: this.$t('common.messages.error'),
        text: e.message,
      })
    })
  }

  onEnable(): void {
    this.user.enabled_at = this.user.isEnabled() ? null : new Date().toLocaleDateString()
  }

  assignRole(): void {
    console.log(this.user.roles)
    // if (this.admin) {
    //   this.user.roles = {
    //     operator: true,
    //     admin: false
    //   }
    // } else {
    //   this.user.roles = {
    //     operator: false,
    //     admin: true
    //   }
    //   }
  }

  created(): void {
    UserRepository.getUser(this.$route.params.id as string).then(user => {
      this.user = new User(user)
      this.admin = this.user.roles?.admin
    })
  }
}
</script>
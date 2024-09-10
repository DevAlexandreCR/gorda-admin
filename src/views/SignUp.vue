<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <nav
            class="navbar navbar-expand-lg blur blur-rounded top-0 z-index-3 shadow position-absolute my-3 py-2 start-0 end-0 mx-4">
          <div class="container-fluid">
            <router-link :to="{ name: 'dashboard' }" tag="a" class="navbar-brand font-weight-bolder ms-lg-0 ms-3 ">{{
                appName
              }}
            </router-link>
          </div>
        </nav>
      </div>
    </div>
  </div>
  <main class="main-content mt-0 ps">
    <section>
      <div class="page-header">
        <div class="container">
          <div class="row">
            <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
              <div class="card my-7">
                <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="error">
                  <span class="alert-icon"><em class="ni ni-like-2"></em></span>
                  <span class="alert-text"><strong>{{ $t('users.upss') }}</strong>{{ $t('users.alert') }}</span>
                </div>
                <div class="card-header pb-0 text-left">
                  <h3 class="font-weight-bolder text-info text-gradient">{{ $t('users.create_account') }}</h3>
                  <p class="mb-0">{{ $t('users.create_new_account') }}</p>
                </div>
                <div class="card-body">
                  <Form @submit="createUser" :validation-schema="schema">
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
                      <label>{{ $t('users.fields.password') }}</label>
                      <Field name="pass" type="password" class="form-control" :placeholder=" $t('common.placeholders.password')" id="pass" v-model="pass" aria-label="pass" aria-describedby="phone-addon"/>
                      <ErrorMessage name="pass"/>
                    </div>
                    <div class="form-group">
                      <label>{{ $t('users.fields.confirm_password') }}</label>
                      <Field name="confirm" type="password" class="form-control" :placeholder=" $t('common.placeholders.confirm_password')" id="confirm_pass" aria-label="pass" aria-describedby="phone-addon"/>
                      <ErrorMessage name="confirm"/>
                    </div>
                    <button class="btn bg-gradient-info w-100 mt-4 mb-0" type="submit">{{ $t('common.actions.submit') }}</button>
                  </Form>
                </div>
                <div class="card-footer text-center pt-0 px-lg-2 px-1">
                  <p class="mb-4 text-sm mx-auto">
                    {{ $t('users.already_account') }}
                    <router-link :to="{name: 'login'}" tag="a" class="text-info text-gradient font-weight-bold">{{ $t('users.login') }}</router-link>
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-7">
              <div class="oblique position-absolute top-0 h-100 d-md-block d-none me-n8">
                <img class="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6"
                     src="../assets/img/background_crystal.jpg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component'
import UserRepository from '@/repositories/UserRepository'
import User from '@/models/User'
import {ErrorMessage, Field, Form} from 'vee-validate'
import * as yup from 'yup'
import ToastService from "@/services/ToastService";
import i18n from "@/plugins/i18n";

@Options({
  inject: ['appName'],
  components: {
    Form,
    Field,
    ErrorMessage
  },
})

export default class SignUp extends Vue {
  user: User = new User()
  pass = ''
  schema: yup.ObjectSchema<any>
  error = false

  created(): void {
    this.schema = yup.object().shape({
      name: yup.string().required().min(3),
      email: yup.string().required().email(),
      phone: yup.string().required().min(8),
      role: yup.array(),
      pass: yup.string().required().min(6).matches(/^[a-z0-9_-]{6,18}$/, i18n.global.t('validations.password')),
      confirm: yup.string().required().oneOf([yup.ref('pass'), null], i18n.global.t('validations.confirm'))
    })
  }

  createUser(): void {
    UserRepository.create(this.user, this.pass).then(() => {
      ToastService.toast('success', i18n.global.t('common.messages.created'))
    }).catch(e => {
      ToastService.toast('error', i18n.global.t('common.messages.error'), e.message)
      this.error = true
    })
  }
}
</script>
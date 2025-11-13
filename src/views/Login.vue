<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <nav
            class="navbar navbar-expand-lg blur blur-rounded top-0 z-index-3 shadow position-absolute my-3 py-2 start-0 end-0 mx-4 login-navbar">
          <div class="container-fluid">
            <router-link :to="{ name: 'dashboard' }" tag="a" class="navbar-brand font-weight-bolder ms-lg-0 ms-3 ">{{
                appName
              }}
            </router-link>
            <ThemeToggle
                class="ms-auto d-inline-flex"
                variant="btn-outline-secondary"
                size="btn-sm"
                :show-label="false"
            />
          </div>
        </nav>
      </div>
    </div>
  </div>
  <main class="main-content mt-0 ps auth-main">
    <section>
      <div class="page-header min-vh-75 auth-page-header">
        <div class="container">
          <div class="row">
            <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
              <div class="card mt-8 login-card">
                <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="error">
                  <span class="alert-icon"><i class="ni ni-like-2"></i></span>
                  <span class="alert-text"><strong>{{ $t('users.upss') }}</strong>{{ $t('users.alert') }}</span>
                </div>
                <div class="card-header pb-0 text-left">
                  <h3 class="font-weight-bolder text-info text-gradient">{{ $t('users.welcome') }}</h3>
                  <p class="mb-0">{{ $t('users.enter') }}</p>
                </div>
                <div class="card-body">
                  <Form @submit="login" :validation-schema="schema">
                    <label>{{ $t('users.fields.email') }}</label>
                    <div class="mb-3">
                      <Field type="email" class="form-control" v-model="email" name="email"
                             placeholder="Email" aria-label="Email" aria-describedby="email-addon"/>
                      <ErrorMessage name="email"/>
                    </div>
                    <label>{{ $t('users.fields.password') }}</label>
                    <div class="mb-3">
                      <Field type="password" v-model="pass" name="pass" class="form-control" placeholder="Password"
                             aria-label="Password" aria-describedby="password-addon"/>
                      <ErrorMessage name="pass"/>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" id="rememberMe" checked="">
                      <label class="form-check-label" for="rememberMe">{{ $t('users.remindme') }}</label>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn bg-gradient-info w-100 mt-4 mb-0">{{ $t('users.login') }}</button>
                    </div>
                  </Form>
                </div>
                <div class="card-footer text-center pt-0 px-lg-2 px-1">
                  <p class="mb-4 text-sm mx-auto">
                    {{ $t('users.no_account') }}
                    <router-link :to="{name: 'sign-up'}" tag="a" class="text-info text-gradient font-weight-bold">{{ $t('users.signUp') }}</router-link>
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-7">
              <div class="oblique position-absolute top-0 h-100 d-md-block d-none me-n8 login-oblique">
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
import AuthService from '@/services/AuthService'
import {ErrorMessage, Field, Form} from 'vee-validate'
import * as yup from 'yup'
import {Options, Vue} from 'vue-class-component'
import User from '@/models/User'
import ThemeToggle from '@/components/ThemeToggle.vue'

@Options({
  inject: ['appName'],
  components: {
    Form,
    Field,
    ErrorMessage,
    ThemeToggle,
  },
})

export default class Login extends Vue {
  error = false
  email = ''
  pass = ''
  user: User

  readonly schema = yup.object().shape({
    email: yup.string().required().email(),
    pass: yup.string().required().min(6),
  })

  async login(): Promise<void> {
    await AuthService.login(this.email, this.pass).catch(() => {
      this.error = true
    })
  }
}
</script>




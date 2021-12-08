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
      <div class="page-header min-vh-75">
        <div class="container">
          <div class="row">
            <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
              <div class="card card-plain mt-8">
                <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="error">
                  <span class="alert-icon"><i class="ni ni-like-2"></i></span>
                  <span class="alert-text"><strong>Upss!</strong> Usuario o contraseña incorrectos!</span>
                </div>
                <div class="card-header pb-0 text-left bg-transparent">
                  <h3 class="font-weight-bolder text-info text-gradient">Bienvenido</h3>
                  <p class="mb-0">Ingrese su correo electrónico y contraseña para iniciar sesión</p>
                </div>
                <div class="card-body">
                  <Form @submit="login" :validation-schema="schema">
                    <label>Email</label>
                    <div class="mb-3">
                      <Field type="email" class="form-control" v-model="email" name="email"
                             placeholder="Email" aria-label="Email" aria-describedby="email-addon"/>
                      <ErrorMessage name="email"/>
                    </div>
                    <label>Password</label>
                    <div class="mb-3">
                      <Field type="password" v-model="pass" name="pass" class="form-control" placeholder="Password"
                             aria-label="Password" aria-describedby="password-addon"/>
                      <ErrorMessage name="pass"/>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" id="rememberMe" checked="">
                      <label class="form-check-label" for="rememberMe">Recuérdame</label>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn bg-gradient-info w-100 mt-4 mb-0">Iniciar sesión</button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
            <div class="col-md-7">
              <div class="oblique position-absolute top-0 h-100 d-md-block d-none me-n8">
                <img class="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6"
                     src="../assets/img/abstract_crystal-49244.jpg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<script lang="ts">
import {defineComponent, ref} from 'vue'
import AuthService from '@/services/AuthService'
import {ErrorMessage, Field, Form, useField} from 'vee-validate'
import * as yup from 'yup'

export default defineComponent({
  name: 'Login',
  inject: ['appName'],
  components: {
    Form,
    Field,
    ErrorMessage
  },
  setup() {
    const schema = yup.object().shape({
      email: yup.string().required().email(),
      pass: yup.string().required().min(6),
    })

    let error = ref(false)

    const {value: email} = useField('email')
    const {value: pass} = useField('pass')

    const login = async (values: { email: string, pass: string }): Promise<void> => {
      await AuthService.login(values.email, values.pass).catch(e => {
        console.log(e.message)
        error.value = true
      })
    }

    return {
      error,
      email,
      pass,
      schema,
      login
    }
  }
})
</script>




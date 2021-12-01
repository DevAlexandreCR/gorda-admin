<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <nav class="navbar navbar-expand-lg blur blur-rounded top-0 z-index-3 shadow position-absolute my-3 py-2 start-0 end-0 mx-4">
          <div class="container-fluid">
            <router-link :to="{ name: 'home' }" tag="a" class="navbar-brand font-weight-bolder ms-lg-0 ms-3 ">{{ appName }}</router-link>
            <div class="collapse navbar-collapse ps" id="navigation">
              <ul class="navbar-nav mx-auto">
              </ul>
              <ul class="navbar-nav d-lg-block d-none">
              </ul>
            </div>
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
                <div class="card-header pb-0 text-left bg-transparent">
                  <h3 class="font-weight-bolder text-info text-gradient">Bienvenido</h3>
                  <p class="mb-0">Ingrese su correo electrónico y contraseña para iniciar sesión</p>
                </div>
                <div class="card-body">
                  <form role="form">
                    <label>Email</label>
                    <div class="mb-3">
                      <input type="email" class="form-control" placeholder="Email" v-model="email" aria-label="Email" aria-describedby="email-addon">
                    </div>
                    <label>Password</label>
                    <div class="mb-3">
                      <input type="email" class="form-control" placeholder="Password" v-model="Password" aria-label="Password" aria-describedby="password-addon">
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" id="rememberMe" checked="">
                      <label class="form-check-label" for="rememberMe">Recuérdame</label>
                    </div>
                    <div class="text-center">
                      <button type="button" class="btn bg-gradient-info w-100 mt-4 mb-0">Iniciar sesión</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="col-md-7">
              <div class="oblique position-absolute top-0 h-100 d-md-block d-none me-n8">
                <img class="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6" src="../assets/img/abstract_crystal-49244.jpg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
</main>
</template>

<script>

export default {
  name: 'Login',
  inject: ['appName'],
}

</script>




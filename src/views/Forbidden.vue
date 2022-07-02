<template>
  <div class="container w-50 py-5">
    <div class="row">
      <div class="col-md-2 text-center">
        <p><i class="fa fa-exclamation-triangle fa-5x"></i><br/>Status Code: 403</p>
      </div>
      <div class="col-md-10">
        <h3>{{ $t('users.upss') }}</h3>
        <p>{{ $t('users.forbidden') }}</p>
        <a class="btn btn-danger" @click="logout">{{ $t('users.go_back') }}</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthService from '@/services/AuthService'

function logout() {
  AuthService.logOut()
}

</script>
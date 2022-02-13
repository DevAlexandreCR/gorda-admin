<template>
  <div class="me-2">
    <div class="container-fluid">
      <div class="page-header min-height-300 border-radius-xl mt-4" style="background-image: url('../../assets/img/background.jpg'); background-position-y: 50%;">
        <span class="mask bg-gradient-primary opacity-6"></span>
      </div>
      <div class="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
        <div class="row gx-4">
          <div class="col-auto">
            <div class="avatar avatar-xl position-relative">
              <img src="../../assets/img/logo.png" alt="profile_image" class="w-100 border-radius-lg shadow-sm">
            </div>
          </div>
          <div class="col-auto my-auto">
            <div class="h-100">
              <h5 class="mb-1">
                {{ user.name }}
              </h5>
              <p class="mb-0 font-weight-bold text-sm">
                {{ user.email }}
              </p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">
            <div class="nav-wrapper position-relative end-0">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-12 col-xl-6">
          <div class="card h-100">
            <div class="card-header pb-0 p-3">
              <div class="row">
                <div class="col-md-8 d-flex align-items-center">
                  <h6 class="mb-0">{{ $t('users.profile') }}</h6>
                </div>
                <div class="col-md-4 text-end">
                  <a href="javascript:;">
                    <em class="fas fa-user-edit text-secondary text-sm" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit Profile"></em>
                  </a>
                </div>
              </div>
            </div>
            <div class="card-body p-3">
              <p class="text-sm">
              </p>
              <hr class="horizontal gray-light my-4">
              <ul class="list-group">
                <li class="list-group-item border-0 ps-0 pt-0 text-sm"><strong class="text-dark">{{ $t('users.fields.name') }}: </strong> &nbsp; {{ user.name }}</li>
                <li class="list-group-item border-0 ps-0 text-sm"><strong class="text-dark">{{ $t('users.fields.email') }}: </strong> &nbsp; {{ user.email }}</li>
                <li class="list-group-item border-0 ps-0 text-sm"><strong class="text-dark">{{ $t('users.fields.phone') }}: </strong> &nbsp; {{ user.phone }}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-12 col-xl-6">
          <div class="card h-100">
            <div class="card-header pb-0 p-3">
              <h6 class="mb-0">{{ $t('users.platform_settings') }}</h6>
            </div>
            <div class="card-body p-3">
              <h6 class="text-uppercase text-body text-xs font-weight-bolder">{{ $t('users.fields.roles') }}</h6>
              <ul class="list-group">
                <li v-for="(value, role) in user.roles" class="list-group-item border-0 px-0" :key="role">
                  <div class="d-flex px-2 py-1"  v-if="value">
                    <div>
                      <em class="fas fa-tools fa-1x me-2"></em>
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-sm">{{ $t('users.fields.' + role) }}</h6>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-class-component'
import User from '@/models/User'
import AuthService from '@/services/AuthService'

export default class Profile extends Vue {
  user: User

  created(): void {
    this.user = AuthService.getCurrentUser()
  }
}
</script>
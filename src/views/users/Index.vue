<template>
  <div class="container-fluid">
    <div class="card mb-4">
      <div class="card-header pb-0">
        <h6>{{ $t('common.models.users', 2) }}</h6>
      </div>
      <div class="card-body px-0 pt-0 pb-2">
        <div class="table-responsive p-0">
          <table class="table align-items-center mb-0">
            <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('users.fields.name') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('users.fields.phone') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('users.fields.role') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('common.fields.status') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <div class="d-flex px-2 py-1">
                  <div>
                    <img src="../../assets/img/logo.png" class="avatar avatar-sm me-3" alt="user1">
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ user.name }}</h6>
                    <p class="text-xs text-secondary mb-0">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ user.phone }}</p>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ $t(user.roles.admin ? 'users.fields.admin' : 'users.fields.operator') }}</p>
              </td>
              <td class="align-middle text-center text-sm">
                <span class="badge badge-sm bg-gradient-success">{{ $t(user.enabled_at ? 'common.fields.enabled' : 'common.fields.disabled') }}</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">{{ user.created_at }}</span>
              </td>
              <td class="align-middle">
                <router-link :to="{ name: 'users.edit', params: {id: user.id}}" tag="a" class="text-secondary font-weight-bold text-xs" data-original-title="Edit user">
                  {{ $t('common.actions.edit') }}
                </router-link>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-class-component'
import UserRepository from '@/repositories/UserRepository'
import {UserInterface} from '@/entities/UserInterface'

export default class Index extends Vue {
  users: Array<UserInterface> = []

  created(): void {
    UserRepository.getAll().then(users => {
      this.users = users
    })
  }
}
</script>
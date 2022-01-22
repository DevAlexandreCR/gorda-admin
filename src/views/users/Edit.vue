<template>
  <div class="container-fluid pb-4" v-if="user">
    <form @submit.prevent="updateUser">
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
                <label class="form-control-label" for="name">{{ $t('users.fields.name') }}</label>
                <div class="input-group">
                  <input type="text" class="form-control" :placeholder=" $t('common.placeholders.name')" id="name" v-model="user.name">
                </div>
              </div>
              <div class="form-group">
                <label class="form-control-label" for="email">{{ $t('users.fields.email') }}</label>
                <input type="email" class="form-control" id="email" :placeholder="$t('common.placeholders.email')" v-model="user.email">
              </div>
              <div class="form-group">
                <label class="form-control-label" for="phone">{{ $t('users.fields.phone') }}</label>
                <div class="input-group">
                  <input type="text" class="form-control" :placeholder=" $t('common.placeholders.phone')" id="phone" v-model="user.phone">
                </div>
              </div>
              <div class="form-group">
                <label class="form-control-label w-101" for="email">{{ $t('users.fields.role') }}:</label>
                <div class="form-check mb-4 d-inline-block ms-4">
                  <input class="form-check-input" type="radio" @change="assignRole" name="role" id="customRadio0" :checked="user.roles?.operator">
                  <label class="custom-control-label" for="customRadio0">{{ $t('users.fields.operator') }}</label>
                </div>
                <div class="form-check d-inline-block ms-3">
                  <input class="form-check-input" type="radio" name="role" @change="assignRole" id="customRadio1" :checked="user.roles?.admin">
                  <label class="custom-control-label" for="customRadio1">{{ $t('users.fields.admin') }}</label>
                </div>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" :checked="!!user.enabled_at" @change="onEnable">
                <label class="form-check-label" for="flexSwitchCheckDefault">{{ $t(user.enabled_at ? 'common.fields.enabled' : 'common.fields.disabled') }}</label>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <div class="card-footer text-end">
          <button class="btn btn-info" type="submit">{{ $t('common.actions.submit') }}</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-class-component'
import UserRepository from '@/repositories/UserRepository'
import User from '@/models/User'

export default class Edit extends Vue {
  user: User = new User({})

  updateUser(): void {
    UserRepository.update(this.user).then(() => {
      console.log('sss')
    }).catch(e => {
      console.log(e)
    })
  }

  onEnable(): void {
    this.user.enabled_at = this.user.isEnabled() ? undefined : new Date().toLocaleDateString()
  }

  assignRole(): void {
    if (this.user.roles?.admin) {
      this.user.roles = {
        operator: true,
        admin: false
      }
    } else {
      this.user.roles = {
        operator: false,
        admin: true
      }
      }
  }

  created(): void {
    UserRepository.getUser(this.$route.params.id as string).then(user => {
      this.user = new User(user)
    })
  }
}
</script>
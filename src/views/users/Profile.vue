<template>
  <div class="me-2">
    <div class="container-fluid">
      <div class="settings-card profile-banner-card">
        <div class="profile-banner-gradient"></div>
        <div class="profile-banner-strip">
          <div class="profile-avatar-tile">
            <img :src="logoUrl" alt="profile_image" class="profile-avatar-img">
          </div>
          <div class="profile-banner-info">
            <h5 class="profile-banner-name">{{ user.name }}</h5>
            <p class="profile-banner-email">{{ user.email }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid py-4">
      <div class="row g-3">
        <div class="col-12 col-xl-6">
          <div class="settings-card h-100">
            <div class="settings-card__header">
              <span class="settings-icon-chip settings-icon-chip--info">
                <em class="fas fa-id-card"></em>
              </span>
              <h6 class="settings-card__title">{{ $t('users.profile') }}</h6>
            </div>
            <div class="settings-card__body">
              <div class="profile-info-list">
                <div class="profile-info-row">
                  <em class="fas fa-user profile-info-icon"></em>
                  <div class="profile-info-text">
                    <span class="settings-field-label">{{ $t('users.fields.name') }}</span>
                    <span class="profile-info-value">{{ user.name }}</span>
                  </div>
                </div>
                <div class="profile-info-row">
                  <em class="fas fa-envelope profile-info-icon"></em>
                  <div class="profile-info-text">
                    <span class="settings-field-label">{{ $t('users.fields.email') }}</span>
                    <span class="profile-info-value">{{ user.email }}</span>
                  </div>
                </div>
                <div class="profile-info-row">
                  <em class="fas fa-phone profile-info-icon"></em>
                  <div class="profile-info-text">
                    <span class="settings-field-label">{{ $t('users.fields.phone') }}</span>
                    <span class="profile-info-value">{{ user.phone }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-xl-6">
          <div class="settings-card h-100">
            <div class="settings-card__header">
              <span class="settings-icon-chip settings-icon-chip--orange">
                <em class="fas fa-gear"></em>
              </span>
              <h6 class="settings-card__title">{{ $t('users.platform_settings') }}</h6>
            </div>
            <div class="settings-card__body">
              <span class="settings-field-label profile-roles-label">{{ $t('users.fields.roles') }}</span>
              <ul class="profile-roles-list">
                <li v-for="(value, role) in user.roles" :key="role">
                  <div class="profile-role-row" v-if="value">
                    <span class="settings-icon-chip settings-icon-chip--primary profile-role-chip">
                      <em class="fas fa-user-shield"></em>
                    </span>
                    <span class="profile-role-name">{{ $t('users.fields.' + role) }}</span>
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

<script setup lang="ts">
import User from '@/models/User'
import AuthService from '@/services/AuthService'
import {onBeforeMount, ref, Ref} from 'vue'
import {useStorage} from '@/services/stores/Storage'
import {storeToRefs} from 'pinia'

const user: Ref<User> = ref(new User())
const storage = useStorage()
const {logoUrl} = storeToRefs(storage)

onBeforeMount(() => {
  user.value = AuthService.getCurrentUser()
})
</script>

<style scoped>
/* Re-declared from SettingsApp.vue's shared foundation — Vue scoped styles don't cross SFCs. */
.settings-card {
  background: var(--surface-card);
  border-radius: 1rem;
  box-shadow: var(--shadow-card);
  overflow: hidden;
}
.settings-card__header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 1.1rem 1.25rem 0;
}
.settings-card__title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--text-heading);
}
.settings-card__body {
  padding: 1.25rem;
}
.settings-icon-chip {
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 0.55rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.8rem;
  box-shadow: 0 4px 7px -1px rgba(0, 0, 0, 0.11);
}
.settings-icon-chip--info { background: linear-gradient(310deg, #2152ff, #21d4fd); }
.settings-icon-chip--primary { background: var(--gradient-primary); }
.settings-icon-chip--orange { background: linear-gradient(310deg, #d6591f, #fb8c34); }
.settings-field-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

/* Banner header */
.profile-banner-card {
  padding: 0;
}
.profile-banner-gradient {
  height: 150px;
  background: linear-gradient(90deg, #ff0080, #7928ca);
}
.profile-banner-strip {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0 1.5rem 1.25rem;
  background: var(--surface-card);
}
.profile-avatar-tile {
  flex: none;
  width: 90px;
  height: 90px;
  margin-top: -45px;
  border-radius: 1rem;
  background: linear-gradient(310deg, #f8f9fa, #e9ecef);
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.profile-avatar-img {
  width: 70%;
  height: 70%;
  object-fit: contain;
}
.profile-banner-info {
  min-width: 0;
}
.profile-banner-name {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-heading);
}
.profile-banner-email {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

/* Info list — Card A */
.profile-info-list {
  display: flex;
  flex-direction: column;
}
.profile-info-row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--border-subtle);
}
.profile-info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.profile-info-row:first-child {
  padding-top: 0;
}
.profile-info-icon {
  flex: none;
  width: 1.2rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--primary);
}
.profile-info-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.profile-info-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-heading);
}

/* Roles — Card B */
.profile-roles-label {
  margin-bottom: 0.75rem;
}
.profile-roles-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.profile-role-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--border-color);
  border-radius: 0.55rem;
  background: var(--surface-input);
}
.profile-role-chip {
  width: 26px;
  height: 26px;
  font-size: 0.7rem;
}
.profile-role-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-heading);
}
</style>

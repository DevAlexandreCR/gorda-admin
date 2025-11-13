<template>
  <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl mt-3" id="navbarBlur">
    <div class="container-fluid py-1 px-3">
      <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
        <a href="javascript:" class="nav-link d-none d-xxl-block text-body p-0" id="iconNavbarSidenavLg">
          <div class="sidenav-toggler-inner">
            <em class="sidenav-toggler-line"></em>
            <em class="sidenav-toggler-line"></em>
            <em class="sidenav-toggler-line"></em>
          </div>
        </a>
        <div class="ms-md-auto pe-md-3 d-flex align-items-center">
        </div>
        <ul class="navbar-nav  justify-content-end">
          <li class="nav-item d-flex align-items-center me-2">
            <button
              type="button"
              class="btn btn-sm btn-outline-primary theme-toggle"
              :aria-label="themeButtonLabel"
              :title="themeButtonLabel"
              :aria-pressed="isDarkTheme"
              @click="onToggleTheme"
            >
              <em :class="['fa-solid', isDarkTheme ? 'fa-sun' : 'fa-moon']"></em>
              <span class="fw-semibold d-none d-lg-inline">{{ themeButtonLabel }}</span>
            </button>
          </li>
          <li class="nav-item ps-3 d-flex align-items-center">
            <a href="javascript:" class="nav-link d-xxl-none text-body p-0" id="iconNavbarSidenav">
              <div class="sidenav-toggler-inner">
                <em class="sidenav-toggler-line"></em>
                <em class="sidenav-toggler-line"></em>
                <em class="sidenav-toggler-line"></em>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import {computed} from 'vue'
import {storeToRefs} from 'pinia'
import {useI18n} from 'vue-i18n'
import {useThemeStore} from '@/services/stores/ThemeStore'

const themeStore = useThemeStore()
const {theme} = storeToRefs(themeStore)
const {t} = useI18n()

const isDarkTheme = computed(() => theme.value === 'dark')
const themeButtonLabel = computed(() => isDarkTheme.value ? t('common.actions.switch_to_light') : t('common.actions.switch_to_dark'))

const onToggleTheme = (): void => {
  themeStore.toggleTheme()
}
</script>

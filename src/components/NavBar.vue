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
          <li class="nav-item d-flex align-items-center">
          </li>
          <li class="nav-item d-flex align-items-center me-3">
            <button
              class="nav-link btn btn-link text-body p-0"
              type="button"
              :aria-label="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
              @click="toggleTheme"
            >
              <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'" aria-hidden="true"></i>
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
import {useThemeStore} from '@/services/stores/ThemeStore'

const theme = useThemeStore()
const isDark = computed(() => theme.isDark)
const toggleTheme = () => theme.toggle()
</script>
